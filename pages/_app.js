import Head from "next/head";

import "../styles/global.scss";
import Layout from "../src/components/layout/layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Aaron Curtis Yoga</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
