import { Request, Response } from 'express';
import productsModel from '../models/products.model';

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const searchRegex = new RegExp(query.trim(), "i");

    const products = await productsModel.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { slug: searchRegex }
      ]
    })
    .select('name price slug _id')
    .limit(10)
    .lean();

    return res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Server error during search' });
  }
};