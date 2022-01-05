import Profile from "./profile/profile";
import LinkTree from "./link-tree/link-tree";
import classes from "./info.module.scss";

export default function Info() {
  return (
    <section className={classes.wrapper}>
      <div className={classes.content}>
        <Profile />
        <LinkTree />
      </div>
    </section>
  );
}
