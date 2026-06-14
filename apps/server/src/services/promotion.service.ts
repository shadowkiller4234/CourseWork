import { PromotionModel } from "../models/promotion.model";

export const PromotionService = {
  async getAll() {
    return PromotionModel.find({ isActive: true }).sort({ createdAt: -1 });
  },

  async getById(id: string) {
    return PromotionModel.findById(id);
  },

  async create(data: any) {
    return PromotionModel.create(data);
  },

  async update(id: string, data: any) {
    return PromotionModel.findByIdAndUpdate(id, data, { new: true });
  },

  async remove(id: string) {
    return PromotionModel.findByIdAndDelete(id);
  },
};