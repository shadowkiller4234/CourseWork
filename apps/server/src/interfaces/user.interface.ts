import { Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;

  email: string;

  password: string;

  role: 'user' | 'admin';

  createdAt: Date;

  updatedAt: Date;
}