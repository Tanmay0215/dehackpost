import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPanel() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Admin Panel</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Moderation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Approve/Reject events and entries.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Pins, providers, roles.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
