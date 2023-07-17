"use client";

import React, { useEffect, useState } from "react";
import z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Minimal 1 kata",
  }),
  value: z.string().min(1, {
    message: "Minimal 1 kata",
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Create a new size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "Save changes" : "Create size";

  const form = useForm<SettingsFormValues>({
    defaultValues: initialData || {
      name: "",
      value: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong, detail err : ", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        description="This will delete your size"
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  ) : (
    <div className="flex items-center justify-center w-full h-64 text-zinc-400">
      ...loading
    </div>
  );
};

export { SizeForm };
