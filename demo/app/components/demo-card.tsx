import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface DemoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export function DemoCard({
  icon: Icon,
  title,
  description,
  href,
}: DemoCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="flex-grow">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>
            View example <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
