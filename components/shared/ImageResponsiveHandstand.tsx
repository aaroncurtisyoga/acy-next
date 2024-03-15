import { getImageProps } from "next/image";
import imgHandstandMobile from "@/public/assets/images/handstand_mobile.jpg";
import imgHandstandDesktop from "@/public/assets/images/handstand_desktop.jpg";

export default function ImageResponsiveHandstand() {
  const common = { alt: "Aaron doing handstand posture", sizes: "100vw" };
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    fill: true,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 70,
    src: imgHandstandMobile,
  });
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

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile} />
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img
        alt="Aaron Curtis in Handstand"
        className="object-cover"
        style={{ width: "100%", height: "auto" }}
        {...rest}
      />
    </picture>
  );
}
