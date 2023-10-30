"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/lib/database.types";
import { updatePasswordFormSchema } from "@/lib/validations";

const UpdatePassword = () => {
  const { toast } = useToast();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof updatePasswordFormSchema>) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      // TODO: handle error
      if (error) {
        if (
          error.message
            .toLocaleLowerCase()
            .includes("should be different from the old password.")
        ) {
          toast({
            title: "Erro.",
            description: "A nova senha deve ser diferente da anterior.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      toast({
        title: "Senha alterada com sucesso.",
      });
      setTimeout(() => {
        router.replace("/home");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro.",
        description:
          "Não foi possível alterar a senha. Por favor, entre em contato com o suporte.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-72 space-y-3">
        <label htmlFor="email">Nova Senha</label>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
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
            {form.formState.isSubmitting ? "Salvando" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdatePassword;
