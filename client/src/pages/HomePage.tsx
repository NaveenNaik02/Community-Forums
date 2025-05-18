import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useForums } from "@/hooks/useForums";
import { ForumCard } from "@/components/ForumCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

export const HomePage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { forums, loading, error, fetchForums } = useForums();

  const handleNavigation = useCallback(() => {
    navigate("/forums/new");
  }, [navigate]);

  const handleFetchForums = useCallback(async () => {
    const token = await getToken();
    if (token) {
      fetchForums(token);
    }
  }, [getToken, fetchForums]);

  useEffect(() => {
    handleFetchForums();
  }, [handleFetchForums]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={handleFetchForums} />;

  return (
    <div className="min-h-screen w-full px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center w-full mb-8">
        <Button onClick={handleNavigation}>Create Forum</Button>
        <UserButton />
      </div>

      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold">Community Forums</h1>
      </div>

      <div className="w-full space-y-6">
        {forums.length === 0 ? (
          <EmptyState onCreate={handleNavigation} />
        ) : (
          forums.map((forum) => (
            <ForumCard
              key={forum.id}
              forum={forum}
              onForumDelete={handleFetchForums}
            />
          ))
        )}
      </div>
    </div>
  );
};
