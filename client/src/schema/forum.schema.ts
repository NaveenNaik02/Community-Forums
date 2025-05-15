import { z } from "zod";

export const forumSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(5000),
});

export type IForumSchema = z.infer<typeof forumSchema>;
