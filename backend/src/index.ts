import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express, { Response } from "express";
import cors from "cors";

import { connectDB } from "./core/db";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use("/users", userRoutes);

app.get("/", (_, res: Response) => {
  res.send("hello");
});

connectDB().then(() =>
  app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`))
);

// app.listen(5001, () => console.log("Server is running at 5001"));
