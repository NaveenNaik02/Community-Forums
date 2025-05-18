import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ForumAPI } from "@/api";
import { useAuth } from "@clerk/clerk-react";
import type { ICommentWithRelations, IForumWithRelations } from "@/interfaces";
import { CommentForm, CommentCard } from "@/components";
import { Button } from "@/components/ui";

export const ViewForumPage = () => {
  const { getToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [forum, setForum] = useState<IForumWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<ICommentWithRelations[]>([]);
  const navigate = useNavigate();

  const handleNavigation = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const fetchForum = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token || !id) {
        throw new Error("auth token or forum id is missing");
      }

      const response = await ForumAPI.getForumById(token!, id);
      setForum(response);
      setComments(response.comments);
    } catch (err) {
      toast("Failed to load forum. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken, id]);

  useEffect(() => {
    fetchForum();
  }, [fetchForum]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Forum not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <Button
        onClick={handleNavigation}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </Button>
      <section>
        <h1 className="text-3xl font-bold mb-6">Discussion Forum</h1>
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{forum.title}</CardTitle>
              {forum.tags && (
                <Badge variant="outline" className="capitalize">
                  {forum.tags}
                </Badge>
              )}
            </div>
            <CardDescription className="whitespace-pre-line text-left text-base">
              {forum.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  forum.creator.fullName || forum.creator.email
                )}&background=random`}
              />
              <AvatarFallback>
                {forum.creator.fullName?.charAt(0) ||
                  forum.creator.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-left">
                {forum.creator.fullName || forum.creator.email.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground">
                Posted on {format(new Date(forum.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Join the Discussion</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentForm onCommentAdded={fetchForum} />
          </CardContent>
        </Card>
      </section>

      <section className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Community Responses</h2>
          <span className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onCommentDelete={fetchForum}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
