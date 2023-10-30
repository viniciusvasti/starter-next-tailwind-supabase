"use client";

import { LuMoon, LuSun } from "react-icons/lu";

import { themes } from "@/constants";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

export default function Theme() {
  const { mode, setMode } = useTheme();

  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          <span className="active-theme hover:opacity-70">
            {mode === "light" ? <LuSun size={20} /> : <LuMoon size={20} />}
          </span>
        </MenubarTrigger>
        <MenubarContent className="background-light900_dark300 absolute right-[-3rem] mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400">
          {themes.map((theme) => (
            <MenubarItem
              key={theme.value}
              className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
              onClick={() => {
                setMode(theme.value);
                if (theme.value !== "system") {
                  localStorage.theme = theme.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <span
                className={cn(
                  "text-light-500",
                  mode === theme.value ? "active-theme" : "dark100_light900",
                )}
              >
                {theme.icon}{" "}
              </span>
              <p
                className={cn(
                  "body-semibold text-light-500",
                  mode === theme.value
                    ? "text-primary-500"
                    : "text-dark100_light900",
                )}
              >
                {theme.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
