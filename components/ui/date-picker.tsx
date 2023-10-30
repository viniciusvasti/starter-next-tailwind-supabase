"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as React from "react";
import { LuCalendar } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  function dateOrUndefined(dateStr: string | undefined) {
    try {
      if (dateStr) return new Date(dateStr);
    } catch (exception) {}
    return undefined;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[230px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <LuCalendar className="mr-2 h-4 w-4" />
          {dateOrUndefined(value) ? (
            format(dateOrUndefined(value) as Date, "PPP", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0">
        <Calendar
          mode="single"
          selected={dateOrUndefined(value)}
          onSelect={(e) => {
            onChange(e?.toISOString());
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
