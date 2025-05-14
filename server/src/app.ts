import express from "express";
import { HttpStatusCodes } from "./utils";

export const app = express();

app.use("/", (req, res) => {
  res.status(HttpStatusCodes.OK).json({ message: "I am healthy" });
});
