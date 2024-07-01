import React, { FC } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { CircleCheck } from "lucide-react";

const PrivateSessions: FC = () => {
  return (
    <section className={"wrapper"}>
      <div className="max-w-xl mx-auto">
        <h1
          className={"text-4xl font-bold mb-3 text-center mt-12 tracking-tight"}
        >
          Train With Me
        </h1>
        <p className={"text-center text-gray-500"}>
          Whether you want to focus on a certain posture, or you&apos;re looking
          for support in various aspects of your yoga journey, you can schedule
          a single session or a group of sessions all catered towards your
          personal goals.
        </p>
      </div>
      <Card className="max-w-[312px]">
        <CardHeader>
          <div className="flex flex-col">
            <p className="text-md">1 Session</p>
            <p className="text-small text-default-500">1 hour of training</p>
          </div>
        </CardHeader>
        <CardBody>
          <p>This includes:</p>
          <ul>
            <li className={"flex"}>
              <CircleCheck />
              Personalized programming
            </li>
            <li className={"flex"}>
              <CircleCheck />
              Virtual or In Person
            </li>
            <li className={"flex"}>
              <CircleCheck />
              Breathwork
            </li>
            <li className={"flex"}>
              <CircleCheck />
              Meditation
            </li>
          </ul>
        </CardBody>
      </Card>
    </section>
  );
};

export default PrivateSessions;
