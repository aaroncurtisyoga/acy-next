"use client";

import { useRouter, useParams } from "next/navigation";
import React, { FC, useEffect } from "react";
import { Event } from "@prisma/client";
import { handleError } from "@/_lib/utils";
import { getEventById } from "@/_lib/actions/event.actions";
import { useAppDispatch } from "@/_lib/redux/hooks";
import { setFormData } from "@/_lib/redux/features/eventFormSlice";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const UpdateEvent: FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event: Event = await getEventById(id);
        dispatch(setFormData(event));
      } catch (err) {
        handleError(err);
        router.push("/");
      }
    };

    fetchEvent();
  }, [dispatch, id, router]);

  return (
    <section className={"wrapper"}>
      <h1>Update Event</h1>
      <div>
        <BasicInfo />
      </div>
    </section>
  );
};

export default UpdateEvent;
