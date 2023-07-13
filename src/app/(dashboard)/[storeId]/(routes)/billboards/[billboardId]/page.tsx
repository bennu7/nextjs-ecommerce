"use strict";
import prismadb from "@/lib/prismadb";
import React from "react";
import { BillboardForm } from "./components/billboard-form";

interface BillboardId {
  params: {
    billboardId: string;
  };
}

const BillboardPageId: React.FC<BillboardId> = async ({ params }) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex-col ">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPageId;
