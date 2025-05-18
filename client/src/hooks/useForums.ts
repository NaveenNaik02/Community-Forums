import { useState, useCallback } from "react";
import { ForumAPI } from "@/api";
import type { IForumWithRelations } from "@/interfaces";

export const useForums = () => {
  const [forums, setForums] = useState<IForumWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForums = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ForumAPI.getAllForums(token);
      setForums(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch forums");
      console.error("Error fetching forums:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(
    async (forumId: string, content: string, token: string) => {
      try {
        //   await ForumAPI.addComment(forumId, content, token);
      } catch (err) {
        console.error("Error adding comment:", err);
        throw err;
      }
    },
    []
  );

  return { forums, loading, error, fetchForums, addComment };
};
