"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { getAllCategories } from "@/lib/actions/category.actions";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { ICategory } from "@/lib/mongodb/database/models/category.model";

const CategoryFilter = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFormUrlQuery = useCallback(
    (category: string) => {
      let newUrl = "";
      if (category && category !== "All") {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "category",
          value: category,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["category"],
        });
      }
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    setCategory(category || "");
  }, [searchParams]);

  useEffect(() => {
    handleFormUrlQuery(category);
  }, [handleFormUrlQuery, category]);

  if (!categories.length) return null;

  return (
    <Select
      label="Select a category"
      labelPlacement={"outside"}
      onChange={(e) => setCategory(e.target.value)}
      placeholder="Select a category"
      selectedKeys={[category]}
      variant={"bordered"}
    >
      {categories.map((category) => (
        <SelectItem key={category.name} value={category.name}>
          {category.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CategoryFilter;
