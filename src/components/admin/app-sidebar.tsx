"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, ExternalLink, LayoutDashboard, LogOut, PlusCircle, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/cars", label: "Cars", icon: Car, exact: true },
  { href: "/admin/cars/new", label: "Add Car", icon: PlusCircle, exact: true },
];

// Overrides the base SidebarMenuButton's `[&_svg]:size-4` — a class on the
// icon itself can't win here (a plain class always loses to a parent's
// descendant-selector rule on specificity), so the override has to go
// through the button's own className, where tailwind-merge resolves it.
const ICON_SIZE_CLASS = "[&_svg]:size-5";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={ICON_SIZE_CLASS}
              render={
                <Link href="/admin">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Car className="size-5" aria-label={SITE_NAME} />
                  </span>
                  <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-heading font-semibold">
                      {SITE_NAME}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Admin Panel
                    </span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        ICON_SIZE_CLASS,
                        "border-l-[3px] border-transparent",
                        isActive && "border-l-gold bg-gold-dim text-gold",
                      )}
                      render={
                        <Link href={item.href}>
                          <item.icon aria-label={item.label} />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/admin/settings"}
              tooltip="Settings"
              className={cn(
                ICON_SIZE_CLASS,
                "border-l-[3px] border-transparent",
                pathname === "/admin/settings" && "border-l-gold bg-gold-dim text-gold",
              )}
              render={
                <Link href="/admin/settings">
                  <Settings aria-label="Settings" />
                  <span>Settings</span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="View public site"
              className={ICON_SIZE_CLASS}
              render={
                <Link href="/" target="_blank">
                  <ExternalLink aria-label="View public site" />
                  <span>View Site</span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => signOut({ callbackUrl: "/" })}
              className={cn(ICON_SIZE_CLASS, "text-red-400 hover:text-red-300 hover:bg-red-400/10")}
              render={
                <button>
                  <LogOut aria-label="Sign out" />
                  <span>Sign out</span>
                </button>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
