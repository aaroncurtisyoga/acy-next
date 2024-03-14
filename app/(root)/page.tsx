import Image from "next/image";
import handstandProfile from "@/public/assets/images/ScissorHandstand_LowRes-min.jpg";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import { SearchParamProps } from "@/types";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  return (
    <section
      className={
        "grid md:grid-cols-[1fr,1fr] 11rem)] grow w-full" +
        " max-w-screen-2xl lg:mx-auto min-h-[calc(100dvh-64px)] "
      }
    >
      <div className={"relative"}>
        <Image
          alt="Yoga posture hand to big toe"
          className="object-cover"
          fill={true}
          sizes="(min-width: 1640px) 768px, calc(45vw + 39px)"
          priority={true}
          placeholder={"blur"}
          loading="eager"
          src={handstandProfile}
        />
      </div>
      <UpcomingEvents searchParams={searchParams} />
    </section>
  );
};

export default EventsPage;

//  h-[calc(100vh - 64px)]
