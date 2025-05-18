import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(500, { message: "Comment is too long (max 500 characters)" }),
});

export type CommentSchema = z.infer<typeof commentSchema>;
