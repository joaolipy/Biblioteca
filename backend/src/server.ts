import dotenv from "dotenv";
dotenv.config(); // precisa vir antes de importar o que usa process.env

import cors from "cors";
import express from "express";
import { connectToDB } from "./database/sequelize";
import userRouter from "./routes/user";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API da Biblioteca no ar!");
});

app.use(userRouter);

const port = Number(process.env.PORT) || 3000;

connectToDB().then(() => {
  app.listen(port, () => console.log(`Rodando em http://localhost:${port}`));
});
