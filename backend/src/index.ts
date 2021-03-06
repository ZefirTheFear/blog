import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";

import cloudinaryConfig from "./core/cloudinary";
cloudinaryConfig();

import { connectDB } from "./core/db";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

connectDB().then(() =>
  app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`))
);

// app.listen(5001, () => console.log("Server is running at 5001"));
