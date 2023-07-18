import React from "react";
import prismadb from "@/lib/prismadb";
import format from "date-fns/format";

import ColorClient from "./components/ColorClient";
import { ColorColumn } from "./components/Columns";

interface ColorsPageProps {
  params: {
    storeId: string;
  };
}

const ColorsPage: React.FC<ColorsPageProps> = async ({ params }) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
