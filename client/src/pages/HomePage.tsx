import { Button } from "@/components/ui";
import { UserButton } from "@clerk/clerk-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = useCallback(() => {
    navigate("/forums/new");
  }, [navigate]);
  return (
    <div className="p-4">
      <div className="flex justify-end">
        <UserButton />
      </div>
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <Button className="mt-4" onClick={handleNavigation}>
        Create Forum
      </Button>
    </div>
  );
};
