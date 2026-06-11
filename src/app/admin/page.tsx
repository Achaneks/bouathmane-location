import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, CheckCircle2, CircleSlash, Wallet } from "lucide-react";
import { AvailabilityBadge } from "@/components/site/availability-badge";
import { StatCard } from "@/components/admin/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCars, getDashboardStats } from "@/lib/data/cars";
import { cn, formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, cars] = await Promise.all([getDashboardStats(), getCars()]);
  const recentCars = [...cars].reverse().slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl italic text-text-primary">Welcome back</h2>
        <p className="text-sm text-text-secondary">
          Here&apos;s what&apos;s happening with your fleet today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Cars"
          value={stats.totalCars}
          icon={Car}
          accent="primary"
        />
        <StatCard
          label="Available"
          value={stats.availableCars}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Not Available"
          value={stats.unavailableCars}
          icon={CircleSlash}
          accent="red"
        />
        <StatCard
          label="Avg. Price / Day"
          value={formatPrice(stats.averagePricePerDay)}
          icon={Wallet}
          accent="primary"
        />
      </div>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg italic text-text-primary">Recent Cars</CardTitle>
          <Link
            href="/admin/cars"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {recentCars.map((car) => (
            <div key={car.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image src={car.image} alt={car.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">{car.name}</p>
                <p className="text-sm text-text-secondary">{car.brand}</p>
              </div>
              <p className="font-medium text-gold">
                {formatPrice(car.pricePerDay, car.currency)}
                <span className="text-xs font-normal text-text-muted">/day</span>
              </p>
              <AvailabilityBadge available={car.available} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
