"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

const PrivateSessionsPage: FC = () => {
  const router = useRouter();

  // Redirect to the welcome page
  useEffect(() => {
    router.push("/private-sessions/welcome");
  }, [router]);

  return <div>Redirecting...</div>;
};

export default PrivateSessionsPage;
