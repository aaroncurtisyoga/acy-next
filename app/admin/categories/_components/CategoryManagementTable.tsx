"use client";

import { FC, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/lib/actions/category.actions";

const CategoryManagementTable: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Table
        aria-label={"Table for Managing Event Categories"}
        className={"mt-5"}
      >
        <TableHeader>
          <TableColumn>Id</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Button size={"sm"} onPress={onOpen}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Category</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this Category?</p>
                <p>INSERT CATEGORY NAME HERE</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose} type="submit">
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CategoryManagementTable;
