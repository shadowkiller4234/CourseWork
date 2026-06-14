import { Schema, model } from "mongoose";

const promotionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    image: {
      type: String, // URL (Cloudinary або uploads)
      required: true,
    },

    link: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      enum: ["main", "side"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PromotionModel = model("Promotion", promotionSchema);