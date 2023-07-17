"use client";

import React, { useState } from "react";
import {
  Copy as CopyIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  MoreHorizontal as MoreHorizontalIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";

import { SizeColumn } from "./Columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellAcctionProps {
  data: SizeColumn;
}

const CellAction: React.FC<CellAcctionProps> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID size copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted successfully");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this size first.",
        error
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        description="This will delete your size"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              onCopy(data.id);
            }}
          >
            <CopyIcon className="w-4 h-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className={cn("text-red-500")}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
