import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditCarLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border border-border">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full max-md:h-11" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full max-md:h-11" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-9 w-full max-md:h-11" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full max-md:h-11" />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border border-border">
            <CardHeader>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-9 w-full max-md:h-11" />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-9 w-full max-md:h-11" />
              </div>
              <Skeleton className="h-9 w-full max-md:h-11" />
              <Skeleton className="h-9 w-full max-md:h-11" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
