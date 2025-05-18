import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { HttpStatusCodes } from "./utils";
import { forumRouter, userRouter } from "./routes";

export const app = express();

app.use(clerkMiddleware());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/forums", forumRouter);

app.use("/", (req, res) => {
  res.status(HttpStatusCodes.OK).json({ message: "I am healthy" });
});
