"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { buildHackathon } from "@/lib/hackathon";

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
  const [prizes, setPrizes] = useState(
    JSON.stringify(
      [
        {
          title: "1st Prize",
          reward: "2000 USDC",
          sponsor: "Polygon",
          winner: null,
        },
      ],
      null,
      2
    )
  );
  const [judges, setJudges] = useState(
    JSON.stringify([{ name: "Alice", wallet: "0xJudge1" }], null, 2)
  );
  const [projectsCID, setProjectsCID] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [resultJson, setResultJson] = useState<string>("");
  const [ipfsResponse, setIpfsResponse] = useState<{
    cid?: string;
    gatewayUrl?: string;
    error?: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (address && !organizer) {
      setOrganizer(address);
    }
  }, [address, organizer]);

  const parsedPrizes = useMemo(() => {
    try {
      return JSON.parse(prizes || "[]");
    } catch {
      return [];
    }
  }, [prizes]);
  const parsedJudges = useMemo(() => {
    try {
      return JSON.parse(judges || "[]");
    } catch {
      return [];
    }
  }, [judges]);
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
        prizes: parsedPrizes,
        judges: parsedJudges,
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
    parsedPrizes,
    parsedJudges,
    parsedProjectsCID,
    status,
    createdAt,
  ]);

  async function handleSubmit() {
    setSubmitting(true);
    setIpfsResponse(null);
    try {
      const res = await fetch("/api/hackathon", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: preview || "{}",
      });
      const json = await res.json();
      setResultJson(JSON.stringify(json, null, 2));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUploadToIPFS() {
    if (!preview) return;
    setUploading(true);
    try {
      const res = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: preview,
      });
      const json = await res.json();
      setIpfsResponse(json);
    } finally {
      setUploading(false);
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
                onChange={(e) => setStatus(e.target.value as any)}
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
              <Label htmlFor="prizes">Prizes (JSON)</Label>
              <Textarea
                id="prizes"
                value={prizes}
                onChange={(e) => setPrizes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="judges">Judges (JSON)</Label>
              <Textarea
                id="judges"
                value={judges}
                onChange={(e) => setJudges(e.target.value)}
                className="min-h-[120px]"
              />
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

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Preview (POST body)</Label>
              <Textarea
                readOnly
                className="min-h-[420px] font-mono text-xs"
                value={preview || "Fill required fields to preview..."}
              />
            </div>
            <div className="grid gap-2">
              <Label>API Result</Label>
              <Textarea
                readOnly
                className="min-h-[220px] font-mono text-xs"
                value={resultJson}
              />
            </div>
            <div className="grid gap-2">
              <Label>IPFS</Label>
              <div className="text-sm text-muted-foreground">
                {ipfsResponse?.cid ? (
                  <div className="space-y-1">
                    <div>CID: {ipfsResponse.cid}</div>
                    {ipfsResponse.gatewayUrl && (
                      <a
                        className="text-blue-600 underline"
                        href={ipfsResponse.gatewayUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open on gateway
                      </a>
                    )}
                  </div>
                ) : ipfsResponse?.error ? (
                  <div className="text-red-600">{ipfsResponse.error}</div>
                ) : (
                  <div>Upload a generated JSON to IPFS.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleUploadToIPFS}
            disabled={!preview || uploading}
          >
            {uploading ? "Uploading..." : "Upload to IPFS"}
          </Button>
          <Button onClick={handleSubmit} disabled={!preview || submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </main>
  );
}
