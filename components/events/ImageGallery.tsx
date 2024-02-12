"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    <section className="grid grid-cols grid-cols-3 gap-2 ">
      {images.map((image: any) => (
        <AspectRatio
          key={image.pathname}
          ratio={2}
          className="bg-muted relative overflow-hidden rounded-xl group cursor-pointer"
          onClick={() => setSelectedImg(image.url)}
        >
          <Image
            src={image.url}
            alt={image.pathname}
            fill={true}
            className={"object-cover group-hover:opacity-75"}
            sizes={"940px"}
          />
        </AspectRatio>
      ))}
    </section>
  );
};

export default ImageGallery;