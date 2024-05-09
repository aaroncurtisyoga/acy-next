"use client";

import { FC } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface EventMapProps {
  lat: number;
  lng: number;
}
const EventMap: FC<EventMapProps> = ({ lat, lng }) => {
  const position = { lat, lng };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "400px", width: "400px" }}>
        <Map defaultCenter={position} defaultZoom={15}>
          <Marker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default EventMap;
