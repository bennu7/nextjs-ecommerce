import React from "react";
import prismadb from "@/lib/prismadb";
import format from "date-fns/format";

import ProductClient from "./components/ProductClient";
import { ProductColumn } from "./components/Columns";
import { formatterUSD } from "@/lib/utils";

interface ProductsPageProps {
  params: {
    storeId: string;
  };
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ params }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProduct: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatterUSD.format(item.price.toNumber()),
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category.name,
    size: item.size.name,
    color: item.color.name,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient data={formattedProduct} />
      </div>
    </div>
  );
};

export default ProductsPage;
