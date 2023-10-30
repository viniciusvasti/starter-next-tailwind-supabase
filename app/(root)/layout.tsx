import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default async function LoggedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="background-light850_dark100 relative flex min-h-[100dvh] flex-col">
      <AppHeader />
      <div className="flex h-full flex-1">
        <Sidebar />
        <div className="box-border flex w-full flex-1 flex-col px-6 pb-2 pt-28 sm:px-14">
          <main className="h-full w-full">{children}</main>
          <AppFooter />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
