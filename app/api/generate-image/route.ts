import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ["Text", "Image"],
        },
      } as any);

      const modifiedPrompt = `${prompt}, colouring book art style, only outlines, only black and white`;
      
      const response = await model.generateContent(modifiedPrompt);

      const imagePart = response.response?.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        console.error("No image data in response:", JSON.stringify(response.response));
        return NextResponse.json(
          { error: "Failed to generate image - no image data in response" },
          { status: 500 }
        );
      }

      const imageData = imagePart.inlineData.data;
      
      // Database operations
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return NextResponse.json({
            imageData,
            message: "Image generated but not saved (user not authenticated)",
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
          console.error("Database save error:", saveError);
          return NextResponse.json({
            imageData,
            message: "Image generated but failed to save",
            error: saveError,
          });
        }

        return NextResponse.json({ imageData, savedImage });
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        return NextResponse.json({
          imageData,
          message: "Image generated but database operation failed",
          error: dbError instanceof Error ? dbError.message : String(dbError),
        });
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      return NextResponse.json(
        { 
          error: "Failed to generate image with AI", 
          details: aiError instanceof Error ? aiError.message : String(aiError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
