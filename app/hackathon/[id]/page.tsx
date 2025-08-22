import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HackathonDetail({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Hackathon: {params.id}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <section>
            <h2 className="mb-2 text-sm font-medium">Overview</h2>
            <p className="text-sm text-muted-foreground">
              Event metadata from IPFS will render here.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-sm font-medium">Schedule</h2>
            <p className="text-sm text-muted-foreground">
              Timeline and deadlines.
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
