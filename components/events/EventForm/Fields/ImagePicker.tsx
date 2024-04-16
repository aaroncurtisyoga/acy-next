"use client";

import Image from "next/image";
import React, { FC, useState } from "react";
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

interface ImagePickerProps {
  errors: any;
  setValue: any;
}

const ImagePicker: FC<ImagePickerProps> = ({ errors, setValue }) => {
  const [images, setImages] = useState([]);
  const [selectedImgUrl, setSelectedImgUrl] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const setHeroImage = () => setValue("imageUrl", selectedImgUrl);

  const handleGetImages = async () => {
    const images = await getImages();
    setImages(images);
  };

  const handlePressOpenButton = () => {
    handleGetImages();
    onOpen();
  };

  return (
    <>
      <div className={"w-full flex flex-col"}>
        <Button
          variant={"bordered"}
          size={"lg"}
          onPress={handlePressOpenButton}
        >
          Choose an image
        </Button>
        {errors.imageUrl?.message && (
          <div className="p-1 flex relative flex-col gap-1.5">
            <div className="text-tiny text-danger">
              {errors.imageUrl.message}
            </div>
          </div>
        )}
      </div>
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
