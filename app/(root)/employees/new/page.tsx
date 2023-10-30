import { Metadata } from "next";

import EmployeeForm from "../employee-form";

export const metadata: Metadata = {
  title: "Novo Funcionário",
};

export default function page() {
  return (
    <>
      <h1 className="text-dark100_light900 mb-6 text-3xl font-normal">
        Novo Funcionário
      </h1>
      <EmployeeForm />
    </>
  );
}
