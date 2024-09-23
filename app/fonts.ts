import { Merriweather, Roboto_Flex } from "next/font/google";

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"], // Customize weights as needed
});

export const robotoFlex = Roboto_Flex({ subsets: ["latin"] });
