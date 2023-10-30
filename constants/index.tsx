import React from "react";
import { LuHome, LuLaptop2, LuMoon, LuSun, LuUsers } from "react-icons/lu";

import { ThemeMode } from "@/context/ThemeProvider";

type Theme = {
  value: ThemeMode;
  label: string;
  icon: React.ReactNode;
};

export const themes: Theme[] = [
  {
    value: "light",
    label: "Light",
    icon: <LuSun size={20} />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <LuMoon size={20} />,
  },
  {
    value: "system",
    label: "System",
    icon: <LuLaptop2 size={20} />,
  },
];

export const navList = [
  {
    href: "/home",
    label: "Home",
    icon: <LuHome size={24} />,
  },
  {
    href: "/employees",
    label: "Funcionários",
    icon: <LuUsers size={24} />,
  },
];
