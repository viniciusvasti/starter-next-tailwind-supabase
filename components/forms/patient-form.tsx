"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
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
import { create, update } from "@/lib/actions/patient.action";
import { Database, TablesRow, TablesUpdate } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { newPatientFormSchema } from "@/lib/validations";

export default function PatientForm({
  patient,
  goBackOnSuccess = false,
  onSuccess,
}: {
  patient?: TablesRow<"patient">;
  goBackOnSuccess?: boolean;
  onSuccess?: (id: string) => void;
}) {
  const router = useRouter();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const form = useForm<
    z.infer<typeof newPatientFormSchema> & {
      serverError: string;
    }
  >({
    resolver: zodResolver(newPatientFormSchema),
    defaultValues: {
      id: patient?.id || uuid(),
      first_name: patient?.first_name || "",
      last_name: patient?.last_name || "",
      whatsapp_number: patient?.whatsapp_number || "",
      created_by: patient?.created_by,
    },
  });

  const isUpdate = !!patient?.id;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      // TODO: improve the setting of updated_by field
      if (user?.id && !patient?.id) form.setValue("created_by", user.id);
    });
  }, [form, patient?.id, supabase.auth]);

  async function onSubmit(values: z.infer<typeof newPatientFormSchema>) {
    try {
      if (isUpdate) {
        const updatedValues: TablesUpdate<"patient"> = {
          ...values,
          updated_by: form.getValues("created_by"),
          updated_at: new Date().toISOString(),
        };
        await update(updatedValues, "/patients");
      } else {
        await create(values, "/patients");
      }

      if (onSuccess) {
        onSuccess(values.id);
      }

      if (goBackOnSuccess) {
        router.back();
      }
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
                  type="tel"
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
        <section className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={form.formState.isSubmitting}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            className="primary-gradient"
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting && !patient?.id ? (
              <>Salvando...</>
            ) : (
              <>Salvar</>
            )}
          </Button>
        </section>
        {form.formState.errors.serverError?.message ? (
          <FormMessage>{form.formState.errors.serverError.message}</FormMessage>
        ) : null}
      </form>
    </Form>
  );
}
