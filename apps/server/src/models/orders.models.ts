import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  phone: { type: String, required: true },
  address: { type: String, required: true },

  items: [orderItemSchema],

  totalPrice: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
});

export default mongoose.model(
  'Order',
  orderSchema
);