"use strict";
import React from "react";

import BillboardClient from "./components/BillboardClient";

interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

const BillboardsPge: React.FC<BillboardsPageProps> = ({ params }) => {
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardClient />
      </div>
    </div>
  );
};

export default BillboardsPge;
