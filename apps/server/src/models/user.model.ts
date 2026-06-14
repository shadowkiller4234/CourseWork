import mongoose from 'mongoose';
import { UserDocument } from '../interfaces/user.interface';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String,required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  }, {
    timestamps: true
  }
);

export default mongoose.model<UserDocument>( 'User', userSchema );