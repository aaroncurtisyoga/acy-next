import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { assertAdminRequest } from "@/app/_lib/api-auth";

/*
   Vercel Blob Documentation:
   https://vercel.com/docs/storage/vercel-blob/client-upload
*/
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const denied = await assertAdminRequest();
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".pdf",
    ];
    const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Accepted: ${allowedExtensions.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate file size (10MB max)
    const contentLength = request.headers.get("content-length");
    const MAX_SIZE = 10 * 1024 * 1024;
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 },
      );
    }

    const blob = await put(filename, request.body, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
