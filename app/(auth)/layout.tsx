import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import AppFooter from "@/components/app-footer";
import Theme from "@/components/app-header/theme";

export default async function UnloggedLayout({
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
  const { data } = await supabase.auth.getSession();

  if (data?.session) {
    redirect("/home");
  }

  return (
    <div className="background-light850_dark100 relative flex h-screen min-h-[100dvh] flex-col">
      <div className="fixed flex w-full justify-end p-6">
        <Theme />
      </div>
      <main className="flex-center h-full flex-1 flex-col">
        <p className="h1-bold text-dark100_light900 -roboto p-6">
          My<span className="text-blue-400">App</span>
        </p>
        <section className="box-border flex w-full flex-col items-center">
          {children}
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
