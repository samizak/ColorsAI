import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    } as any);

    // Prompt to enforce coloring book art style
    const modifiedPrompt =
      prompt +
      ", colouring book art style, only outlines , only black and white";

    const response = await model.generateContent(modifiedPrompt);

    if (!response.response?.candidates?.[0]?.content?.parts) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const imagePart = response.response.candidates[0].content.parts.find(
      (part: any) => part.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const imageData = imagePart.inlineData.data;

    return NextResponse.json({ imageData });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
