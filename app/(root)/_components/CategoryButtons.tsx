"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/app/_lib/actions/category.actions";
import { formUrlQuery, removeKeysFromQuery } from "@/app/_lib/utils";

const CategoryButtons: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFormUrlQuery = (category) => {
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
  };

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as Category[]);
    };

    getCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(category || "All");
  }, [searchParams]);

  if (!categories.length) return null;

  return (
    <>
      <p className={"text-small"}>Categories</p>
      <div className={"flex gap-4 flex-wrap"}>
        <Button
          className={"font-semibold"}
          color={selectedCategory === "All" ? "primary" : "default"}
          onClick={() => handleFormUrlQuery("All")}
          variant={selectedCategory === "All" ? "solid" : "flat"}
        >
          All
        </Button>
        {categories.map((category) => {
          const isActive = selectedCategory === category.name;
          return (
            <Button
              key={category.id}
              className={"font-semibold"}
              color={isActive ? "primary" : "default"}
              onClick={() => handleFormUrlQuery(category.name)}
              variant={isActive ? "solid" : "flat"}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </>
  );
};

export default CategoryButtons;
