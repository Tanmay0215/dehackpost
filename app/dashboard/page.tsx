import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Your Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Wallet-linked profile summary.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submissions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Your past projects and hackathons.
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Link href="/ipfs-test">
          <Button>Test IPFS Integration</Button>
        </Link>
      </div>
    </main>
  );
}
