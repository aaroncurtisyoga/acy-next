import Link from "next/link";

function AboutLinks() {
  return (
    <div className={"flex pt-[20px] mx-8"}>
      <Link href="/about/schedule" className="">
        <p className={"hidden md:block font-semibold text-lg"}>Schedule</p>
      </Link>
      <span className={"mx-4"}>•</span>

      <Link href="/about/newsletter" className="sm:32 min-w-fit	">
        <p className={"hidden md:block font-semibold text-lg"}>Newsletter</p>
      </Link>
    </div>
  );
}

export default AboutLinks;
