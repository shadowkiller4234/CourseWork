import { Request, Response } from "express";
import * as productService from "../services/products.services";

import { CreateProductDTO } from "../interfaces/create-product.dto";
import { UpdateProductDTO } from "../interfaces/update-product.dto";

import { uploadImage } from "../services/cloudinary.service";

interface ProductParams {
  slug: string;
}


export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const products = await productService.getProducts(
      page,
      limit
    );

    return res.json(products);
  } catch (error) {
    console.error("PRODUCTS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const product = await productService.getProductById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const imageUrls: string[] = [];

    const files = req.files as Express.Multer.File[];

    if (files?.length) {
      for (const file of files) {
        const imageUrl = await uploadImage(file.path);
        imageUrls.push(imageUrl);
      }
    }

    const product = await productService.createProduct({
      ...req.body,
      images: imageUrls,
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (
    req: Request<{ id: string }, {}, UpdateProductDTO>,
    res: Response
) => {
    try {
        const updatedProduct =
            await productService.updateProduct(
                req.params.id,
                req.body
            );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(updatedProduct);
    } catch (error: any) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export const deleteProduct = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const deletedProduct =
            await productService.deleteProduct(
                req.params.id
            );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getProductBySlug = async (req: Request<ProductParams>, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const product = await productService.getProductBySlugService(slug);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    // Хорошей практикой будет логировать саму ошибку для разработчика
    console.error(`Error fetching product by slug: ${error.message}`);
    
    return res.status(500).json({
      message: "Internal Server Error", // Не всегда безопасно отдавать error.message фронтенду
    });
  }
};