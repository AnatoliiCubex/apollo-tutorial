import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";

import Header from "@/components/Header";
import { AUTH_TOKEN } from "@/constants";

import "@/styles/globals.css";

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken:
        typeof localStorage !== "undefined" && localStorage.getItem(AUTH_TOKEN),
    },
  },
});

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

type Definintion = {
  kind: string;
  operation?: string;
};

const link = split(
  ({ query }) => {
    const { kind, operation }: Definintion = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
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
