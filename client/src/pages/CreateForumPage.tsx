import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CreateForumForm } from "@/components";
import { Button } from "@/components/ui";
import { useCallback } from "react";

export const CreateForumPage = () => {
  const navigate = useNavigate();

  const handleNavigation = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <Button
        onClick={handleNavigation}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Create New Discussion</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Start a new conversation with the community
          </p>
        </div>
      </div>
      <CreateForumForm />
    </div>
  );
};
