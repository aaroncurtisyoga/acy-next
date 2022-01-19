import Head from "next/head";
import LandingPage from "../src/components/landing-page/landing-page";

export default function HomePage() {
  return (
    <div className="container">
      <Head>
        <title>Aaron Curtis Yoga</title>
        <link rel="icon" href="/public/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main>
        <LandingPage />
      </main>
    </div>
  );
}
