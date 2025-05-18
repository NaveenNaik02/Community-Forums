import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="p-4 space-y-4">
    <div className="flex justify-end">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <Skeleton className="h-8 w-[200px]" />
    <div className="grid grid-cols-1 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);
