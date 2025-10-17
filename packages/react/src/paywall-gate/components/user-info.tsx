interface UserInfoProps {
  email: string;
}

export function UserInfo({ email }: UserInfoProps) {
  return (
    <div className="bg-muted rounded-lg p-4 space-y-1">
      <p className="text-xs text-muted-foreground">Logged in as</p>
      <p className="text-sm font-medium">{email}</p>
    </div>
  );
}
