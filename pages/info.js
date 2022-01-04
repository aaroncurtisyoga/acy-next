import Head from "next/head";
import Info from "../src/components/info/info";

export default function InfoPage() {
  return (
    <>
      <Head>
        <title>Aaron Curtis | Info</title>
        <meta name="description" content={`Links tree for Aaron Curtis Yoga`} />
      </Head>
      <Info />
    </>
  );
}
