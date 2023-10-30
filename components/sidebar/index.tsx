"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navList } from "@/constants";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "background-light900_dark200 light-border sticky left-0 top-0",
        "box-border flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36",
        "custom-scrollbar shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[280px]",
      )}
    >
      <nav className="flex flex-1 flex-col gap-6">
        {navList.map(({ href, label, icon }) => {
          const isActive =
            (pathname.includes(`/${href}`) && href !== "") ||
            pathname === `/${href}`;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-start gap-4 bg-transparent p-4 hover:opacity-60",
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900",
              )}
            >
              {icon}
              <p
                className={cn(
                  isActive ? "base-bold" : "base-medium",
                  "max-lg:hidden",
                )}
              >
                {label}
              </p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
