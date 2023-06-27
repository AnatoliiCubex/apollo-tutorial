import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Link from "next/link";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

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
      <header>
        <Link href={"/"}>Links</Link>
        <Link href={"/create-link"}>Create link form</Link>
      </header>
      <main className={`${inter.className} mt3`}>
        <Component {...pageProps} />
      </main>
    </ApolloProvider>
  );
}
