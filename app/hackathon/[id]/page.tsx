import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPFS_GATEWAY } from "@/lib/constants";

async function getHackathonData(id: string) {
  const reg = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/registry`,
    { cache: "no-store" }
  ).then((r) => r.json());
  const entry = (reg.hackathons ?? []).find(
    (h: { id: string; cid: string }) => h.id === id
  );
  if (!entry) return null;
  try {
    const data = await fetch(`${IPFS_GATEWAY}/ipfs/${entry.cid}`, {
      cache: "no-store",
    }).then((r) => r.json());
    return data as {
      id: string;
      name: string;
      description: string;
      organizer: string;
      schedule: { start: string; end: string };
      tracks: string[];
      prizes: {
        title: string;
        reward: string;
        sponsor?: string;
        winner?: string | null;
      }[];
      judges: { name: string; wallet: string }[];
      projectsCID: string[];
      status: string;
    };
  } catch {
    return null;
  }
}

export default async function HackathonDetail({
  params,
}: {
  params: { id: string };
}) {
  const data = await getHackathonData(params.id);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{data?.name ?? `Hackathon: ${params.id}`}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="mb-2 text-sm font-medium">Overview</h2>
            <div className="text-sm text-muted-foreground">
              <div className="mb-2">
                {data?.description ?? "No description"}
              </div>
              <div>Organizer: {data?.organizer ?? "-"}</div>
              <div>Status: {data?.status ?? "-"}</div>
            </div>
          </section>
          <section>
            <h2 className="mb-2 text-sm font-medium">Schedule</h2>
            <div className="text-sm text-muted-foreground">
              <div>
                Start:{" "}
                {data?.schedule?.start
                  ? new Date(data.schedule.start).toLocaleString()
                  : "-"}
              </div>
              <div>
                End:{" "}
                {data?.schedule?.end
                  ? new Date(data.schedule.end).toLocaleString()
                  : "-"}
              </div>
            </div>
          </section>
          <section className="md:col-span-2">
            <h2 className="mb-2 text-sm font-medium">Prizes & Judges</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs uppercase text-muted-foreground">
                  Prizes
                </div>
                <ul className="list-disc pl-5 text-sm">
                  {(data?.prizes ?? []).map((p, i) => (
                    <li key={i}>
                      {p.title} — {p.reward} {p.sponsor ? `• ${p.sponsor}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase text-muted-foreground">
                  Judges
                </div>
                <ul className="list-disc pl-5 text-sm">
                  {(data?.judges ?? []).map((j, i) => (
                    <li key={i}>
                      {j.name} — {j.wallet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="md:col-span-2">
            <h2 className="mb-2 text-sm font-medium">Submitted Projects</h2>
            <div className="text-sm text-muted-foreground">
              {(data?.projectsCID ?? []).length === 0 ? (
                "No submissions yet."
              ) : (
                <ul className="list-disc pl-5">
                  {data?.projectsCID.map((cid) => (
                    <li key={cid}>
                      <a
                        className="text-blue-600 underline"
                        href={`${IPFS_GATEWAY}/ipfs/${cid}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {cid}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
