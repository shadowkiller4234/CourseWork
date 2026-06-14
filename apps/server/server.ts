import dotenv from 'dotenv'
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config(process.env.CLOUDINARY_URL!);
import mongoose from 'mongoose';
import app from './src/app';



console.log("CLOUDINARY KEY:", process.env.CLOUDINARY_API_KEY);
const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string)

        console.log("Mongo DB:", mongoose.connection.name);
        console.log("Mongo Host:", mongoose.connection.host);

        app.listen(PORT, () => {
            console.log(`server start on port: ${PORT}`)
        })

    } catch (error){
        console.log(`Server error: ${error}`);
        process.exit(1);
    }
}

startServer();