import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Spacer,
} from "@heroui/react";

const EventPreview = ({ event }) => {
  const {
    title,
    description,
    category,
    startDateTime,
    endDateTime,
    location,
    price,
    maxAttendees,
    imageUrl,
  } = event;

  return (
    <Card className="max-w-[600px]">
      <CardHeader className="flex gap-3">
        <Image alt={title} height={60} radius="sm" src={imageUrl} width={60} />
        <div className="flex flex-col">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-small text-default-500">{location.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        <Spacer y={0.5} />
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Location:</strong> {location.formattedAddress}
        </p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {new Date(startDateTime).toLocaleString()} -{" "}
          {new Date(endDateTime).toLocaleString()}
        </p>
        <p>
          <strong>Price:</strong> ${price}
        </p>
        <p>
          <strong>Max Attendees:</strong> {maxAttendees}
        </p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal href={location.url || "#"} showAnchorIcon>
          View Location on Map
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventPreview;
