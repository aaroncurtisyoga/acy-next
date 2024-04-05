import { Avatar, AvatarGroup } from "@nextui-org/react";
import { getEventAttendees } from "@/lib/actions/event.actions";

interface AttendeesProps {
  isHostedExternally: boolean;
  eventId: string;
}

function Attendees({ isHostedExternally, eventId }: AttendeesProps) {
  const maxAvatarsShown = 5;
  // Call getEventAttendees here and get the actual attendees
  // Server Components allow us to access back-end resources directly

  // use your server side method to obtain attendees
  // remember to modify it to your actual method. This is just an example
  let attendees = getEventAttendees(eventId);

  // const totalAvatarsHidden = attendees.length - maxAvatarsShown;

  if (isHostedExternally) return null;

  return (
    <div>
      {/* todo: skeleton for when attendees is still loading */}
      <h2 className={"text-2xl font-bold mb-3"}>
        {/*Attendees ({attendees.length})*/}
      </h2>
      <p>attendees</p>
      {/*<AvatarGroup
        isBordered
        max={maxAvatarsShown}
        total={10}
        className={"justify-start mb-6 md:mb-8"}
      >
        {attendees.map((attendee, index) => (
          <Avatar
            key={`${index}-${attendee.firstName}`}
            name={attendee.firstName?.charAt(0) + attendee.lastName?.charAt(0)}
          />
        ))}
      </AvatarGroup>*/}
    </div>
  );
}

export default Attendees;
