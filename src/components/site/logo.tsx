import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/bouathmane-navbar-dark.svg"
      alt={SITE_NAME}
      width={213}
      height={40}
      className={cn("h-8 w-auto", className)}
    />
  );
}
