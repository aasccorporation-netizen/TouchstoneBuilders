import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your store configuration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Store Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Settings className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Settings coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Store profile, user management, and application settings will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
