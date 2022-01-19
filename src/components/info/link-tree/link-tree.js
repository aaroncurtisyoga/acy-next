import classes from "./link-tree.module.scss";
import Link from "next/link";

export default function LinkTree() {
  return (
    <ul className={classes.linkTree}>
      {links.map(({ title, url, interal }) => {
        return (
          <li key={title} className={classes.link}>
            {interal ? (
              <Link href={url} />
            ) : (
              <a href={url} target={`_blank`}>
                {title}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const links = [
  {
    title: "find a yoga class",
    url: "https://clients.mindbodyonline.com/classic/mainclass?studioid=2070",
    desc: "I teach at Yoga District. Hop over to their scheduling site to sign up for a class with me :) ",
    internal: false,
  },
  {
    title: "www.aaroncurtisyoga.com",
    url: "/",
    desc: "",
    internal: true,
  },
  // {
  //   title: "ytt blog series",
  //   url: "https://www.yogadistrict.com/category/training/",
  //   desc: "",
  //   internal: false,
  // },
  {
    title: "playlists",
    url: "https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy",
    desc: "",
    internal: false,
  },
];
