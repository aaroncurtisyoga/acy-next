import classes from "./link-tree.module.scss";

export default function LinkTree() {
  return (
    <ul className={classes.linkTree}>
      {links.map(({ title, url }) => {
        return (
          <li key={title} className={classes.link}>
            <a href={url} target={`_blank`}>
              {title}
            </a>
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
  },
  {
    title: "www.aaroncurtisyoga.com",
    url: "https://www.aaroncurtisyoga.com",
    desc: "",
  },
  {
    title: "ytt blog series",
    url: "https://www.yogadistrict.com/category/training/",
    desc: "",
  },
  {
    title: "playlists",
    url: "https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy",
    desc: "",
  },
];
