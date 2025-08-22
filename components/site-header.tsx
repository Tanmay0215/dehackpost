"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const nav = [
  { href: "/", label: "Discover" },
  { href: "/projects", label: "Projects" },
  { href: "/create", label: "Create" },
  { href: "/submit", label: "Submit" },
  { href: "/judge", label: "Judge" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
  { href: "/ipfs-test", label: "IPFS Test" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="font-semibold">
          Dehackpost
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
