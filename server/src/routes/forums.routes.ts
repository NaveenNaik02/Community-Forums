import { Router } from "express";
import {
  createCommentController,
  createForumController,
  deleteCommentController,
  deleteForumController,
  editForumController,
  getForumByIdController,
  getForumsController,
} from "../controllers";
import { authenticateUser } from "../middleware";

export const forumRouter = Router();

forumRouter.get("/", authenticateUser, getForumsController);
forumRouter.get("/:id", authenticateUser, getForumByIdController);
forumRouter.post("/", authenticateUser, createForumController);
forumRouter.put("/:id", authenticateUser, editForumController);
forumRouter.delete("/:id", authenticateUser, deleteForumController);

forumRouter.post(
  "/:forumId/comment",
  authenticateUser,
  createCommentController
);
forumRouter.delete(
  "/comment/:commentId",
  authenticateUser,
  deleteCommentController
);
