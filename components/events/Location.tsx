import { MapPin } from "lucide-react";

const Location = (location) => {
  return (
    <>
      <h2 className={"text-2xl font-bold mb-3"}>Location</h2>
      <div className={"flex items-center mb-6 gap-4 md:mb-8"}>
        <MapPin size={14} />
        <p className={"text-sm"}>{location.main}</p>
        <p className={"text-sm"}>{location.description}</p>
        {/* todo: show map here */}
      </div>
    </>
  );
};

export default Location;
