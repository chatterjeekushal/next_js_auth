
import mongoose from "mongoose";

export async function connectDB() {
    
    try {

        await mongoose.connect(process.env.MONGODB_URL as string);
        const connection = mongoose.connection;

        connection.on("connected", () => console.log("connected to db"));
        connection.on("error", (error) => console.log("connection error", error));
        console.log("Mongoose connected");


    } catch (error) {
        console.log("Mongoose connection error", error);
    }
}