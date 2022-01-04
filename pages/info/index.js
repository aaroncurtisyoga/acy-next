import Image from "next/image";
import LinkTree from "../../src/components/LinkTree/LinkTree";

export default function Index() {
  return (
    <>
      <Image
        src="/images/temp-profile-pic.jpeg"
        height={96}
        width={96}
        alt="Aaron Curtis"
      />
      <p>
        <a href="https://www.instagram.com/aaroncurtisyoga">@aaroncurtisyoga</a>
      </p>
      <LinkTree />
    </>
  );
}
