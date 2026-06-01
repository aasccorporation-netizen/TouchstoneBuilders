"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Settings,
  HardHat,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500">
          <HardHat className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">
            Touchstone
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            Builders Supply
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              className={buttonVariants({
                variant: "ghost",
                className: cn(
                  "w-full justify-start gap-3 text-sm font-normal",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                ),
              })}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <Separator className="mb-4" />
        <p className="text-center text-xs text-sidebar-foreground/40">
          Touchstone Builders v0.1
        </p>
      </div>
    </aside>
  );
}
