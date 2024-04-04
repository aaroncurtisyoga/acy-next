import { getImageProps } from "next/image";

export default async function ImageResponsiveHandstand() {
  const common = {
    alt: "Aaron doing handstand posture",
    className: "object-cover",
    fill: true,
  };

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    blurDataURL:
      "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAAAAAAAAAHqZRakAAAAI0lEQVR4nGPw9lSfPamoy09GS5iBoTDM4v/Pp49mxpsxMAAAdeQJeNRJN/oAAAAASUVORK5CYII='/%3E%3C/svg%3E",
    loading: "eager",
    placeholder: "blur",
    priority: true,
    quality: 50,
    sizes: "100vw",
    src: "/assets/images/handstand_mobile.jpeg",
  });

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    blurDataURL:
      "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAAAAAAAAAHqZRakAAAAP0lEQVR4nAE0AMv/AP/nstiqfIRfOv/grQAtTTBRRCs7AAA2AAAAjrKu387AxW4weCkAAP/pwv/rx/PHnd6keoJmGiiyN7ngAAAAAElFTkSuQmCC'/%3E%3C/svg%3E",
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
