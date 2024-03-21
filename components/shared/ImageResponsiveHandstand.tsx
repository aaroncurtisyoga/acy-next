import { getImageProps } from "next/image";
import { getBase64 } from "@/lib/utils/base64";

export default async function ImageResponsiveHandstand() {
  const blurDataURLMobile = await getBase64(
    "https://hyhtjblnarllhg0d.public.blob.vercel-storage.com/handstand_mobile-culATacmiJLfv88adfOLtp3q1uYeYH.jpeg",
  );
  const blurDataURLDesktop = await getBase64(
    "https://hyhtjblnarllhg0d.public.blob.vercel-storage.com/handstand_desktop-o4lcMigM1mvB2fLffSaWmOS4BN2hqZ.jpeg",
  );

  const common = {
    alt: "Aaron doing handstand posture",
    className: "object-cover",
    fill: true,
  };

  const {
    props: { srcSet: mobile },
  } = getImageProps({
    ...common,
    blurDataURL: blurDataURLMobile,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 70,
    sizes: "100vw",
    src: "https://hyhtjblnarllhg0d.public.blob.vercel-storage.com/handstand_mobile-culATacmiJLfv88adfOLtp3q1uYeYH.jpeg",
  });

  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({
    ...common,
    blurDataURL: blurDataURLDesktop,
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 80,
    sizes: "50vw",
    src: "https://hyhtjblnarllhg0d.public.blob.vercel-storage.com/handstand_desktop-o4lcMigM1mvB2fLffSaWmOS4BN2hqZ.jpeg",
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
