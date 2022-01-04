import Head from "next/head";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Aaron Curtis Yoga</title>
        {/*todo: Change favicon */}
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      <main>
        <p>main content</p>
      </main>
    </div>
  );
}
