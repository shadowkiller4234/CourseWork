import { Schema, model, Types } from "mongoose";

export type CartItem = {
  productId: Types.ObjectId;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = model("Cart", cartSchema);