import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};
const ProfilePage = async () => {
  return (
    <>
      <section
        className={
          "grid grow w-full md:min-h-[calc(100dvh-64px)] max-w-screen-2xl " +
          "md:grid-cols-[1fr,1fr] 11rem)] lg:mx-auto"
        }
      >
        <div>
          <h3>My Tickets</h3>
          <Link href="/#events">Explore More Events</Link>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
