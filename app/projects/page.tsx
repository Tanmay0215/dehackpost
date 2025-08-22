import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsGallery() {
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: `proj-${i + 1}`,
    title: `Sample Project ${i + 1}`,
    by: "Team Alpha",
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Project Gallery</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              By {p.by}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
