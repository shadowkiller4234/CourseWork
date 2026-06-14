import { Brand } from "../models/brand.model";
import { CreateBrandDTO } from "../interfaces/create-brand.dto";
import { UpdateBrandDTO } from "../interfaces/update-brand.dto";

export const getAllBrands = async () => {
  return await Brand.find();
};

export const createBrand = async (data: CreateBrandDTO) => {
  return await Brand.create(data);
};

export const updateBrand = async (id: string, data: UpdateBrandDTO) => {
  return await Brand.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteBrand = async (id: string) => {
  return await Brand.findByIdAndDelete(id);
};