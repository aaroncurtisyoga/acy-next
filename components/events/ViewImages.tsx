import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ViewImages = () => {
  const [images, setImages] = useState([]);

  const getImages = async (blobName: string) => {
    const response = await fetch(`/api/get-blobs`);
    const data = await response.json();
    setImages(data);
  };

  const openModal = async () => {};
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant={"outline"} onClick={() => openModal()}>
            View Images from Vercel Blob Storage
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Browse Images</DialogTitle>
            <DialogDescription>
              Here are all the images you have uploaded to the Vercel Blob
              Storage
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4"></div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewImages;
