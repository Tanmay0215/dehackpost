import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockEvents = [
  {
    id: "eth-global",
    name: "ETHGlobal Online",
    date: "2025-09-10",
    prize: "$500k",
    tracks: ["DeFi", "AI"],
  },
  {
    id: "sol-summer",
    name: "Solana Summer Camp",
    date: "2025-08-01",
    prize: "$1M",
    tracks: ["Infra", "Payments"],
  },
  {
    id: "zk-weekend",
    name: "ZK Weekend",
    date: "2025-07-15",
    prize: "$100k",
    tracks: ["ZK", "Identity"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="q">Search</Label>
          <Input id="q" placeholder="Search hackathons by name, track, tag" />
        </div>
        <div className="grid w-40 gap-2">
          <Label>Sort</Label>
          <Select defaultValue="date">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="prize">Prize</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((e) => (
          <Card key={e.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{e.name}</CardTitle>
              <CardDescription>
                {e.date} • Prize {e.prize}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex flex-wrap gap-2">
                {e.tracks.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border px-2 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
