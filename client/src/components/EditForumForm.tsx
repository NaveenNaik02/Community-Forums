import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import { forumSchema, type IForumSchema } from "@/schema";
import { ForumAPI } from "@/api";
import { useAuth } from "@clerk/clerk-react";
import { type IForumWithRelations } from "@/interfaces";
import { useNavigate } from "react-router-dom";

interface EditForumFormProps {
  forum: IForumWithRelations;
}

export const EditForumForm = ({ forum }: EditForumFormProps) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const form = useForm<IForumSchema>({
    resolver: zodResolver(forumSchema),
    defaultValues: {
      title: forum.title,
      content: forum.description,
      tags: forum.tags || "",
    },
  });

  const handleSubmission = useCallback(
    async (payload: IForumSchema) => {
      const token = await getToken();
      if (!token) {
        console.log("please login");
        return;
      }
      try {
        await ForumAPI.updateForum(token, forum.id, payload);
        navigate("/");
      } catch (error) {
        console.error("Failed to update forum:", error);
      }
    },
    [getToken, forum.id, navigate]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmission)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="What's your question about?" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Include all the details someone would need to answer your question"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="react,typescript,help" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..!" : "Update Discussion"}
        </Button>
      </form>
    </Form>
  );
};
