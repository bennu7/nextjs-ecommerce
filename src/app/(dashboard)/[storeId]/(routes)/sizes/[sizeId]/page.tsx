"use strict";

import prismadb from "@/lib/prismadb";
import React from "react";

import { SizeForm } from "./components/size-form";

interface SizeId {
  params: {
    sizeId: string;
  };
}

const BillboardPageId: React.FC<SizeId> = async ({ params }) => {
  const billboard = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col ">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPageId;
