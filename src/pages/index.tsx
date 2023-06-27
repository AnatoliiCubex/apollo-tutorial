import { Inter } from "next/font/google";
// import styles from "@/styles/Home.module.css";
import LinksList from "@/components/LinksList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className}`}>
      <LinksList />
    </main>
  );
}
