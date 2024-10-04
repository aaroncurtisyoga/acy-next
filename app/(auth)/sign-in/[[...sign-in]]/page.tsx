import { FC } from "react";
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const Page: FC = () => <SignIn />;

export default Page;
