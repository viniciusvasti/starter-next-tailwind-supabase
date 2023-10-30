import * as z from "zod";

export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, "O nome é obrigatório").max(255),
  lastName: z.string().min(1, "O sobrenome é obrigatório").max(255),
  salary: z.coerce.number(),
  address: z.string().max(255).optional(),
});

export type TEmployee = z.infer<typeof EmployeeSchema>;

export const NewEmployeeSchema = EmployeeSchema.extend({
  createdBy: z.string().uuid(),
});

export type TNewEmployee = z.infer<typeof NewEmployeeSchema>;

export const UpdateEmployeeSchema = EmployeeSchema.extend({
  updatedBy: z.string().uuid(),
  updatedAt: z.string().refine((value) => {
    return new Date(value).toISOString() === value;
  }),
});

export type TUpdateEmployee = z.infer<typeof UpdateEmployeeSchema>;
