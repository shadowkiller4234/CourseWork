import { Request, Response } from "express";
import { Brand } from "../models/brand.model";

// CREATE
export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.create(req.body);
    return res.json(brand);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
};

// READ ALL
export const getBrands = async (_req: Request, res: Response) => {
  const brands = await Brand.find();
  return res.json(brands);
};

// UPDATE
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(brand);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
};

// DELETE
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    return res.json({ message: "Brand deleted" });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
};