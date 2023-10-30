"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

const formSchema = z.object({
  email: z.string().email("Invalid email").min(0).max(500),
});

const ResetPassword = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        },
      );

      if (error) {
        console.error(error.message);
        throw error;
      }

      setDialogData({
        title: "Email Enviado!",
        description: (
          <>
            Te enviamos um email de recuperação de senha para{" "}
            {form.getValues("email")}.<br />
            Siga as instruções para recuperar sua senha.
            <br />
            Caso não encontre o email, verifique a caixa de spam.
          </>
        ),
      });
      setIsDialogOpen(true);
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogData.title}</DialogTitle>
            <DialogDescription>{dialogData.description}</DialogDescription>
            <Button
              className="primary-gradient w-fit"
              onClick={() => {
                setIsDialogOpen(false);
                router.push("/sign-in");
              }}
            >
              Ir para o Login
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Esqueci Minha Senha</CardTitle>
          <CardDescription>
            Por favor, informe seu e-mail cadastrado
          </CardDescription>
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

              <div className="flex flex-col gap-4">
                <Button
                  className="primary-gradient"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Enviando Instruções"
                    : "Enviar Instruções"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Link href="/sign-in">Lembra da sua senha? Faça o login.</Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default ResetPassword;
