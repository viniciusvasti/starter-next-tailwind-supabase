import Link from "next/link";
import { LuLogOut } from "react-icons/lu";

import SignOutButton from "../buttons/SignOutButton";
import MobileSidebar from "../sidebar/mobile-sidebar";
import Theme from "./theme";

export default function AppHeader() {
  return (
    <header className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 dark:shadow-none sm:px-12">
      <Link href="/home">
        <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
          Appo<span className="text-blue-400">Med</span>
        </p>
      </Link>
      <div className="flex-center text-dark100_light900 font-semibold">
        <Theme />
        <SignOutButton className="flex-center px-4 py-2 text-red-400 hover:opacity-70">
          <LuLogOut className="mr-2 inline-block h-6 w-6 max-sm:hidden" />
        </SignOutButton>
        <MobileSidebar />
      </div>
    </header>
  );
}
