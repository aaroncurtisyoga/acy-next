import { Avatar, AvatarGroup } from "@nextui-org/react";
import { IUser } from "@/lib/mongodb/database/models/user.model";

interface AttendeesProps {
  attendees: IUser[];
}

function Attendees({ attendees }: AttendeesProps) {
  const maxAvatarsShown = 5;
  const totalAvatarsHidden = attendees.length - maxAvatarsShown;
  if (!attendees) return null;

  return (
    <div>
      <h2 className={"text-2xl font-bold mb-3"}>
        Attendees ({attendees.length})
      </h2>
      <AvatarGroup
        isBordered
        max={maxAvatarsShown}
        total={totalAvatarsHidden}
        className={"justify-start mb-6 md:mb-8"}
      >
        {attendees.map((attendee, index) => (
          <Avatar
            key={`${index}-${attendee.firstName}`}
            name={attendee.firstName?.charAt(0) + attendee.lastName?.charAt(0)}
            src={attendee.photo || undefined}
          />
        ))}
      </AvatarGroup>
    </div>
  );
}

export default Attendees;
