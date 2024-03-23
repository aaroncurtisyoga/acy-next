import Link from "next/link";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};
const ProfilePage = async () => {
  return (
    <>
      <section>
        <div>
          <h3>My Tickets</h3>
          <Link href="/#events">Explore More Events</Link>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
