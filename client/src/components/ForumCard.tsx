import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { IForumWithRelations } from "@/interfaces";
import { useAuth } from "@clerk/clerk-react";
import { Pencil, Trash2 } from "lucide-react";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ForumAPI } from "@/api";

interface ForumCardProps {
  forum: IForumWithRelations;
  onForumDelete: () => void;
}

export const ForumCard = ({ forum, onForumDelete }: ForumCardProps) => {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const isCreator = forum.creatorId === userId;

  const handleEditForumNavigation = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      navigate(`/forums/${forum.id}`);
    },
    [navigate, forum.id]
  );

  const handleViewForumNavigation = useCallback(() => {
    navigate(`/view-forum/${forum.id}`);
  }, [navigate, forum.id]);

  const handleForumDeletion = useCallback(
    async (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("auth token is missing");
        }
        await ForumAPI.deleteForum(token, forum.id);
        onForumDelete();
        toast("Your comment has been deleted.");
      } catch (err) {
        console.error("Failed to post comment:", err);
        toast("Failed to post comment. Please try again.");
      }
    },
    [getToken, forum.id, onForumDelete]
  );

  return (
    <Card
      className="w-full mb-6 cursor-pointer"
      onClick={handleViewForumNavigation}
    >
      <CardHeader>
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {forum.creator.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <CardDescription className="text-sm">
              <div>{forum.creator.fullName || "Anonymous"}</div>
              <div>{new Date(forum.createdAt).toLocaleDateString()}</div>
            </CardDescription>
          </div>
          {isCreator && (
            <div className="flex items-center gap-2">
              <Pencil
                className="cursor-pointer"
                onClick={(e) => handleEditForumNavigation(e)}
              />
              <Trash2
                className="cursor-pointer"
                onClick={(e) => handleForumDeletion(e)}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-left">
        <p>{forum.title}</p>
      </CardContent>

      {forum.tags && (
        <CardFooter>
          <div className="mt-4 flex flex-wrap gap-2">
            {forum.tags.split(",").map((tag) => (
              <Badge key={tag} variant="outline" className="px-3 py-1">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
