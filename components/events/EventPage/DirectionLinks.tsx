import { travelOptions } from "@/constants";
import { generateDirectionsUrl } from "@/lib/utils/travelLinks";

interface DirectionLinksProps {
  location: { geometry: { lat: any; lng: any } };
}
const DirectionLinks = ({ location }: DirectionLinksProps) => {
  return (
    <div className={"w-full"}>
      <p className={"text-center"}>How to get there</p>
      <div className=" text-primary-600">
        <ul className={"flex justify-center"}>
          {travelOptions.map((option) => (
            <li key={option.travelMode}>
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
