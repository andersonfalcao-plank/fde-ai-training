import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Settings",
};

const environmentVariant = {
  production: "default",
  preview: "secondary",
  development: "outline",
} as const;

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Settings</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Deployment</CardTitle>
          <CardDescription>Where this build is running.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3">
            <dt className="text-muted-foreground">Environment</dt>
            <dd>
              <Badge variant={environmentVariant[config.environment]}>
                {config.environment}
              </Badge>
            </dd>
            <dt className="text-muted-foreground">Commit</dt>
            <dd className="font-mono">{config.commit}</dd>
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}
