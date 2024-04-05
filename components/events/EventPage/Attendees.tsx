import { Avatar, AvatarGroup } from "@nextui-org/react";
const Attendees = ({ isHostedExternally }) => {
  const maxAvatarsShown = 5;

  // todo: replace w/ actual attendees after api call is made...
  const totalAvatarsHidden = [].length - maxAvatarsShown;

  if (isHostedExternally) return null;

  return (
    <div>
      {/* todo: skeleton for when attendees is still loading */}
      {/* todo: put total number of attendees in () below */}
      <h2 className={"text-2xl font-bold mb-3"}>Attendees ()</h2>
      <AvatarGroup
        isBordered
        max={maxAvatarsShown}
        total={10}
        className={"justify-start mb-6 md:mb-8"}
      >
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
      </AvatarGroup>
    </div>
  );
};

export default Attendees;
