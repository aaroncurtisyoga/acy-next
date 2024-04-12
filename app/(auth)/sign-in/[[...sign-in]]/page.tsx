import type { Metadata } from "next";
import { FC } from "react";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
};

const Page: FC = () => <SignIn />;

export default Page;
