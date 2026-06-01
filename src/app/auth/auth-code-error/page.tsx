import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>
            Something went wrong while signing in. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/auth/login" className={buttonVariants()}>
            Back to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
