"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { create, update } from "@/lib/actions/approach.action";
import { Database, TablesRow, TablesUpdate } from "@/lib/database.types";
import { newApproachFormSchema } from "@/lib/validations";

import { Textarea } from "../ui/textarea";

export default function ApproachForm({
  approach,
  goBackOnSuccess = false,
  onSuccess,
}: {
  approach?: TablesRow<"approach">;
  goBackOnSuccess?: boolean;
  onSuccess?: (id: string) => void;
}) {
  const router = useRouter();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const form = useForm<
    z.infer<typeof newApproachFormSchema> & {
      serverError: string;
    }
  >({
    resolver: zodResolver(newApproachFormSchema),
    defaultValues: {
      id: approach?.id || uuid(),
      name: approach?.name || "",
      description: approach?.description || "",
      created_by: approach?.created_by,
    },
  });

  const isUpdate = !!approach?.id;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id && !approach?.id) form.setValue("created_by", user.id);
    });
  }, [form, approach?.id, supabase.auth]);

  async function onSubmit(values: z.infer<typeof newApproachFormSchema>) {
    try {
      if (isUpdate) {
        const updatedValues: TablesUpdate<"approach"> = {
          ...values,
          updated_by: form.getValues("created_by"),
          updated_at: new Date().toISOString(),
        };
        await update(updatedValues, "/approaches");
      } else {
        await create(values, "/approaches");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nome da Abordagem
                <span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Terapia cognitiva comportamental"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A Terapia Cognitivo Comportamental ou TCC é uma abordagem da psicoterapia baseada na combinação de conceitos do Behaviorismo radical com teorias cognitivas..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
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
            {form.formState.isSubmitting && !approach?.id ? (
              <>Salvando...</>
            ) : (
              <>Salvar</>
            )}
          </Button>
        </section>
      </form>
    </Form>
  );
}
