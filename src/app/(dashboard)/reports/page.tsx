import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">View insights and analytics for your store</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Reports coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sales reports, inventory analytics, and profit tracking will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
