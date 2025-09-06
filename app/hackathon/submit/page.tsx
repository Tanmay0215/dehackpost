"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectMetadata, Registry } from "@/lib/types";
import { IPFS_GATEWAY } from "@/lib/constants";
import { useAccount } from "wagmi";

export default function SubmitProject() {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [repo, setRepo] = useState("");
  const [hackathonId, setHackathonId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [demoURL, setDemoURL] = useState("");
  const [notes, setNotes] = useState("");
  const [cid, setCid] = useState<string | null>(null);
  const [gatewayUrl, setGatewayUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const project: ProjectMetadata = {
        id: `project-${Math.random().toString(36).slice(2, 8)}`,
        hackathonId,
        teamName,
        members: address ? [{ name: "", wallet: address }] : [],
        projectTitle: title,
        description: notes,
        tags: [],
        repoURL: repo,
        demoURL,
        mediaCIDs: [],
        submittedAt: now,
        status: "submitted",
      };

      // Upload project to IPFS
      const ipfs = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(project),
      }).then((r) => r.json());
      setCid(ipfs?.cid ?? null);
      setGatewayUrl(ipfs?.gatewayUrl ?? null);

      if (!ipfs?.cid || !hackathonId) return;

      // Fetch registry to get hackathon entry
      const reg = (await fetch("/api/registry", { cache: "no-store" }).then(
        (r) => r.json()
      )) as Registry;
      const entry = (reg.hackathons ?? []).find((h) => h.id === hackathonId);
      if (!entry) return;

      // Fetch hackathon JSON, append project CID, re-upload
      const hackathon = await fetch(`${IPFS_GATEWAY}/ipfs/${entry.cid}`, {
        cache: "no-store",
      }).then((r) => r.json());
      const next = {
        ...hackathon,
        projectsCID: [...(hackathon.projectsCID ?? []), ipfs.cid],
      } as Record<string, unknown>;
      const hackUpload = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      }).then((r) => r.json());

      // Update registry with new hackathon CID
      const merged = await fetch("/api/registry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          current: reg,
          add: { id: hackathonId, cid: hackUpload.cid as string },
        }),
      }).then((r) => r.json());

      // Upload new registry
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
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Submit Project</h1>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="hackathonId">Hackathon ID</Label>
          <Input
            id="hackathonId"
            value={hackathonId}
            onChange={(e) => setHackathonId(e.target.value)}
            placeholder="hackathon-001"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="team">Team Name</Label>
          <Input
            id="team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="repo">Repository URL</Label>
          <Input
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="demo">Demo Link</Label>
          <Input
            id="demo"
            value={demoURL}
            onChange={(e) => setDemoURL(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you build?"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit & Upload"}
          </Button>
        </div>
        {cid && (
          <div className="text-sm text-muted-foreground">
            <div>CID: {cid}</div>
            {gatewayUrl && (
              <a
                className="text-blue-600 underline"
                href={gatewayUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open on gateway
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
