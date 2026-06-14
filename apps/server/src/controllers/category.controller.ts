import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const categories = async (req: Request, res: Response) => {
  try {
    const data = await categoryService.getCategories();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories" });
  }
};

export const categoriesAdd = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

export const categoriesUpdate = async (req: Request, res: Response) => {
  try {
    const updated = await categoryService.updateCategory(
      req.params.id as string,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

export const categoriesDelete = async (req: Request, res: Response) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
