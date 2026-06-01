import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">Manage your vendors and purchase orders</p>
        </div>
        <Button>+ Add Supplier</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Vendor Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Truck className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Supplier management coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your vendors, pricing, and purchase orders here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
