import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="p-4">
    <div className="flex justify-end">
      <UserButton />
    </div>
    <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
    <div className="text-red-500 mb-4">{error}</div>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);
