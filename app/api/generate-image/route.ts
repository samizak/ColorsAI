import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
    });

    const modifiedPrompt = `${prompt}, colouring book art style, only outlines, only black and white`;
    const response = await model.generateContent(modifiedPrompt);

    const imagePart = response.response?.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    const imageData = imagePart.inlineData.data;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ 
        imageData,
        message: "Image generated but not saved (user not authenticated)" 
      });
    }

    const { data: savedImage, error: saveError } = await supabase
      .from("coloring_pages")
      .insert({
        title: prompt.substring(0, 100),
        image: `data:image/png;base64,${imageData}`,
        user_id: user.id,
        is_ai_generated: true,
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ 
        imageData,
        message: "Image generated but failed to save",
        error: saveError 
      });
    }

    return NextResponse.json({ imageData, savedImage });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
