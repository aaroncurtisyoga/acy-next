"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { getAllCategories } from "@/lib/actions/category.actions";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { ICategory } from "@/lib/mongodb/database/models/category.model";

const CategoryButtons = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
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
      categoryList && setCategories(categoryList as ICategory[]);
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
              key={category._id}
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
