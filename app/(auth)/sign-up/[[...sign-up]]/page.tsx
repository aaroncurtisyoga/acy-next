import { FC } from "react";
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

const Page: FC = () => <SignUp />;

export default Page;
