"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import DetailsForInternallyHostedEvent from "@/components/events/EventForm/Steps/DetailsForInternallyHostedEvent";
import DetailsForExternallyHostedEvent from "@/components/events/EventForm/Steps/DetailsForExternallyHostedEvent";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsHostedExternally } from "@/lib/redux/features/eventFormSlice";

const CreateEvent = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const isHostedExternally = useAppSelector(selectIsHostedExternally);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      const isAdmin = user?.publicMetadata.role === "admin";
      if (!isAdmin) {
        router.push("/");
      }
    } else {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <section className={"wrapper"}>
      <h1>Update Event</h1>
      <div className={"my-8"}>
        {isHostedExternally ? (
          <DetailsForExternallyHostedEvent />
        ) : (
          <DetailsForInternallyHostedEvent />
        )}
      </div>
    </section>
  );
};

export default CreateEvent;
