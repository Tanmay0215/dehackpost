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
    description: "A global Ethereum hackathon with top DeFi and AI tracks.",
    location: "Online",
    participants: 1200,
    sponsors: ["Ethereum Foundation", "Aave"],
    image: "/file.svg",
  },
  {
    id: "sol-summer",
    name: "Solana Summer Camp",
    date: "2025-08-01",
    prize: "$1M",
    tracks: ["Infra", "Payments"],
    description:
      "Solana's biggest summer event for infrastructure and payments.",
    location: "San Francisco, CA",
    participants: 800,
    sponsors: ["Solana Labs", "Circle"],
    image: "/globe.svg",
  },
  {
    id: "zk-weekend",
    name: "ZK Weekend",
    date: "2025-07-15",
    prize: "$100k",
    tracks: ["ZK", "Identity"],
    description: "Zero Knowledge and Identity focused hackathon.",
    location: "Berlin, Germany",
    participants: 300,
    sponsors: ["Polygon", "zkSync"],
    image: "/next.svg",
  },
  {
    id: "dehackpost-launch",
    name: "Dehackpost Launch Hackathon",
    date: "2025-09-01",
    prize: "$2k USDC",
    tracks: ["Decentralized Apps", "Infra"],
    description: "A hackathon to build decentralized apps for Dehackpost.",
    location: "Remote",
    participants: 500,
    sponsors: ["Dehackpost"],
    image: "/file.svg",
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((e) => (
          <Card
            key={e.id}
            className="hover:shadow-lg transition-shadow border-0 bg-white rounded-xl overflow-hidden"
          >
            <img
              src={e.image}
              alt={e.name}
              className="w-full h-32 object-cover"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">{e.name}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {e.location} • {e.date} • Prize {e.prize}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-2 text-gray-700">{e.description}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {e.tracks.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border px-2 py-0.5 text-xs bg-gray-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Participants: {e.participants}</span>
                <span>Sponsors: {e.sponsors.join(", ")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
