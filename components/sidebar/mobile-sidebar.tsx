"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLogOut, LuMenu } from "react-icons/lu";

import { navList } from "@/constants";
import { cn } from "@/lib/utils";

import SignOutButton from "../buttons/SignOutButton";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

function NavContent() {
  const pathname = usePathname();
  return (
    <nav className="box-border flex h-full flex-col gap-6 pt-16">
      {navList.map(({ href, label, icon }) => {
        const isActive =
          (pathname.includes(`/${href}`) && href !== "") ||
          pathname === `/${href}`;
        return (
          <SheetClose asChild key={label}>
            <Link
              href={href}
              className={cn(
                "flex items-center justify-start gap-4 bg-transparent p-4",
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900",
              )}
            >
              {icon}
              <p className={cn(isActive ? "base-bold" : "base-medium")}>
                {label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
      <SignOutButton className="flex-center absolute bottom-12 px-4 py-2 text-red-400 hover:opacity-70">
        <LuLogOut className="mr-2 inline-block h-6 w-6" /> Sair
      </SignOutButton>
    </nav>
  );
}

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger>
        <LuMenu size={24} className="sm:hidden" />
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="/home">
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
            M<span className="text-primary-500">DT</span>
          </p>
        </Link>
        {/* <SheetClose asChild> */}
        <NavContent />
        {/* </SheetClose> */}
      </SheetContent>
    </Sheet>
  );
}
