import { travelOptions } from "@/constants";
import { generateDirectionsUrl } from "@/lib/utils/travelLinks";

interface DirectionLinksProps {
  location: { geometry: { lat: any; lng: any } };
}

const DirectionLinks = ({ location }: DirectionLinksProps) => {
  return (
    <div className={"w-full py-unit-4 border-b"}>
      <p className={"text-center font-semibold text-default-700 mb-unit-6"}>
        How to get there
      </p>
      <div className="text-primary">
        <ul className={"flex justify-center"}>
          {travelOptions.map((option) => (
            <li key={option.travelMode} className={"border-r last:border-r-0"}>
              <a
                className={"px-unit-8 inline-block"}
                target="_blank"
                href={generateDirectionsUrl(location, option.travelMode)}
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
