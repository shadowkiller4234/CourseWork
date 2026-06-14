import { Request, Response } from "express";
import * as brandService from "../services/brand.service";
import { CreateBrandDTO } from "../interfaces/create-brand.dto";
import { UpdateBrandDTO } from "../interfaces/update-brand.dto";

type Params = {
  id: string;
};

export const brand = async (req: Request, res: Response) => {
  try {
    const data = await brandService.getAllBrands();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const brandAdd = async (req: Request<{}, {}, CreateBrandDTO>, res: Response) => {
  try {
    const data = await brandService.createBrand(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const brandUpdate = async (req: Request<Params, {}, UpdateBrandDTO>, res: Response) => {
  try {
    const updated = await brandService.updateBrand(
      req.params.id,
      req.body
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const brandDelete = async (req: Request, res: Response) => {
  try {
    await brandService.deleteBrand(req.params.id as string);
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};