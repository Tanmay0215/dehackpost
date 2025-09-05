"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPFS_GATEWAY } from "@/lib/constants";
import type { Registry } from "@/lib/types";

type HackathonRow = {
  id: string;
  name: string;
  status: string;
  schedule: { start: string; end: string };
  tracks: string[];
  projectsCID: string[];
  cid: string;
};

type UserRow = { wallet: string; cid: string };

type ProjectRow = {
  id: string;
  projectTitle: string;
  teamName: string;
  hackathonId: string;
  repoURL?: string;
  cid: string;
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [hackathons, setHackathons] = useState<HackathonRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const reg = await fetch("/api/registry", { cache: "no-store" }).then(
          (r) => r.json() as Promise<Registry>
        );
        setRegistry(reg);

        // Load hackathons
        const hackRows = await Promise.all(
          (reg.hackathons ?? []).map(async (h) => {
            try {
              const data = await fetch(`${IPFS_GATEWAY}/ipfs/${h.cid}`, {
                cache: "no-store",
              }).then((r) => r.json());
              return {
                id: data.id as string,
                name: data.name as string,
                status: (data.status ?? "-") as string,
                schedule: data.schedule as { start: string; end: string },
                tracks: (data.tracks ?? []) as string[],
                projectsCID: (data.projectsCID ?? []) as string[],
                cid: h.cid,
              } satisfies HackathonRow;
            } catch {
              return null;
            }
          })
        );
        const filteredH = hackRows.filter(Boolean) as HackathonRow[];
        setHackathons(filteredH);

        // Load users
        setUsers((reg.users ?? []) as unknown as UserRow[]);

        // Load projects by crawling hackathons' project CIDs
        const projectCidSet = new Set<string>();
        for (const h of filteredH) {
          for (const cid of h.projectsCID) projectCidSet.add(cid);
        }
        const projRows = await Promise.all(
          Array.from(projectCidSet).map(async (cid) => {
            try {
              const data = await fetch(`${IPFS_GATEWAY}/ipfs/${cid}`, {
                cache: "no-store",
              }).then((r) => r.json());
              return {
                id: (data.id ?? cid) as string,
                projectTitle: (data.projectTitle ?? "-") as string,
                teamName: (data.teamName ?? "-") as string,
                hackathonId: (data.hackathonId ?? "-") as string,
                repoURL: (data.repoURL ?? undefined) as string | undefined,
                cid,
              } satisfies ProjectRow;
            } catch {
              return null;
            }
          })
        );
        setProjects(projRows.filter(Boolean) as ProjectRow[]);
      } catch (e) {
        setError("Failed to load registry or IPFS data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Admin Panel</h1>
      {loading && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <Tabs defaultValue="hackathons" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="registry">Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="hackathons">
          <div className="grid gap-4 md:grid-cols-2">
            {hackathons.map((h) => (
              <Card key={h.id}>
                <CardHeader>
                  <CardTitle className="text-base">{h.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>ID: {h.id}</div>
                  <div>Status: {h.status}</div>
                  <div>Tracks: {h.tracks.join(", ") || "-"}</div>
                  <div>
                    Start:{" "}
                    {h.schedule.start
                      ? new Date(h.schedule.start).toLocaleString()
                      : "-"}
                  </div>
                  <div>
                    End:{" "}
                    {h.schedule.end
                      ? new Date(h.schedule.end).toLocaleString()
                      : "-"}
                  </div>
                  <div>Projects: {h.projectsCID.length}</div>
                  <div>
                    CID:{" "}
                    <a
                      className="underline text-blue-600"
                      href={`${IPFS_GATEWAY}/ipfs/${h.cid}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {h.cid}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
            {hackathons.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No hackathons found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.cid}>
                <CardHeader>
                  <CardTitle className="text-base">{p.projectTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>ID: {p.id}</div>
                  <div>Team: {p.teamName}</div>
                  <div>Hackathon: {p.hackathonId}</div>
                  {p.repoURL && (
                    <div>
                      Repo:{" "}
                      <a
                        className="underline text-blue-600"
                        href={p.repoURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p.repoURL}
                      </a>
                    </div>
                  )}
                  <div>
                    CID:{" "}
                    <a
                      className="underline text-blue-600"
                      href={`${IPFS_GATEWAY}/ipfs/${p.cid}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.cid}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
            {projects.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No projects found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-4 md:grid-cols-2">
            {(users ?? []).map((u) => (
              <Card key={`${u.wallet}-${u.cid}`}>
                <CardHeader>
                  <CardTitle className="text-base">{u.wallet}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>
                    Profile:{" "}
                    <a
                      className="underline text-blue-600"
                      href={`${IPFS_GATEWAY}/ipfs/${u.cid}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {u.cid}
                    </a>
                  </div>
                  <div>
                    View:{" "}
                    <a
                      className="underline text-blue-600"
                      href={`/profile/${u.wallet}`}
                    >
                      Profile Page
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
            {users.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No users found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="registry">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Registry</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div>Hackathons: {(registry?.hackathons ?? []).length}</div>
              <div>Users: {(registry?.users ?? []).length}</div>
              <div className="mt-2">
                Tip: Set NEXT_PUBLIC_REGISTRY_CID to load an existing registry
                from IPFS.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
