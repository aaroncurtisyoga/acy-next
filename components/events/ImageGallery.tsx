"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ImageGallery = () => {
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
    <ul className="px-2 my-3 grid grid-cols gap-2 grid-cols-gallery">
      {images.map((image: any) => (
        <li key={image.url}>
          <Image
            src={image.url}
            alt={image.pathname}
            width={940}
            height={470}
          />
        </li>
      ))}
    </ul>
  );
};

export default ImageGallery;
