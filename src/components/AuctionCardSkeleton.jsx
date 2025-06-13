import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AuctionCardSkeleton = () => {
  return (
    <Card className="group overflow-hidden border-0 shadow-md bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-sm relative">
      <div className="relative bg-white rounded-lg overflow-hidden">
        <div className="relative overflow-hidden">
          <Skeleton className="w-full h-56" />
        </div>

        <CardHeader className="pb-3 pt-6 px-6">
          <Skeleton className="h-7 w-3/4" />
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          <Skeleton className="h-12 w-full rounded-xl" />
        </CardContent>
      </div>
    </Card>
  );
};

export default AuctionCardSkeleton;
