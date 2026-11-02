import { Router } from "express";
import { createUser } from "../controllers/user";

const userRouter = Router();

// Sprint 1: apenas cadastro. Login, edição e demais rotas entram na Sprint 2.
userRouter.post("/users", createUser);

export default userRouter;
