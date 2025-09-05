import { IPFS_GATEWAY } from "@/lib/constants";
import type { Registry, UserProfile } from "@/lib/types";

type OrganizedHackathonRow = { id: string; name: string };
type ProjectRow = { id: string; projectTitle: string };

async function loadProfile(wallet: string) {
  const reg = (await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/registry`,
    { cache: "no-store" }
  ).then((r) => r.json())) as Registry;
  const userEntry = (reg.users ?? []).find(
    (u) =>
      u.wallet === wallet ||
      u.cid === wallet ||
      (u as unknown as { cid: string }).cid === wallet
  );
  if (!userEntry)
    return { profile: null, projects: [], organized: [] } as {
      profile: UserProfile | null;
      projects: unknown[];
      organized: unknown[];
    };
  const profile = (await fetch(`${IPFS_GATEWAY}/ipfs/${userEntry.cid}`, {
    cache: "no-store",
  }).then((r) => r.json())) as UserProfile;

  const organized: OrganizedHackathonRow[] = await Promise.all(
    (reg.hackathons ?? [])
      .filter((h) => h.id && h.cid)
      .map(async (h) => {
        try {
          const data = await fetch(`${IPFS_GATEWAY}/ipfs/${h.cid}`, {
            cache: "no-store",
          }).then((r) => r.json());
          if (data.organizer?.toLowerCase() === wallet.toLowerCase()) {
            return {
              id: String(data.id),
              name: String(data.name),
            } as OrganizedHackathonRow;
          }
          return null;
        } catch {
          return null;
        }
      })
  ).then((list) => list.filter(Boolean) as OrganizedHackathonRow[]);

  const projects: ProjectRow[] = await Promise.all(
    (profile.participatedHackathons ?? []).map(async (p) => {
      try {
        const data = await fetch(`${IPFS_GATEWAY}/ipfs/${p.projectCID}`, {
          cache: "no-store",
        }).then((r) => r.json());
        return {
          id: String(data.id ?? p.projectCID),
          projectTitle: String(data.projectTitle ?? "-"),
        } as ProjectRow;
      } catch {
        return null;
      }
    })
  ).then((list) => list.filter(Boolean) as ProjectRow[]);

  return { profile, projects, organized } as {
    profile: UserProfile | null;
    projects: ProjectRow[];
    organized: OrganizedHackathonRow[];
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { wallet: string };
}) {
  const { wallet } = params;
  const data = await loadProfile(wallet);
  const organized: OrganizedHackathonRow[] =
    data.organized as OrganizedHackathonRow[];
  const projects: ProjectRow[] = data.projects as ProjectRow[];
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Profile</h1>
      {!data.profile ? (
        <div className="text-sm text-muted-foreground">
          No profile found for {wallet}
        </div>
      ) : (
        <div className="grid gap-6">
          <section>
            <div className="text-sm">Wallet: {data.profile.wallet}</div>
            <div className="text-sm">Name: {data.profile.username}</div>
            <div className="text-sm">
              Projects Submitted: {data.profile.reputation.projectsSubmitted}
            </div>
            <div className="text-sm">
              Hackathons Won: {data.profile.reputation.hackathonsWon}
            </div>
          </section>
          <section>
            <h2 className="mb-2 text-sm font-medium">Organized Hackathons</h2>
            {(organized ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground">None</div>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {organized.map((h) => (
                  <li key={h.id}>
                    <a
                      className="text-blue-600 underline"
                      href={`/hackathon/${h.id}`}
                    >
                      {h.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="mb-2 text-sm font-medium">Projects</h2>
            {(projects ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground">None</div>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {projects.map((p) => (
                  <li key={p.id}>{p.projectTitle}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
