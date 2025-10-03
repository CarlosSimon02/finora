import { Card, Skeleton } from "@/presentation/components/Primitives";

export const PotsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2 @4xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="@container/pots-card space-y-8">
            <div className="flex flex-row items-center justify-between gap-10 pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
              <Skeleton className="mb-3 h-2 w-full rounded-full" />
              <div className="txt-preset-5 flex justify-between">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            <div className="grid gap-4 @2xs/pots-card:grid-cols-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
