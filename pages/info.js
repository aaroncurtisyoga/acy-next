import Head from "next/head";
import Info from "../src/components/info/info";

export default function InfoPage() {
  return (
    <>
      <Head>
        <title>Aaron Curtis | Info</title>
        <meta name="description" content={`Links tree for Aaron Curtis Yoga`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Info />
    </>
  );
}
