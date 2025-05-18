import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreate: () => void;
}

export const EmptyState = ({ onCreate }: EmptyStateProps) => (
  <div className="text-center py-12">
    <h2 className="text-xl font-medium mb-2">No forums yet</h2>
    <p className="text-muted-foreground mb-4">
      Be the first to create a discussion!
    </p>
    <Button onClick={onCreate}>Create Forum</Button>
  </div>
);
