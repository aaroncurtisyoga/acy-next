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
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 150"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="#0C1019">
            <rect x="0" y="70" width="150" height="80" />
            <rect x="150" y="95" width="90" height="55" />
            <rect x="240" y="55" width="130" height="95" />
            <rect x="330" y="40" width="14" height="30" />
            <rect x="370" y="85" width="180" height="65" />
            <rect x="430" y="62" width="60" height="30" />
            <rect x="550" y="48" width="120" height="102" />
            <rect x="596" y="30" width="28" height="20" />
            <rect x="670" y="90" width="140" height="60" />
            <rect x="810" y="60" width="110" height="90" />
            <rect x="845" y="38" width="40" height="24" />
            <rect x="920" y="100" width="120" height="50" />
            <rect x="1040" y="72" width="160" height="78" />
            <rect x="1090" y="52" width="18" height="22" />
            <circle cx="358" cy="70" r="16" />
            <rect x="350" y="70" width="16" height="30" />
            <circle cx="892" cy="82" r="13" />
            <rect x="885" y="82" width="14" height="24" />
          </g>
        </svg>

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
