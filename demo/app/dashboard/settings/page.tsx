import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          This page is automatically protected by the layout-level gate.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              type="text"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="email-notif"
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="email-notif" className="font-normal cursor-pointer">
              Receive email notifications
            </Label>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Developer Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Notice how you didn&apos;t need to add{" "}
            <code className="text-xs bg-background px-1.5 py-0.5 rounded">PaywallGate</code>{" "}
            to this page? It&apos;s inherited from the layout.
          </p>
          <p className="text-sm text-muted-foreground">
            Every page under{" "}
            <code className="text-xs bg-background px-1.5 py-0.5 rounded">/dashboard/*</code>{" "}
            is automatically protected with zero additional code.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
