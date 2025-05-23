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
} from "./ui";
import { forumSchema, type IForumSchema } from "@/schema";
import { ForumAPI } from "@/api";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const CreateForumForm = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const form = useForm<IForumSchema>({
    resolver: zodResolver(forumSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const handleSubmission = useCallback(
    async (payload: IForumSchema) => {
      const token = await getToken();

      await ForumAPI.createForum(token!, payload);
      navigate("/");
    },
    [getToken, navigate]
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
        <Button
          type="submit"
          className="text-muted-foreground"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting...!" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
