import React from "react";
import { AudioLines, Instagram, Youtube } from "lucide-react";

/* Todo
 *   Improve styles
 *   Make icons actual links
 * */
const Footer = () => {
  return (
    <footer className={"w-full border-t"}>
      <div className="wrapper flex md:justify-between">
        <div className={"hidden md:block"}>
          © {new Date().getFullYear()} All rights reserved.
        </div>
        <div className={"flex justify-between"}>
          <AudioLines />
          <Instagram />
          <Youtube />
        </div>
        <div className={"hidden md:block"}>Made by Aaron</div>
      </div>
    </footer>
  );
};

export default Footer;
