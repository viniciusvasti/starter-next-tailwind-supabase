import * as z from "zod";

export const signInFormSchema = z.object({
  email: z
    .string()
    .email("Email inválido!")
    .min(3, "O email deve conter pelo menos 3 caracteres"),
  password: z.string(),
});

export const sighUpFormSchema = z.object({
  email: z.string().email("Email inválido! email").min(0).max(500),
  password: z
    .string()
    .min(8, "A senha deve conter pelo menos 8 caracteres")
    .max(50, "A senha deve conter no máximo 50 caracteres"),
});

export const updatePasswordFormSchema = z.object({
  password: z.string(),
});
