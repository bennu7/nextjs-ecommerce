"use client";

import React, { useEffect, useState } from "react";
import { Plus as PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { BillboardColumn, columns } from "./Columns";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
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
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      {data.length > 0 ? (
        <DataTable searchKey="label" columns={columns} data={data} />
      ) : (
        <div className="flex items-center justify-center w-full h-64">
          <span className="text-gray-500">No billboards found</span>
        </div>
      )}
      <Heading title="API" description="API calls for billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  ) : (
    <div className="flex items-center justify-center w-full h-64 text-zinc-400">
      ...loading
    </div>
  );
};

export default BillboardClient;
