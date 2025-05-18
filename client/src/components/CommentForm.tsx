import { commentSchema, type CommentSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Form, FormField, FormItem, FormMessage, Textarea } from "./ui";
import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { ForumAPI } from "@/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface CommentFormProps {
  onCommentAdded: () => void;
}

export const CommentForm = ({ onCommentAdded }: CommentFormProps) => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const form = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmission = useCallback(
    async (payload: CommentSchema) => {
      try {
        const token = await getToken();
        if (!token || !id) {
          throw new Error("auth token or forum id is missing");
        }
        await ForumAPI.createComment(token, id, payload);
        toast("Your comment has been posted.");
        form.reset();
        onCommentAdded();
      } catch (err) {
        console.error("Failed to post comment:", err);
        toast("Failed to post comment. Please try again.");
      }
    },
    [getToken, id, onCommentAdded, form]
  );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmission)}
        className="space-y-4 text-left"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <Textarea
                placeholder="Add a comment..."
                className="flex-1"
                rows={2}
                {...field}
              />
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Form>
  );
};
