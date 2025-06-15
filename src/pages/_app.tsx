import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Log_Monitor_안상현</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
