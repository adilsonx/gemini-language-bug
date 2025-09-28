import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    // Initialize Gemini model - using the problematic model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-09-2025",
    });

    // This is the EXACT prompt that causes the language bug
    const prompt = `Analyze this PDF document and provide a detailed summary. Keep the response in the original language of the document.

    Your summary should include:
    1. The main subject of the document
    2. Key points and important ideas
    3. Main conclusions
    4. An overview of the document structure

    Format your response in markdown with clear sections and bullet points if necessary.

    IMPORTANT: Write your response in the same language as the source document.

    Here is the document to analyze:`;

    // Generate content with the PDF
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
    ]);

    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({
      summary,
      fileName: file.name,
      fileSize: file.size,
      model: "gemini-2.5-flash-lite-preview-09-2025",
      promptUsed: prompt,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);

    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (
        error.message.includes("503") &&
        error.message.includes("overloaded")
      ) {
        return NextResponse.json(
          {
            error:
              "Service temporarily overloaded. Please retry in a few moments.",
          },
          { status: 503 }
        );
      }

      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "API quota exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error processing PDF" },
      { status: 500 }
    );
  }
}
