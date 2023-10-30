import "./globals.css";

import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import { cookies } from "next/headers";
import React from "react";

import AuthProvider from "@/context/auth";
import ThemeProvider from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https:/myapp.com.br/"),
  title: {
    default: "MyApp",
    template: "%s | MyApp",
  },
  description: "Gerencie agendamentos de consultas e sessões",
  icons: {
    icon: "/favicon.png",
  },
  keywords: [
    "whatsapp",
    "agendamento",
    "consulta",
    "sessão",
    "paciente",
    "pacientes",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://myapp.com.br/",
    title: "MyApp",
    description: "Gerencie agendamentos de consultas e sessões",
    images: [
      {
        url: "/myapp-full.png",
        width: 835,
        height: 200,
        alt: "MyApp",
      },
    ],
  },
};

export default async function RootLayout({
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
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body className={cn(inter.className, roboto.className)}>
        <AuthProvider accessToken={accessToken}>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
