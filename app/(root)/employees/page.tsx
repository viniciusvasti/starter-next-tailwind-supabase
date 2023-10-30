import { Metadata } from "next";
import Link from "next/link";
import { LuPlusCircle } from "react-icons/lu";

import IconButton from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findAllEmployees } from "@/lib/actions/employee.action";

export const metadata: Metadata = {
  title: "Funcionários",
};

export const revalidate = 60;

export default async function page() {
  const employees = await findAllEmployees();

  return (
    <>
      <section className="mb-6 flex w-full flex-col justify-between sm:flex-row sm:items-center">
        <h1 className="text-dark100_light900 text-3xl font-normal">
          Funcionários
        </h1>
        <Link href="employees/new" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient">
            <p>Novo Funcionário</p>
            <LuPlusCircle size={28} />
          </Button>
        </Link>
      </section>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Nome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <Link href={`/employees/${employee.id}`}>
                  <IconButton iconName="pencil" iconSize={20} />
                </Link>
              </TableCell>
              <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
              <TableCell>{employee.salary}</TableCell>
              <TableCell>{employee.address || "Sem endereço"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
