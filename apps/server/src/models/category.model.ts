import { Schema, model } from "mongoose";

const AttributeSchema = new Schema(
  {
    name: { type: String, required: true },      // "RAM", "Color"
    key: { type: String, required: true },       // "ram", "color"
    type: {
      type: String,
      enum: ["string", "number", "boolean", "select"],
      default: "string",
    },
    required: { type: Boolean, default: false },
    options: [String], // для select (наприклад: ["S", "M", "L"])
  },
  { _id: false }
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    attributes: [AttributeSchema], // 👈 головне
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);