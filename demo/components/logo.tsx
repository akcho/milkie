import Link from "next/link";
import { MilkieIcon } from "@milkie/react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-2xl font-semibold hover:opacity-80 transition-opacity"
    >
      <MilkieIcon className="w-8 h-8" />
      milkie
    </Link>
  );
}
