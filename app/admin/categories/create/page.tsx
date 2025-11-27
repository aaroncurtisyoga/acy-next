"use client";

import { FC, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createCategory } from "@/app/_lib/actions/category.actions";
import { CategoryFormSchema } from "@/app/_lib/schema";
import { handleError } from "@/app/_lib/utils";
import { useRouter } from "next/navigation";
import { CheckCircle, Tag } from "lucide-react";

type Inputs = z.infer<typeof CategoryFormSchema>;

const CreateCategory: FC = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  const handleAddCategory: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await createCategory({
        categoryName: data.category.trim(),
      });
      if (result.status) {
        setShowSuccess(true);
        reset();
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (e) {
      handleError("Error creating category", e);
      setError("category", {
        type: "server",
        message: "There was an issue creating the category.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create Category
        </h1>
        <p className="text-default-500">
          Add a new category to organize your events
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex gap-3 pb-0">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <p className="text-lg font-semibold">New Category</p>
          </div>
        </CardHeader>
        <CardBody className="pt-6">
          <form
            onSubmit={handleSubmit(handleAddCategory)}
            className="space-y-6"
          >
            <Controller
              name={"category"}
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Input
                    isDisabled={isSubmitting}
                    label="Category Name"
                    placeholder="Enter category name (e.g., Workshop, Social, Training)"
                    variant="bordered"
                    size="lg"
                    errorMessage={errors.category?.message}
                    isInvalid={!!errors.category}
                    classNames={{
                      label: "text-default-700 font-medium",
                      input: "text-foreground",
                      inputWrapper:
                        "hover:border-primary data-[hover=true]:border-primary",
                    }}
                    {...field}
                  />
                );
              }}
            />

            {showSuccess && (
              <div className="flex items-center gap-2 p-3 bg-success-50 text-success-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Category created successfully!
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isSubmitting}
                className="font-medium"
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
              <Button
                type="button"
                color="default"
                variant="flat"
                size="lg"
                onPress={() => router.push("/admin/categories")}
                isDisabled={isSubmitting}
                className="font-medium"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateCategory;
