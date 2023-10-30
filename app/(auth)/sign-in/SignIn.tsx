"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaGoogle } from "react-icons/fa";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInFormSchema } from "@/lib/types/auth.schema";

const getURL = () => {
  // Set this to your site URL in production env.
  const isProd = process?.env?.NEXT_PUBLIC_VERCEL_ENV === "production";
  const siteUrl = isProd ? process?.env?.NEXT_PUBLIC_SITE_URL : null;
  const vercelDeploymentUrl = process?.env?.NEXT_PUBLIC_VERCEL_URL;
  const vercelBranchUrl = process?.env?.NEXT_PUBLIC_VERCEL_BRANCH_URL;
  const vercelPreviewUrl = window?.location?.href?.includes(
    vercelDeploymentUrl ?? "",
  )
    ? vercelDeploymentUrl
    : vercelBranchUrl;
  let url = siteUrl ?? vercelPreviewUrl ?? "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export default function SignIn() {
  const router = useRouter();
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description: React.ReactNode | null;
  }>({
    title: "",
    description: null,
  });
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("sessionInitialized");
    }
    setCanResendEmail(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        ...values,
      });
      if (error) {
        if (error.message.toLocaleLowerCase().includes("email not confirmed")) {
          setDialogData({
            title: "Email não confirmado",
            description: (
              <>
                Um email de confirmação foi enviado para você. Por favor,
                confirme o cadastro.
                <br />
                Caso não encontre o email, verifique a caixa de spam.
              </>
            ),
          });
          setCanResendEmail(true);
          setIsErrorDialogOpen(true);
          return;
        } else if (
          error.message
            .toLocaleLowerCase()
            .includes("invalid login credentials")
        ) {
          setDialogData({
            title: "Email ou senha incorretos",
            description: <>Verifique o email e senha informados.</>,
          });
          setIsErrorDialogOpen(true);
          return;
        } else {
          throw error;
        }
      }

      router.replace("/home");
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  async function handleGoogleAuth() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("sessionInitialized");
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getURL(),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogData.title}</DialogTitle>
            <DialogDescription>{dialogData.description}</DialogDescription>
            <section className="flex gap-3">
              <Button
                className="primary-gradient"
                onClick={() => {
                  setIsErrorDialogOpen(false);
                }}
              >
                Fechar
              </Button>
              {canResendEmail && (
                <Button
                  className="primary-gradient"
                  onClick={() => {
                    supabase.auth.resend({
                      type: "signup",
                      email: form.getValues("email"),
                    });
                    setIsErrorDialogOpen(false);
                  }}
                >
                  Re-enviar
                </Button>
              )}
            </section>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="me@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <span className="flex flex-col gap-4">
                <Link className="underline" href="/reset-password">
                  Esqueci minha senha
                </Link>

                <Button
                  className="flex-center primary-gradient"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  <FaEnvelope className="h-5 w-5" />
                  <span>
                    {form.formState.isSubmitting
                      ? "Entrando"
                      : "Entrar com Email e Senha"}
                  </span>
                </Button>
              </span>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button
            className="flex-center w-full gap-2 bg-red-500 hover:bg-red-500/70"
            type="submit"
            onClick={handleGoogleAuth}
            disabled={form.formState.isSubmitting}
          >
            <FaGoogle className="h-5 w-5" />
            <span>Entrar com conta Google</span>
          </Button>
          <Link className="hover:underline" href="/sign-up">
            Ainda não tem uma conta? Cadastre-se.
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
