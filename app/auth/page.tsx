"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UserProfile, Registry } from "@/lib/types";
import { useAccount } from "wagmi";

export default function AuthRegister() {
  const { address } = useAccount();
  const [wallet, setWallet] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cid, setCid] = useState<string | null>(null);

  useEffect(() => {
    if (address && !wallet) setWallet(address);
  }, [address, wallet]);

  async function handleRegister() {
    setSubmitting(true);
    try {
      const profile: UserProfile = {
        wallet,
        username,
        bio: "",
        profileImageCID: undefined,
        participatedHackathons: [],
        reputation: { hackathonsWon: 0, projectsSubmitted: 0 },
      };
      const ipfs = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(profile),
      }).then((r) => r.json());
      setCid(ipfs?.cid ?? null);

      if (!ipfs?.cid) return;

      const reg = (await fetch("/api/registry", { cache: "no-store" }).then(
        (r) => r.json()
      )) as Registry;
      const merged = await fetch("/api/registry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          current: reg,
          add: { id: wallet, cid: ipfs.cid },
        }),
      }).then((r) => r.json());

      await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(merged),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Register</h1>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="wallet">Wallet</Label>
          <Input
            id="wallet"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Connect your wallet"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleRegister}
            disabled={!wallet || !username || !email || submitting}
          >
            {submitting ? "Registering..." : "Register"}
          </Button>
        </div>
        {cid && (
          <div className="text-sm text-muted-foreground">
            Profile CID: {cid}
          </div>
        )}
      </div>
    </main>
  );
}
