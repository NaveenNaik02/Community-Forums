import { useState, useCallback } from "react";
import { format } from "date-fns";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Card,
  CardHeader,
  CardContent,
  Button,
  Textarea,
} from "@/components/ui";
import type { ICommentWithRelations } from "@/interfaces";
import { Trash2, Edit, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { ForumAPI } from "@/api";

interface CommentCardProps {
  comment: ICommentWithRelations;
  onCommentDelete: () => void;
}

export function CommentCard({ comment, onCommentDelete }: CommentCardProps) {
  const { userId, getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreator = comment.userId === userId;

  const handleCommentDeletion = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("auth token is missing");
      await ForumAPI.deleteComment(token, comment.id);
      onCommentDelete();
      toast.success("Your comment has been deleted.");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment. Please try again.");
    }
  }, [getToken, comment.id, onCommentDelete]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedContent(comment.content);
    }
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("auth token is missing");
      await ForumAPI.editComment(token, comment.id, editedContent);
      setIsEditing(false);
      onCommentDelete();
      toast.success("Comment updated successfully");
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Failed to update comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  return (
    <Card className="relative">
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
          {isCreator && !isEditing && (
            <div className="flex gap-2">
              <Edit
                className="h-4 w-4 cursor-pointer"
                onClick={handleEditToggle}
              />
              <Trash2
                className="h-4 w-4 cursor-pointer"
                onClick={handleCommentDeletion}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancelEdit} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={
                  isSubmitting || editedContent.trim() === comment.content
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-line text-left">
            {comment.content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
