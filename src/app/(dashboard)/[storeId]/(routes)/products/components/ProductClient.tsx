"use client";

import React, { useEffect, useState } from "react";
import { Plus as PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { Loading } from "@/components/ui/loading";
import { ProductColumn, columns } from "./Columns";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      {data.length > 0 ? (
        <DataTable searchKey="name" columns={columns} data={data} />
      ) : (
        <div className="flex items-center justify-center w-full h-64">
          <span className="text-gray-500">No product found</span>
        </div>
      )}
      <Heading title="API" description="API calls for products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  ) : (
    <Loading />
  );
};

export default ProductClient;
