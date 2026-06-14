import { Request, Response } from "express";
import { PromotionService } from "../services/promotion.service";
import { uploadImage } from "../services/cloudinary.service";

export const PromotionController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await PromotionService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error fetching promotions" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const data = await PromotionService.getById(req.params.id as string);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error fetching promotion" });
    }
  },

  async create(req: any, res: any) {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      let imageUrl = "";

      if (req.file) {
        imageUrl = await uploadImage(req.file.path);
      }

      const data = await PromotionService.create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        position: req.body.position,
        link: req.body.link,
        image: imageUrl,
      });

      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await PromotionService.update(
        req.params.id as string,
        req.body
      );
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error updating promotion" });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await PromotionService.remove(req.params.id as string);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting promotion" });
    }
  },
};
