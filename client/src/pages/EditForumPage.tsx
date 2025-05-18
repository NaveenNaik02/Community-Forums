import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EditForumForm } from "@/components";
import { Button } from "@/components/ui";
import { useCallback, useEffect, useState } from "react";
import { ForumAPI } from "@/api";
import { useAuth } from "@clerk/clerk-react";
import { type IForumWithRelations } from "@/interfaces";

export const EditForumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [forum, setForum] = useState<IForumWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  const handleNavigation = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const token = await getToken();
        if (token && id) {
          const data = await ForumAPI.getForumById(token, id);
          setForum(data);
        }
      } catch (error) {
        console.error("Failed to fetch forum:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForum();
  }, [id, getToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!forum) {
    return <div>Forum not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <Button
        onClick={handleNavigation}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </Button>
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Discussion</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update your conversation with the community
          </p>
        </div>
      </div>
      <EditForumForm forum={forum} />
    </div>
  );
};
