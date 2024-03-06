import { getPlaiceholder } from "plaiceholder";
import { handleError } from "@/lib/utils/index";

export async function getBase64(imageUrl: string) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    console.log(`base64`, base64);
    return base64;
  } catch (error) {
    handleError(error);
  }
}
