import express from 'express';
import productRoutes from './routes/products.routes';
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.routes";
import categoryRoutes from "./routes/category.routes";
import brandRoutes from "./routes/brand.routes";
import cartRoutes from "./routes/cart.routes";
import adminRoutes from "./routes/admin.routes";
import promotionRoutes from "./routes/promotion.routes"
import cors from "cors";



import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    "https://techstore2-three.vercel.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use('/product', productRoutes); 
app.use("/auth", authRoutes);
app.use("/auth", userRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/brand", brandRoutes);
app.use("/cart", cartRoutes);
app.use("/promotions", promotionRoutes);


app.use("/admin", adminRoutes);



export default app;



//6a14d15f31c6def02c3d8bd2 category videocard
//6a14d377ae3e962fe5c83f6c brand palit

/*

{
  "name": "NVIDIA GeForce RTX 5070",
  "slug": "nvidia-geforce-rtx-5070",
  "description": "Мощная видеокарта нового поколения для игр в 1440p и 4K, поддержка DLSS 4.0, трассировка лучей и высокая энергоэффективность.",
  "price": 699,
  "oldPrice": 799,
  "category": "6a14d15f31c6def02c3d8bd2",
  "brand": "6a14d377ae3e962fe5c83f6c",
  "stock": 25,
  "images": [
    "https://example.com/images/rtx5070-1.jpg",
    "https://example.com/images/rtx5070-2.jpg"
  ],
  "attributes": {
    "gpu": "Blackwell",
    "vram": "12GB GDDR7",
    "memoryBus": "192-bit",
    "tdp": "220W",
    "recommended_psu": "650W",
    "ports": ["HDMI 2.1", "DisplayPort 2.1"],
    "cooling": "Triple Fan"
  }
} 
  

*/


/* 

{
    "name": "root2",
    "email": "root2@gmail.com",
    "password": "$argon2id$v=19$m=65536,t=3,p=4$24udsJK1PpDGFS+ZF+CAFw$pXjD6Z2/5BRB1AkaYRSGKfdqW+0FvDhNJsbSpgxp9Uk",
    "role": "admin",
    "_id": "6a14dbcc8a5157698525ffe1",
    "createdAt": "2026-05-25T23:31:24.965Z",
    "updatedAt": "2026-05-25T23:31:24.965Z",
    "__v": 0
}

*/

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTE1NTUxYmFlZjZhMzFmMTkwNDU1YzIiLCJpYXQiOjE3Nzk3ODI5NTYsImV4cCI6MTc3OTc4Mzg1Nn0.0CKLwT4Pu6E-GurdURLYvfXJ1MHirucTsjk9kfCPUMA
