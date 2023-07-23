import React from "react";
import prismadb from "@/lib/prismadb";
import format from "date-fns/format";

import CategoryClient from "./components/CategoryClient";
import { CategoryColumn } from "./components/Columns";

interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

const CategoriesPage: React.FC<BillboardsPageProps> = async ({ params }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategory: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryClient data={formattedCategory} />
      </div>
    </div>
  );
};

export default CategoriesPage;
