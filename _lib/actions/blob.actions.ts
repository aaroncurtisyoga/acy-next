"use server";

export const getImages = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-blobs`,
    );
    if (!response.ok) throw new Error("Error fetching images");
    return await response.json();
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
};
