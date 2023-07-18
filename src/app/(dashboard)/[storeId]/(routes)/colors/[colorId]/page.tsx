"use strict";

import prismadb from "@/lib/prismadb";
import React from "react";

import { ColorForm } from "./components/color-form";

interface ColorId {
  params: {
    colorId: string;
  };
}

const BillboardPageId: React.FC<ColorId> = async ({ params }) => {
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex-col ">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default BillboardPageId;
