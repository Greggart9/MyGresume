import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = "";
    let base64 = "";
    let isPDF = false;

    if (ext === "pdf") {
      // Return base64 for Gemini to parse directly
      base64 = buffer.toString("base64");
      isPDF = true;
      // Also extract text as fallback
      const { extractText } = await import("unpdf");
      const uint8Array = new Uint8Array(arrayBuffer);
      const result = await extractText(uint8Array, { mergePages: true });
      text = (result as any).text || "";
    } else if (ext === "txt" || ext === "rtf") {
      text = buffer.toString("utf-8");
    } else if (ext === "docx" || ext === "doc") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: `Unsupported file type .${ext}. Use PDF, DOCX, DOC, or TXT.` },
        { status: 400 }
      );
    }

    if (!text.trim() && !base64) {
      return NextResponse.json(
        { error: "Could not extract text. Try pasting your resume instead." },
        { status: 400 }
      );
    }

    const cleaned = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{4,}/g, "\n\n\n")
      .trim();

    return NextResponse.json({ text: cleaned, base64, isPDF });

  } catch (error: any) {
    console.error("Upload error:", error?.message);
    return NextResponse.json(
      { error: "Failed to read file: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}