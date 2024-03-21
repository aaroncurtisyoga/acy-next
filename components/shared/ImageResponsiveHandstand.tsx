import { getImageProps } from "next/image";
import handstandMobile from "../../public/assets/images/handstand_mobile.jpg";
import handstandDesktop from "../../public/assets/images/handstand_desktop.jpg";

export default function ImageResponsiveHandstand() {
  const common = {
    alt: "Aaron doing handstand posture",
    className: "object-cover",
    fill: true,
  };

  const {
    props: { srcSet: mobile },
  } = getImageProps({
    ...common,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 60,
    sizes: "100vw",
    src: handstandMobile,
  });

  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({
    ...common,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 80,
    sizes: "50vw",
    src: handstandDesktop,
  });

  return (
    <picture>
      <source
        media="(max-width: 767px)"
        className={"block aspect-[2/1]"}
        srcSet={mobile}
      />
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img alt={"Aaron doing handstand posture"} {...rest} />
    </picture>
  );
}
