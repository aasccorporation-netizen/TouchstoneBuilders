import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage your products and stock levels</p>
        </div>
        <Button>+ Add Product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Product catalog coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ll be able to add, edit, and manage your inventory here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
