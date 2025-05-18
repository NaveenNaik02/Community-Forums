import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { HttpStatusCodes } from "../utils";

export const userRouter = Router();

userRouter.get("/me", authenticateUser, (req, res) => {
  res.status(HttpStatusCodes.OK).json({
    success: true,
    user: req.authUser,
  });
});
