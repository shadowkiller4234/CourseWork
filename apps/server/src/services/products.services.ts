import mongoose from 'mongoose';
import Product from '../models/products.model';
import { CreateProductDTO } from '../interfaces/create-product.dto';
import { ProductDTO } from '../interfaces/product.dto';
import { UpdateProductDTO } from '../interfaces/update-product.dto';

type PopulatedBrand = {
  _id: any;
  name: string;
};

type PopulatedCategory = {
  _id: any;
  name: string;
};

type ProductPopulated = {
  _id: any;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;

  brand: PopulatedBrand;
  category: PopulatedCategory;

  stock: number;
  images: string[];

  attributes?: any;

  createdAt: Date;
  updatedAt: Date;
};

const toDTO = (product: any): ProductDTO => ({
  _id: product._id.toString(),

  name: product.name,
  slug: product.slug,
  description: product.description,

  price: product.price,
  oldPrice: product.oldPrice ?? null,

  brand: product.brand
    ? {
        _id: product.brand._id?.toString?.() || "",
        name: product.brand.name || "",
      }
    : {
        _id: "",
        name: "",
      },

  category: product.category
    ? {
        _id: product.category._id?.toString?.() || "",
        name: product.category.name || "",
      }
    : {
        _id: "",
        name: "",
      },

  stock: product.stock,
  images: product.images,

  attributes: product.attributes ?? {},

  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const getProducts = async (
  page: number = 1,
  limit: number = 12
) => {
  const skip = (page - 1) * limit;

  const filter = {
    brand: { $ne: null },
    category: { $ne: null },
  };

  const products = await Product.find(filter)
    .populate("brand", "name")
    .populate("category", "name")
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(filter);

  return {
    products: products.map(toDTO),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getProductById = async (
  id: string
): Promise<ProductDTO | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(id)
    .populate("brand", "name")
    .populate("category", "name")
    .lean<ProductPopulated>();

  if (!product) return null;

  return toDTO(product);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductDTO
): Promise<ProductDTO | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("brand", "name")
    .populate("category", "name")
    .lean<ProductPopulated>();

  if (!product) return null;

  return toDTO(product);
};

export const deleteProduct = async (
  id: string
): Promise<ProductDTO | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findByIdAndDelete(id)
    .populate("brand", "name")
    .populate("category", "name")
    .lean<ProductPopulated>();

  if (!product) return null;

  return toDTO(product);
};

export const createProduct = async (
  data: CreateProductDTO
): Promise<ProductDTO> => {

  const attributes =
    typeof data.attributes === "string"
      ? JSON.parse(data.attributes)
      : data.attributes;

  const created = await Product.create({
    ...data,
    attributes: attributes || [],
    price: Number(data.price),
    stock: Number(data.stock),
    oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
  });

  const product = await Product.findById(created._id)
    .populate("brand", "name")
    .populate("category", "name")
    .lean() as unknown as ProductPopulated;

  return toDTO(product);
};

export const getProductBySlugService = async (slug: string) => {
  // Добавляем exec() для получения полноценного Promise
  return await Product.findOne({ slug })
    .populate("category")
    .populate("brand")
    .lean()
    .exec(); 
};