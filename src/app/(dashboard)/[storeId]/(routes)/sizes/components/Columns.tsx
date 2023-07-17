"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "./cell-action";

export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  storeId?: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
