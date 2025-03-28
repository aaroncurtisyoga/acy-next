"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Event } from "@prisma/client";
import { getEventById } from "@/app/_lib/actions/event.actions";
import { setFormData } from "@/app/_lib/redux/features/eventFormSlice";
import { useAppDispatch } from "@/app/_lib/redux/hooks";
import { handleError } from "@/app/_lib/utils";
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
