import React from "react";
import { AudioLines, Instagram, Youtube } from "lucide-react";
const Footer = () => {
  return (
    <footer className={"w-full flex md:justify-between"}>
      <div>© {new Date().getFullYear()} All rights reserved.</div>
      <div className={"flex justify-between"}>
        <AudioLines />
        <Instagram />
        <Youtube />
      </div>
      <div>Made by Aaron</div>
    </footer>
  );
};

export default Footer;
