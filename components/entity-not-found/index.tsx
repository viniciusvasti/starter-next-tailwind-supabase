import Link from "next/link";

import { Button } from "../ui/button";

export default function EntityNotFound({ entityName }: { entityName: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium text-red-500">Não encontrado</h2>
      <p>O registro de {entityName} não foi encontrado</p>
      <Link className="text-accent-blue" href="/approaches">
        <Button variant="outline">Voltar</Button>
      </Link>
    </div>
  );
}
