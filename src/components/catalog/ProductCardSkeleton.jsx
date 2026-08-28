import Skeleton from "../ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/5">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col flex-1 gap-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2 mt-auto" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
