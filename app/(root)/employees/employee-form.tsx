"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { createEmployee, updateEmployee } from "@/lib/actions/employee.action";
import { EmployeeSchema, TEmployee } from "@/lib/types/employee.types";

export default function EmployeeForm({ employee }: { employee?: TEmployee }) {
  const router = useRouter();
  const form = useForm<
    z.infer<typeof EmployeeSchema> & {
      serverError: string;
    }
  >({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      id: employee?.id || uuid(),
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      salary: employee?.salary || 0,
      address: employee?.address || "",
    },
  });

  const isUpdate = !!employee?.id;

  async function onSubmit(values: z.infer<typeof EmployeeSchema>) {
    try {
      if (isUpdate) {
        await updateEmployee(values, "/employees");
      } else {
        await createEmployee(values, "/employees");
      }

      router.back();
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
          name="firstName"
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
          name="lastName"
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
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Salary<span className="ml-[1px] text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="2500,50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua A, no. 204" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
            {form.formState.isSubmitting && !employee?.id ? (
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
