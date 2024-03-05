import Map from "@/components/shared/Map";
import DirectionLinks from "@/components/events/EventPage/DirectionLinks";

const Location = ({ location }) => {
  return (
    <>
      <h2>Location</h2>
      <div>
        <p>{location.name}</p>
        <p>{location.formattedAddress}</p>
        {/*<Map geometry={location.geometry} />*/}
        {/*<DirectionLinks location={location} />*/}
      </div>
    </>
  );
};

export default Location;
