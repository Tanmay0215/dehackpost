"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPFS_GATEWAY } from "@/lib/constants";
import type { Registry } from "@/lib/types";

type IpfsContentResponse<T> =
  | { success: true; content: T }
  | { success: false; error?: string };

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fallback = "-"): string {
  return typeof value === "string" ? value : fallback;
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}

function readSchedule(value: unknown): { start: string; end: string } {
  if (isObjectRecord(value)) {
    return {
      start: readString(value.start, ""),
      end: readString(value.end, ""),
    };
  }
  return { start: "", end: "" };
}

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
              // Try via server API by CID first, then fallback to ID
              const byCid = await fetch(
                `/api/ipfs?cid=${encodeURIComponent(h.cid)}`,
                {
                  cache: "no-store",
                }
              )
                .then((r) => r.json() as Promise<IpfsContentResponse<unknown>>)
                .catch(
                  () => ({ success: false } as IpfsContentResponse<unknown>)
                );
              let content: unknown = byCid?.success ? byCid.content : null;
              if (!content) {
                const byId = await fetch(
                  `/api/ipfs?id=${encodeURIComponent(h.cid)}`,
                  {
                    cache: "no-store",
                  }
                )
                  .then(
                    (r) => r.json() as Promise<IpfsContentResponse<unknown>>
                  )
                  .catch(
                    () => ({ success: false } as IpfsContentResponse<unknown>)
                  );
                content = byId?.success ? byId.content : null;
              }
              if (!content) throw new Error("Failed to load hackathon");
              const obj = isObjectRecord(content) ? content : {};
              return {
                id: readString(obj.id, h.cid),
                name: readString(obj.name, "-"),
                status: readString(obj.status, "-"),
                schedule: readSchedule(obj.schedule),
                tracks: readStringArray(obj.tracks),
                projectsCID: readStringArray(obj.projectsCID),
                cid: h.cid,
              } satisfies HackathonRow;
            } catch {
              return null;
            }
          })
        );
        const filteredH = hackRows.filter((v): v is HackathonRow => Boolean(v));
        setHackathons(filteredH);

        // Load users
        setUsers(reg.users ?? []);

        // Load projects by crawling hackathons' project CIDs
        const projectCidSet = new Set<string>();
        for (const h of filteredH) {
          for (const cid of h.projectsCID) projectCidSet.add(cid);
        }
        const projRows: Array<ProjectRow | null> = await Promise.all(
          Array.from(projectCidSet).map(
            async (cid): Promise<ProjectRow | null> => {
              try {
                const byCid = await fetch(
                  `/api/ipfs?cid=${encodeURIComponent(cid)}`,
                  {
                    cache: "no-store",
                  }
                )
                  .then(
                    (r) => r.json() as Promise<IpfsContentResponse<unknown>>
                  )
                  .catch(
                    () => ({ success: false } as IpfsContentResponse<unknown>)
                  );
                let content: unknown = byCid?.success ? byCid.content : null;
                if (!content) {
                  const byId = await fetch(
                    `/api/ipfs?id=${encodeURIComponent(cid)}`,
                    {
                      cache: "no-store",
                    }
                  )
                    .then(
                      (r) => r.json() as Promise<IpfsContentResponse<unknown>>
                    )
                    .catch(
                      () => ({ success: false } as IpfsContentResponse<unknown>)
                    );
                  content = byId?.success ? byId.content : null;
                }
                if (!content) throw new Error("Failed to load project");
                const obj = isObjectRecord(content) ? content : {};
                const row: ProjectRow = {
                  id: readString(obj.id, cid),
                  projectTitle: readString(obj.projectTitle, "-"),
                  teamName: readString(obj.teamName, "-"),
                  hackathonId: readString(obj.hackathonId, "-"),
                  cid,
                };
                const repo = readOptionalString(obj.repoURL);
                if (repo) row.repoURL = repo;
                return row;
              } catch {
                return null;
              }
            }
          )
        );
        setProjects(projRows.filter((v): v is ProjectRow => v !== null));
      } catch {
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
