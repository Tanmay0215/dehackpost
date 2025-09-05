"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { buildHackathon } from "@/lib/hackathon";
import type { Registry } from "@/lib/types";
import type { HackathonPrize, HackathonJudge } from "@/lib/hackathon";

export default function CreateHackathon() {
  const { address } = useAccount();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tracks, setTracks] = useState<string>("DeFi, AI x Blockchain, NFTs");
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "ended">(
    "upcoming"
  );
  const [prizes, setPrizes] = useState<HackathonPrize[]>([
    {
      title: "1st Prize",
      reward: "2000 USDC",
      sponsor: "Polygon",
      winner: null,
    },
  ]);
  const [judges, setJudges] = useState<HackathonJudge[]>([
    { name: "Alice", wallet: "0xJudge1" },
  ]);
  const [projectsCID, setProjectsCID] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (address && !organizer) {
      setOrganizer(address);
    }
  }, [address, organizer]);

  // Prizes and judges are now arrays, not JSON strings
  const parsedProjectsCID = useMemo(() => {
    return projectsCID
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [projectsCID]);

  const preview = useMemo(() => {
    if (!id || !name || !desc || !organizer || !start || !end) return "";
    try {
      const data = buildHackathon({
        id,
        name,
        description: desc,
        organizer,
        schedule: { start, end },
        tracks: tracks
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        prizes,
        judges,
        projectsCID: parsedProjectsCID,
        status,
        createdAt: createdAt || new Date().toISOString(),
      });
      return JSON.stringify(data, null, 2);
    } catch {
      return "";
    }
  }, [
    id,
    name,
    desc,
    organizer,
    start,
    end,
    tracks,
    prizes,
    judges,
    parsedProjectsCID,
    status,
    createdAt,
  ]);

  async function handleSubmitAndUpload() {
    if (!preview) return;
    setSubmitting(true);
    try {
      // 1) Build canonical JSON on server (validation)
      const apiRes = await fetch("/api/hackathon", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: preview,
      });
      const built = await apiRes.json();

      // 2) Upload to IPFS
      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(built),
      });
      const ipfsJson = await ipfsRes.json();

      if (!ipfsJson?.cid) return;

      // 3) Update registry (merge current + new entry)
      const currentRegistry = (await fetch("/api/registry", {
        cache: "no-store",
      }).then((r) => r.json())) as Registry;
      const mergedRes = await fetch("/api/registry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          current: currentRegistry,
          add: { id: built.id as string, cid: ipfsJson.cid as string },
        }),
      });
      const nextRegistry = (await mergedRes.json()) as Registry;

      // 4) Upload new registry to IPFS
      const regUpload = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(nextRegistry),
      }).then((r) => r.json());

      // Optionally display new registry CID
      console.log("Updated registry CID:", regUpload?.cid);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Create Hackathon</h1>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="hackathon-001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="DeHacks 2025"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="A decentralized hackathon..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organizer">Organizer (wallet)</Label>
              <Input
                id="organizer"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="0x..."
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label>Schedule</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tracks">Tracks (comma separated)</Label>
              <Input
                id="tracks"
                value={tracks}
                onChange={(e) => setTracks(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={status}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "upcoming" || v === "ongoing" || v === "ended") {
                    setStatus(v);
                  }
                }}
                placeholder="upcoming | ongoing | ended"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="createdAt">Created At (ISO, optional)</Label>
              <Input
                id="createdAt"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                placeholder={new Date().toISOString()}
              />
            </div>
            <div className="grid gap-2">
              <Label>Prizes</Label>
              <div className="space-y-2">
                {prizes.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Title"
                      value={p.title}
                      onChange={(e) => {
                        const next = [...prizes];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setPrizes(next);
                      }}
                    />
                    <Input
                      placeholder="Reward"
                      value={p.reward}
                      onChange={(e) => {
                        const next = [...prizes];
                        next[idx] = { ...next[idx], reward: e.target.value };
                        setPrizes(next);
                      }}
                    />
                    <Input
                      placeholder="Sponsor (optional)"
                      value={p.sponsor ?? ""}
                      onChange={(e) => {
                        const next = [...prizes];
                        next[idx] = {
                          ...next[idx],
                          sponsor: e.target.value || undefined,
                        };
                        setPrizes(next);
                      }}
                    />
                    <Input
                      placeholder="Winner (optional)"
                      value={p.winner ?? ""}
                      onChange={(e) => {
                        const next = [...prizes];
                        next[idx] = {
                          ...next[idx],
                          winner: e.target.value || null,
                        };
                        setPrizes(next);
                      }}
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setPrizes([
                        ...prizes,
                        {
                          title: "",
                          reward: "",
                          sponsor: undefined,
                          winner: null,
                        },
                      ])
                    }
                  >
                    Add prize
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPrizes(prizes.slice(0, -1))}
                    disabled={prizes.length === 0}
                  >
                    Remove last
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Judges</Label>
              <div className="space-y-2">
                {judges.map((j, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Name"
                      value={j.name}
                      onChange={(e) => {
                        const next = [...judges];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setJudges(next);
                      }}
                    />
                    <Input
                      placeholder="Wallet"
                      value={j.wallet}
                      onChange={(e) => {
                        const next = [...judges];
                        next[idx] = { ...next[idx], wallet: e.target.value };
                        setJudges(next);
                      }}
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setJudges([...judges, { name: "", wallet: "" }])
                    }
                  >
                    Add judge
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setJudges(judges.slice(0, -1))}
                    disabled={judges.length === 0}
                  >
                    Remove last
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectsCID">
                Projects CIDs (comma separated)
              </Label>
              <Input
                id="projectsCID"
                value={projectsCID}
                onChange={(e) => setProjectsCID(e.target.value)}
                placeholder="Qm..., Qm..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={handleSubmitAndUpload}
            disabled={!preview || submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </main>
  );
}
