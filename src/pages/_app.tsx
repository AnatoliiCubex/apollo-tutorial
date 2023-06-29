import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Header from "@/components/Header";
import { AUTH_TOKEN } from "@/constants";

import "@/styles/globals.css";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
