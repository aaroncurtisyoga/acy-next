"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ImageGallery = ({ setSelectedImg }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages().then((images) => setImages(images));
  }, []);

  const getImages = async () => {
    try {
      const response = await fetch(`/api/get-blobs`);
      if (!response.ok) throw new Error("Error fetching images");
      return await response.json();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  return (
    <section>
      {images.map((image: any) => (
        <Image
          key={image.pathname}
          src={image.url}
          alt={image.pathname}
          fill={true}
          sizes={"940px"}
          onClick={() => setSelectedImg(image.url)}
        />
      ))}
    </section>
  );
};

export default ImageGallery;
