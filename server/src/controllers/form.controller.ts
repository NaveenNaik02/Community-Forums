import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { HttpStatusCodes } from "../utils";

export const createForumController = async (req: Request, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    const { clerkId, email, fullName } = req.authUser!;

    let user = await prisma.user.findUnique({
      where: { id: clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: clerkId,
          email,
          fullName,
        },
      });
    }

    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        tags,
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    res.status(HttpStatusCodes.CREATED).json(forum);
  } catch (error) {
    console.error("Forum creation error:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      error: "Failed to create forum",
    });
  }
};

export const editForumController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const { clerkId } = req.authUser!;

    const existingForum = await prisma.forum.findUnique({
      where: { id },
    });

    if (!existingForum) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        error: "Forum not found",
      });
      return;
    }

    if (existingForum.creatorId !== clerkId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: "You are not authorized to edit this forum",
      });
      return;
    }

    const updatedForum = await prisma.forum.update({
      where: { id },
      data: {
        title,
        description,
        tags,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    res.status(HttpStatusCodes.OK).json(updatedForum);
  } catch (error) {
    console.error("Forum update error:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      error: "Failed to update forum",
    });
  }
};

export const getForumsController = async (req: Request, res: Response) => {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(HttpStatusCodes.OK).json(forums);
  } catch (error) {
    console.error("Error fetching forums:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      error: "Failed to fetch forums",
    });
  }
};

export const createCommentController = async (req: Request, res: Response) => {
  try {
    const { forumId } = req.params;
    const { content } = req.body;
    const { clerkId } = req.authUser!;

    if (!forumId || !content) {
      res
        .status(HttpStatusCodes.UN_AUTHORIZED)
        .json({ message: "Unauthorized" });
      return;
    }

    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
    });

    if (!forum) {
      res.status(404).json({ message: "Forum not found." });
      return;
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        forumId,
        userId: clerkId,
      },
    });

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getForumByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { clerkId } = req.authUser!;

    const forum = await prisma.forum.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!forum) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        error: "Forum not found",
      });
      return;
    }

    if (forum.creatorId !== clerkId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: "You are not authorized to access this forum",
      });
      return;
    }

    res.status(HttpStatusCodes.OK).json(forum);
  } catch (error) {
    console.error("Error fetching forum:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      error: "Failed to fetch forum details",
    });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { clerkId } = req.authUser!;

    if (!commentId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Comment ID is required",
      });
      return;
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "Comment not found",
      });
      return;
    }

    if (comment.userId !== clerkId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "You can only delete your own comments",
      });
      return;
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(HttpStatusCodes.OK).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      message: "Something went wrong",
    });
  }
};

export const deleteForumController = async (req: Request, res: Response) => {
  try {
    const { id: forumId } = req.params;
    const { clerkId } = req.authUser!;

    if (!forumId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Forum ID is required",
      });
      return;
    }

    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        comments: true,
      },
    });

    if (!forum) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "Forum not found",
      });
      return;
    }

    if (forum.creatorId !== clerkId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "You can only delete your own forums",
      });
      return;
    }

    if (forum.comments.length > 0) {
      await prisma.comment.deleteMany({
        where: { forumId },
      });
    }

    await prisma.forum.delete({
      where: { id: forumId },
    });

    res.status(HttpStatusCodes.OK).json({
      message: "Forum and its comments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting forum:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      message: "Something went wrong",
    });
  }
};

export const editCommentController = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const { clerkId } = req.authUser!;

    if (!commentId || !content) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Comment ID and content are required",
      });
      return;
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "Comment not found",
      });
      return;
    }

    if (comment.userId !== clerkId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "You can only edit your own comments",
      });
      return;
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(HttpStatusCodes.OK).json({
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(HttpStatusCodes.INTERNAL_ERROR).json({
      message: "Something went wrong",
    });
  }
};
