"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import type { Registry } from "@/lib/types";
import { IPFS_GATEWAY } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HackCard = {
  id: string;
  name: string;
  description: string;
  schedule: { start: string; end: string };
  tracks: string[];
  cid: string;
};

export default function Discover() {
  const [items, setItems] = useState<HackCard[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const reg = await fetch("/api/registry", { cache: "no-store" }).then(
          (r) => r.json() as Promise<Registry>
        );
        const hacks = await Promise.all(
          (reg.hackathons ?? []).map(async (h) => {
            try {
              const data = await fetch(`${IPFS_GATEWAY}/ipfs/${h.cid}`, {
                cache: "no-store",
              }).then((r) => r.json());
              return {
                id: data.id as string,
                name: data.name as string,
                description: data.description as string,
                schedule: data.schedule as { start: string; end: string },
                tracks: (data.tracks ?? []) as string[],
                cid: h.cid,
              } satisfies HackCard;
            } catch {
              return null;
            }
          })
        );
        setItems(hacks.filter(Boolean) as HackCard[]);
      } catch {
        setItems([]);
      }
    }
    load();
  }, []);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Discover Hackathons</h1>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="q">Search</Label>
          <Input id="q" placeholder="Search hackathons by name, track, tag" />
        </div>
        <div className="grid w-40 gap-2">
          <Label>Sort</Label>
          <Select defaultValue="date">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="prize">Prize</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((e) => (
          <Card
            key={e.id}
            className="hover:shadow-lg transition-shadow border-0 bg-white rounded-xl overflow-hidden"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">{e.name}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {new Date(e.schedule.start).toLocaleString()} –{" "}
                {new Date(e.schedule.end).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-2 text-gray-700">{e.description}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {e.tracks.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border px-2 py-0.5 text-xs bg-gray-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                className="text-xs text-blue-600 underline"
                href={`/hackathon/${e.id}`}
              >
                View details
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
