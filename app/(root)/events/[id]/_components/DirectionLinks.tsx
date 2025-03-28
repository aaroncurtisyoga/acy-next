import { FC } from "react";
import { Location } from "@prisma/client";
import { travelOptions } from "@/app/_lib/constants";
import { generateDirectionsUrl } from "@/app/_lib/utils/travelLinks";

interface DirectionLinksProps extends Pick<Location, "lat" | "lng"> {}

const DirectionLinks: FC<DirectionLinksProps> = ({ lat, lng }) => {
  return (
    <div className={"w-full py-4 border-b"}>
      <p className={"text-center font-semibold text-default-700 mb-6"}>
        How to get there
      </p>
      <div className="text-primary">
        <ul className={"flex justify-center"}>
          {travelOptions.map((option) => (
            <li key={option.travelMode} className={"border-r last:border-r-0"}>
              <a
                className={"px-8 inline-block"}
                target="_blank"
                href={generateDirectionsUrl(lat, lng, option.travelMode)}
              >
                <option.icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DirectionLinks;
