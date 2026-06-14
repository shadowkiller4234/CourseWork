import { Request, Response } from "express";
import Product from "../models/products.model";
import { uploadImage } from "../services/cloudinary.service";
import * as productService from "../services/products.services";
import path from "path";


// GET ALL
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("brand", "name");

    res.json(products);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

// GET ONE
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("brand");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

// CREATE



export const createProduct = async (req: Request, res: Response) => {
  try {
    const imageUrls: string[] = [];

    const files = req.files as Express.Multer.File[] | undefined;

    if (files && files.length > 0) {
      for (const file of files) {
        const imageUrl = await uploadImage(file.path);
        imageUrls.push(imageUrl);
      }
    }

    // 🔥 FIX: parse attributes
    const attributes =
      typeof req.body.attributes === "string"
        ? JSON.parse(req.body.attributes)
        : req.body.attributes;

    const product = await productService.createProduct({
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,

      images: imageUrls,

      attributes,
    });

    return res.status(201).json(product);
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(400).json({
      message: error.message || "Invalid product data",
    });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const attributes =
      typeof data.attributes === "string"
        ? JSON.parse(data.attributes)
        : data.attributes;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        attributes,
        price: data.price ? Number(data.price) : undefined,
        stock: data.stock ? Number(data.stock) : undefined,
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};