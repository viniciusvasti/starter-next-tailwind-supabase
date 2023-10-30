"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { v4 as uuid } from "uuid";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { create, update } from "@/lib/actions/profile.action";
import { Database, TablesRow, TablesUpdate } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { newProfileFormSchema } from "@/lib/validations";

import { Combobox } from "../ui/combobox";
import { useToast } from "../ui/use-toast";

export default function ProfileForm({
  profile,
  professions,
}: {
  profile?: TablesRow<"professional_profile">;
  professions: TablesRow<"professions">[];
}) {
  const { toast } = useToast();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const form = useForm<
    z.infer<typeof newProfileFormSchema> & {
      serverError: string;
    }
  >({
    resolver: zodResolver(newProfileFormSchema),
    defaultValues: {
      id: profile?.id || uuid(),
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      whatsapp_number: profile?.whatsapp_number || "",
      created_by: profile?.created_by,
      email: profile?.email,
      profession_id: profile?.profession_id,
    },
  });

  const isUpdate = !!profile?.id;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      // TODO: improve the setting of updated_by field
      if (user?.id && !profile?.id) {
        form.setValue("created_by", user.id);
        form.setValue("email", user.email || "");
      }
    });
  }, [form, profile?.id, supabase.auth]);

  async function onSubmit(values: z.infer<typeof newProfileFormSchema>) {
    try {
      if (isUpdate) {
        const updatedValues: TablesUpdate<"professional_profile"> = {
          ...values,
          updated_by: form.getValues("created_by"),
          updated_at: new Date().toISOString(),
        };
        await update(updatedValues, "/profile");
      } else {
        await create(values, "/profile");
      }

      toast({
        title: "Dados atualizados com sucesso",
      });
    } catch (error: any) {
      console.error(error);
      form.setError("serverError", {
        type: "custom",
        message: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-3"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nome<span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="João" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sobrenome<span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>
                Tel (Whatsapp)<span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  required
                  mask="(99) 99999-9999"
                  maskChar="_"
                  placeholder="(xx) xxxxx-xxxx"
                  className={cn(
                    "border-input bg-background ring-offset-background focus-visible:ring-ring no-focus flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    form.getFieldState("whatsapp_number").error &&
                      "border-red-500",
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          control={form.control}
          name="whatsapp_number"
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email<span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="joao@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Profissão<span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Combobox
                  placeholder="Selecione o profissão"
                  options={professions.map((profession) => {
                    return {
                      value: profession.id,
                      label: profession.name,
                    };
                  })}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="primary-gradient text-light-900"
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting && !profile?.id ? (
            <>Salvando...</>
          ) : (
            <>Salvar</>
          )}
        </Button>
        {form.formState.errors.serverError?.message ? (
          <FormMessage>{form.formState.errors.serverError.message}</FormMessage>
        ) : null}
      </form>
    </Form>
  );
}
