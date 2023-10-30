"use server";

import { revalidatePath } from "next/cache";

import {
  NewEmployeeSchema,
  TEmployee,
  UpdateEmployeeSchema,
} from "../types/employee.types";
import { camelToSnake, snakeToCamel } from "../utils";
import { getSupabaseClient } from "./utils";

export async function findAllEmployees(): Promise<TEmployee[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("first_name");
  if (error) throw error;
  return snakeToCamel(data);
}

export async function findEmployee(id: string): Promise<TEmployee | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "22P02" || error.code === "PGRST116") {
      console.error(error);
      return null;
    }

    throw error;
  }
  return snakeToCamel(data);
}

export async function createEmployee(
  employee: TEmployee,
  path?: string,
): Promise<TEmployee> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error(userError);
    throw new Error("Erro. Por favor, entre em contato com o suporte.");
  }

  const newEmployee = NewEmployeeSchema.parse({
    ...employee,
    createdBy: userData.user?.id,
  });

  const { data, error } = await supabase
    .from("employees")
    .insert(camelToSnake(newEmployee))
    .single();
  if (error) {
    console.error(error);
    throw new Error("Erro. Por favor, entre em contato com o suporte.");
  }
  if (path) revalidatePath(path);
  return data;
}

export async function updateEmployee(
  employee: TEmployee,
  path?: string,
): Promise<TEmployee> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error(userError);
    throw new Error("Erro. Por favor, entre em contato com o suporte.");
  }

  const updatedEmployee = UpdateEmployeeSchema.parse({
    ...employee,
    updatedBy: userData.user?.id,
    updatedAt: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from("employees")
    .update(camelToSnake(updatedEmployee))
    .eq("id", employee.id)
    .single();
  if (error) {
    console.error(error);
    throw new Error("Erro. Por favor, entre em contato com o suporte.");
  }
  if (path) revalidatePath(path);
  return data;
}
