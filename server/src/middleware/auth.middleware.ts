import { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { HttpStatusCodes } from "../utils";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        clerkId: string;
        email: string;
        fullName: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);

    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await clerkClient.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "user email not found" });
      return;
    }

    req.authUser = {
      clerkId: userId,
      email: primaryEmail,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(HttpStatusCodes.INTERNAL_ERROR)
      .json({ error: "Authentication failed" });
  }
};
