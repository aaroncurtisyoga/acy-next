import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || !/^\/(works|books)\/OL\d+[WM]$/.test(key)) {
    return NextResponse.json({ description: null }, { status: 400 });
  }

  const url = `https://openlibrary.org${key}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ description: null }, { status: 502 });
  }

  const data = await res.json();

  let description: string | null = null;
  if (typeof data.description === "string") {
    description = data.description;
  } else if (data.description?.value) {
    description = data.description.value;
  }

  return NextResponse.json({ description });
}
