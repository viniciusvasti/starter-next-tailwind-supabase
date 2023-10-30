"use client";

import React from "react";

import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

export default function TimePicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const size = useWindowSize();

  function onChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    onChange(inputValue);
  }

  return (
    <input
      type="time"
      value={value}
      onChange={onChangeEvent}
      className={cn(
        "border-input bg-background ring-offset-background focus-visible:ring-ring no-focus flex h-10 min-w-[90px] rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        size.width && size.width < 640 ? "min-w-[110px]" : "w-min",
      )}
    />
  );
}
