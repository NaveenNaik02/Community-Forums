import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { ICommentWithRelations } from "@/interfaces";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { ForumAPI } from "@/api";

interface CommentCardProps {
  comment: ICommentWithRelations;
  onCommentDelete: () => void;
}

export function CommentCard({ comment, onCommentDelete }: CommentCardProps) {
  const { userId, getToken } = useAuth();
  const isCreator = comment.userId === userId;

  const handleCommentDeletion = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("auth token is missing");
      }
      await ForumAPI.deleteComment(token, comment.id);
      onCommentDelete();
      toast("Your comment has been deleted.");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast("Failed to post comment. Please try again.");
    }
  }, [getToken, comment.id, onCommentDelete]);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar>
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              comment.user.fullName || comment.user.email
            )}&background=random`}
          />
          <AvatarFallback>
            {comment.user.fullName?.charAt(0) || comment.user.email.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-start flex-col">
            <p className="font-medium">
              {comment.user.fullName || comment.user.email.split("@")[0]}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(comment.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          {isCreator && (
            <Trash2
              className="cursor-pointer"
              onClick={handleCommentDeletion}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line text-left">
          {comment.content}
        </p>
      </CardContent>
    </Card>
  );
}
