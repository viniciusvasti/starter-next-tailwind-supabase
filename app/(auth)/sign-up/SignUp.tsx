"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sighUpFormSchema } from "@/lib/types/auth.schema";

const SignUp = () => {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
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
  const form = useForm<z.infer<typeof sighUpFormSchema>>({
    resolver: zodResolver(sighUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof sighUpFormSchema>) {
    setHasError(false);

    try {
      const { error } = await supabase.auth.signUp(values);

      if (error) {
        setHasError(true);
        if (
          error.message.toLocaleLowerCase().includes("user already registered")
        ) {
          setDialogData({
            title: "Usuário já cadastrado",
            description: (
              <>
                Já existe um usuário cadastrado com esse email.
                <br />
                Verifique o endereço de email informado ou faça login.
              </>
            ),
          });
          setIsSuccessDialogOpen(true);
          return;
        }
        throw error;
      }

      setDialogData({
        title: "Cadastro Realizado!",
        description: (
          <>
            Bem vindo ao MyApp!!!
            <br />
            Enviamos um email de confirmação para você.
            <br /> Por favor, confirme o cadastro.
            <br />
            Caso não encontre o email, verifique a caixa de spam.
          </>
        ),
      });
      setIsSuccessDialogOpen(true);
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  return (
    <>
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogData.title}</DialogTitle>
            <DialogDescription>{dialogData.description}</DialogDescription>
            <Button
              className="primary-gradient"
              onClick={() => {
                setIsSuccessDialogOpen(false);
                if (!hasError) router.replace("/sign-in");
              }}
            >
              Fechar
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
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
                    {/* TODO: define rules for password */}
                    <FormMessage />
                    <FormDescription>Use uma senha segura!</FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <Button
                  className="primary-gradient"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {/* Add a bit of a delay cause it blinks if it happens very fast */}
                  {form.formState.isSubmitting
                    ? "Te cadastrando..."
                    : "Confirmar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Link href="/sign-in">Já tem uma conta? Faça login.</Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default SignUp;
