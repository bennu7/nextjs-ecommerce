"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Minimal 1 kata",
  }),
  billboardId: z.string().uuid({
    message: "ID billboard tidak valid",
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Create a new category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const action = initialData ? "Save changes" : "Create category";

  const form = useForm<SettingsFormValues>({
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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

      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Billbord deleted successfully");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this category first.",
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
        description="This will delete your category"
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
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          // defaultValue={field.value}
                          placeholder="Select a billboard"
                          className="text-black"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                          className="text-black"
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export { CategoryForm };
