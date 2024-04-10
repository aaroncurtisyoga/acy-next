"use client";

import { CircleAlert } from "lucide-react";

export default function ErrorBoundary() {
  return (
    <div className="flex flex-col justify-center items-center max-w-4xl mx-auto mt-16 gap-4">
      <CircleAlert className={"text-yellow-500"} size={100} />
      <h1 className={"text-5xl text-center font-extrabold "}>
        Whoops, the page or event you are looking for was not found.
      </h1>
      <h2 className={"text-2xl text-gray-500"}>
        If you feel this message is in error, please let us know.
      </h2>
    </div>
  );
}
