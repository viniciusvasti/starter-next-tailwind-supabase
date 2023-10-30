import { Metadata } from "next";
import Link from "next/link";
import { LuLogIn } from "react-icons/lu";

import AppFooter from "@/components/app-footer";
import Theme from "@/components/app-header/theme";

export const metadata: Metadata = {
  title: "Bem Vindo",
};

export default function Home() {
  return (
    <div className="background-light850_dark100 relative flex min-h-[100dvh] flex-col">
      <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 h-[88px] w-full px-6 dark:shadow-none sm:px-12">
        <Link href="/home">
          <p className="h2-bold text-dark100_light900 font-inter">
            My<span className="text-blue-400">App</span>
          </p>
        </Link>
        <section className="flex-center text-dark100_light900 font-semibold">
          <Theme />
          <Link
            href="/sign-in"
            className="flex-center px-4 py-2 text-red-400 hover:opacity-70"
          >
            <LuLogIn className="mr-2 inline-block h-6 w-6" />
            Entrar
          </Link>
        </section>
      </nav>
      <main className="flex-center h-full w-full flex-1 flex-col px-6 pb-2 pt-28 sm:px-14">
        <section className="text-xl">Muito em breve. Aguarde!</section>
      </main>
      <AppFooter />
    </div>
  );
}
