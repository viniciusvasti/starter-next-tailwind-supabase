import { Metadata } from "next";
import { notFound } from "next/navigation";

import { findEmployee } from "@/lib/actions/employee.action";

import EmployeeForm from "../employee-form";

export const metadata: Metadata = {
  title: "Funcionário",
};

export const revalidate = 60;

export default async function page({ params }: { params: { id: string } }) {
  const employee = await findEmployee(params.id);

  if (!employee) {
    notFound();
  }

  return (
    <>
      <h1 className="text-dark100_light900 mb-6 text-3xl font-normal">
        Alterando {employee.firstName} {employee.lastName}
      </h1>
      <EmployeeForm employee={employee} />
    </>
  );
}
