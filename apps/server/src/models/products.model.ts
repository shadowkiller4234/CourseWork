import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {type: String, required: true},
    slug: { type: String, required: true, unique: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    oldPrice: {type: Number, required: false},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    brand: {type: Schema.Types.ObjectId, ref: "Brand", required: true},
    stock: {type: Number, required: true},
    images: { type: [String], required: true },

    attributes: [
  {
    key: String,
    value: Schema.Types.Mixed
  }
],
}, { timestamps: true });

productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, price: 1 });

export default mongoose.model('Product', productSchema);