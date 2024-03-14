import { getImageProps } from "next/image";
import imgHandstandDesktop from "@/public/assets/images/handstand_desktop.jpg";
// import imgHandstandDesktop from "@/public/assets/images/handstand_desktop.jpg";

export default function HomepageHero() {
  const common = { alt: "Aaron doing handstand posture", sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    fill: true,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 80,
    src: imgHandstandDesktop,
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    fill: true,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 70,
    src: "/mobile.jpg",
  });

  return (
    <picture>
      <source media="(min-width: 1000px)" srcSet={desktop} />
      <source media="(min-width: 500px)" srcSet={mobile} />
      <img
        alt="Aaron Curtis in Handstand"
        className="object-cover"
        style={{ width: "100%", height: "auto" }}
        {...rest}
      />
    </picture>
  );
}
