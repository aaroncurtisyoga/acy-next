"use client";

import { useRouter, useParams } from "next/navigation";
import React, { FC, useEffect } from "react";
import { checkRole, handleError } from "@/lib/utils";
import BasicInfo from "@/components/events/EventForm/Steps/BasicInfo";
import { getEventById } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setFormData } from "@/lib/redux/features/eventFormSlice";

const UpdateEvent: FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event: IEvent = await getEventById(id);
        dispatch(setFormData(event));
      } catch (err) {
        handleError(err);
        router.push("/");
      }
    };

    if (!checkRole("admin")) {
      router.push("/");
    } else {
      fetchEvent();
    }
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
