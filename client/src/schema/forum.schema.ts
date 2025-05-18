import { z } from "zod";

export const forumSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),

  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be 5000 characters or less"),

  tags: z
    .string()
    .max(100, "Tags must be 100 characters or less")
    .optional()
    .transform((val) => val?.trim())
    .refine(
      (val) => !val || /^[a-zA-Z0-9\s,]+$/.test(val),
      "Tags can only contain letters, numbers, and commas"
    )
    .refine(
      (val) => !val || val.split(",").length <= 5,
      "Maximum 5 tags allowed"
    ),
});

export type IForumSchema = z.infer<typeof forumSchema>;
