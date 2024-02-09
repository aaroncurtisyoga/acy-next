import { list } from "@vercel/blob";

export const runtime = "edge";

export async function GET(request: Request) {
  const { blobs } = await list({ limit: 50 });
  return Response.json(blobs);
}
