import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// Mock data for the dashboard — will be replaced with real Supabase queries
const stats = [
  {
    title: "Total Products",
    value: "1,284",
    change: "+12%",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Today's Sales",
    value: "$3,420",
    change: "+8%",
    icon: ShoppingCart,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    title: "Active Customers",
    value: "342",
    change: "+5%",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Revenue This Month",
    value: "$42,580",
    change: "+18%",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const lowStockItems = [
  { name: "3/4\" Plywood Sheet", sku: "PLY-034", stock: 4, reorder: 10 },
  { name: "Galvanized Nails 16d", sku: "NAIL-16D", stock: 2, reorder: 25 },
  { name: "PVC Pipe 2\" x 10ft", sku: "PVC-210", stock: 6, reorder: 15 },
  { name: "Cement Bag 50lb", sku: "CEM-50", stock: 8, reorder: 20 },
];

const recentSales = [
  { customer: "Acme Construction", items: 5, total: "$850.00", time: "2h ago" },
  { customer: "Walker Renovations", items: 3, total: "$420.00", time: "3h ago" },
  { customer: "David Thompson", items: 8, total: "$1,230.00", time: "4h ago" },
  { customer: "Pioneer Homes", items: 2, total: "$310.00", time: "5h ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your store at a glance.
          </p>
        </div>
        <Link href="/sales" className={buttonVariants()}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Sale
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>
                Items that need reordering soon
              </CardDescription>
            </div>
            <Link href="/inventory" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={item.stock <= item.reorder / 2 ? "destructive" : "secondary"}
                    >
                      {item.stock} left
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Min: {item.reorder}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Recent Sales
              </CardTitle>
              <CardDescription>Latest transactions today</CardDescription>
            </div>
            <Link href="/sales" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{sale.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.items} items &middot; {sale.time}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{sale.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
