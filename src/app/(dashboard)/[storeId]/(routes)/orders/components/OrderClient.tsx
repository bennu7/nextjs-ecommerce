"use client";

import React, { useEffect, useState } from "react";

import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { Loading } from "@/components/ui/loading";
import { OrderColumn, columns } from "./Columns";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      {data.length > 0 ? (
        <DataTable searchKey="products" columns={columns} data={data} />
      ) : (
        <div className="flex items-center justify-center w-full h-64">
          <span className="text-gray-500">No order found</span>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default OrderClient;
