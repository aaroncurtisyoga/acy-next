"use client";

import Image from "next/image";
import { useState } from "react";
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

  const setHeroImage = () => setValue("imgLarge", selectedImgUrl);

  const handleGetImages = async () => {
    console.log("handelGetImages called");
    const images = await getImages();
    setImages(images);
  };

  const handleOnPress = () => {
    handleGetImages();
    onOpen();
  };

  return (
    <>
      <Button variant={"bordered"} size={"lg"} onPress={handleOnPress}>
        Choose an image
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"full"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose a hero image
              </ModalHeader>
              <ModalBody
                className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}
              >
                {images?.map((image: any) => (
                  <div key={image.pathname} className={"relative "}>
                    <Image
                      src={image.url}
                      alt={image.pathname}
                      sizes={"470px"}
                      onClick={() => setSelectedImgUrl(image.url)}
                      className={cn(
                        "object-cover overflow-hidden  rounded-small" +
                          " hover:opacity-75 hover:cursor-pointer",
                        {
                          "border-1 border-primary":
                            selectedImgUrl === image.url,
                        },
                      )}
                      fill={true}
                    />
                  </div>
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
