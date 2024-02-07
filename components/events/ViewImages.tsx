import { Button } from "@/components/ui/button";

const ViewImages = () => {
  const openModal = async () => {
    const response = await fetch(`/api/get-blobs`);
    const data = await response.json();
  };
  return (
    <div>
      <Button type="button" variant={"outline"} onClick={() => openModal()}>
        View Images Already Uploaded
      </Button>
    </div>
  );
};

export default ViewImages;
