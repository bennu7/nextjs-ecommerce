"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "./cell-action";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
  storeId?: string;
  imageUrl?: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "imageUrl",
    header: "Url Image",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
