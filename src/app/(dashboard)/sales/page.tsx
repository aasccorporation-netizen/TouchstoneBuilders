import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
          <p className="text-muted-foreground">Process sales and view transaction history</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Point of Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Point of sale coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ll be able to process customer purchases quickly here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
