import React from "react";
import prismadb from "@/lib/prismadb";
import format from "date-fns/format";

import SizeClient from "./components/SizeClient";
import { SizeColumn } from "./components/Columns";

interface SizesPageProps {
  params: {
    storeId: string;
  };
}

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
  const billboards = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSize: SizeColumn[] = billboards.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeClient data={formattedSize} />
      </div>
    </div>
  );
};

export default SizesPage;
