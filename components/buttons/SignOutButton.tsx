"use client";
import { createBrowserClient } from "@supabase/ssr";
import React from "react";

export default function SignOutButton({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <button onClick={handleSignOut} {...props}>
      {children}
    </button>
  );
}
