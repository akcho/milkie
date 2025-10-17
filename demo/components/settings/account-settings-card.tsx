import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";
import { LoadingButton } from "@/components/loading-button";

interface AccountSettingsCardProps {
  onSave: () => void;
  onSignOut: () => void;
  isSaving: boolean;
  isSigningOut: boolean;
}

export function AccountSettingsCard({
  onSave,
  onSignOut,
  isSaving,
  isSigningOut,
}: AccountSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input id="display-name" type="text" placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="email-notif"
            className="h-4 w-4 rounded border-input"
          />
          <Label
            htmlFor="email-notif"
            className="font-normal cursor-pointer"
          >
            Receive email notifications
          </Label>
        </div>
        <LoadingButton
          onClick={onSave}
          isLoading={isSaving}
          loadingText="Saving..."
        >
          Save changes
        </LoadingButton>

        <div className="pt-4 border-t">
          <LoadingButton
            variant="outline"
            onClick={onSignOut}
            isLoading={isSigningOut}
            loadingText="Signing out..."
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
}
