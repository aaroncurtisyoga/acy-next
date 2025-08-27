import { list } from "@vercel/blob";

export async function GET(_request: Request, options) {
  const { blobs } = await list(options);
  return Response.json(blobs);
}
