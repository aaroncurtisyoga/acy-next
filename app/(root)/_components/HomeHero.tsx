import Link from "next/link";
import ImageResponsiveHandstand from "@/app/(root)/_components/ImageResponsiveHandstand";

export default function HomeHero() {
  return (
    <section
      data-testid="home-hero"
      className="relative grid overflow-hidden bg-navy md:min-h-[72vh] md:grid-cols-[1.15fr_1fr]"
    >
      {/* Type panel */}
      <div className="relative flex flex-col justify-end">
        <div className="relative z-10 px-4 pb-16 pt-24 md:px-6 md:pb-24 md:pt-32 lg:pl-12 lg:pr-16">
          <h1 className="max-w-[11ch] font-display text-6xl uppercase leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            An honest <span className="text-cobalt-bright">practice.</span>
          </h1>
          <p className="mt-5 text-base font-medium lowercase tracking-wide text-white/75 md:text-lg">
            yoga, movement &amp; sound — washington, dc
          </p>
          <Link
            href="/#this-week"
            className="mt-9 inline-block bg-primary px-10 py-4 font-display text-lg uppercase tracking-[0.08em] text-white transition hover:brightness-110"
          >
            Begin
          </Link>
        </div>
      </div>

      {/* Photo panel — natural color; vertical image fits the vertical slot */}
      <div className="relative hidden md:block">
        <ImageResponsiveHandstand />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy via-navy/15 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/60 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
