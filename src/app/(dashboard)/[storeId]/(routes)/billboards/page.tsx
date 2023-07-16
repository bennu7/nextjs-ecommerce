import React from "react";
import prismadb from "@/lib/prismadb";
import format from "date-fns/format";

import BillboardClient from "./components/BillboardClient";
import { BillboardColumn } from "./components/Columns";

interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

const BillboardsPge: React.FC<BillboardsPageProps> = async ({ params }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboard: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    imageUrl: item.imageUrl,
    storeId: item.storeId,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardClient data={formattedBillboard} />
      </div>
    </div>
  );
};

export default BillboardsPge;
