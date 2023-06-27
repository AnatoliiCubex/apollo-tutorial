import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

import Header from "@/components/Header";
import "@/styles/globals.css";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Create Next App</title>
      </Head>

      <Header />

      <main className={`${inter.className} w85 center ph3 pv1 background-gray`}>
        <Component {...pageProps} />
      </main>
    </ApolloProvider>
  );
}
