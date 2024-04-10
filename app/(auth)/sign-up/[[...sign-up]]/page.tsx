import type { Metadata } from "next";
import { FC } from "react";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
};

const Page: FC = () => <SignUp />;

export default Page;
