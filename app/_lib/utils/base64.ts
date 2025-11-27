import sharp from "sharp";
import { handleError } from "@/app/_lib/utils/index";

export async function getBase64(imageUrl: string) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const buffer = await res.arrayBuffer();

    // Use sharp to create a small blurred placeholder image
    const resizedBuffer = await sharp(Buffer.from(buffer))
      .resize(10, 10, { fit: "inside" })
      .blur()
      .toBuffer();

    const base64 = `data:image/png;base64,${resizedBuffer.toString("base64")}`;
    return base64;
  } catch (error) {
    handleError(error);
    return "";
  }
}
