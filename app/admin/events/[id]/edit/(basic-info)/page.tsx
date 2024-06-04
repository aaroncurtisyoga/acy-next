"use client";

import { useRouter, useParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { Event } from "@prisma/client";
import { handleError } from "@/_lib/utils";
import { getEventById } from "@/_lib/actions/event.actions";
import { useAppDispatch } from "@/_lib/redux/hooks";
import { setFormData } from "@/_lib/redux/features/eventFormSlice";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const UpdateEvent: FC = () => {
  const [isEventLoaded, setIsEventLoaded] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event: Event = await getEventById(id);
        console.log(event);
        dispatch(setFormData(event));
        setIsEventLoaded(true);
      } catch (err) {
        handleError(err);
        router.push("/");
      }
    };

    fetchEvent();
  }, [dispatch, id, router]);

  if (!isEventLoaded) return null;

  return (
    <section className={"wrapper"}>
      <h1 className={"mb-5"}>Update Event</h1>
      <BasicInfo />
    </section>
  );
};

export default UpdateEvent;
