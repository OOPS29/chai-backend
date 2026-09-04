import dns from "node:dns";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config({ path: "./.env" });

connectDB();






// import mongoose from 'mongoose';
// import {DB_NAME} from "./constants";
// import express from "express";
// const app = express();

// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.error('ERRR:', error);
//             throw error;
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });

//     }catch(error) {
//         console.error('ERROR:', error);
//         throw err;
//     }
    
// })()