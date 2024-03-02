"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { getImages } from "@/lib/actions/blob.actions";
import { cn } from "@/lib/utils";

const ImagePicker = ({ setValue }) => {
  const [images, setImages] = useState([]);
  const [selectedImgUrl, setSelectedImgUrl] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleGetImages = async () => {
    console.log("handelGetImages called");
    const images = await getImages();
    setImages(images);
  };

  const setHeroImage = () => setValue("imgLarge", selectedImgUrl);

  return (
    <>
      <Button variant={"bordered"} onPress={onOpen}>
        Choose an image
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          console.log("onOpenChange called");
          onOpenChange();
          if (isOpen) {
            handleGetImages();
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose a hero image
              </ModalHeader>
              <ModalBody>
                {images?.map((image: any) => (
                  <Image
                    key={image.pathname}
                    src={image.url}
                    alt={image.pathname}
                    fill={true}
                    sizes={"940px"}
                    onClick={() => setSelectedImgUrl(image.url)}
                    className={cn({
                      "border-1 border-primary": selectedImgUrl === image.url,
                    })}
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={setHeroImage}>
                  Select Image
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImagePicker;
