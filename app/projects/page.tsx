import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

const items = [
  {
    id: "proj-1",
    title: "Decentralized Voting",
    by: "Team Alpha",
    description: "A secure, transparent voting platform using blockchain.",
    tags: ["Governance", "Blockchain"],
    image: "/window.svg",
    members: 5,
    stars: 42,
    hackathon: "ETHGlobal Online",
    repo: "https://github.com/team-alpha/voting",
  },
  {
    id: "proj-2",
    title: "AI NFT Generator",
    by: "Team Beta",
    description: "Generate unique NFTs using AI models.",
    tags: ["AI", "NFT"],
    image: "/next.svg",
    members: 3,
    stars: 30,
    hackathon: "Solana Summer Camp",
    repo: "https://github.com/team-beta/ai-nft",
  },
  {
    id: "proj-3",
    title: "Zero Knowledge Identity",
    by: "Team Gamma",
    description: "Privacy-preserving identity solution with ZK proofs.",
    tags: ["ZK", "Identity"],
    image: "/vercel.svg",
    members: 4,
    stars: 25,
    hackathon: "ZK Weekend",
    repo: "https://github.com/team-gamma/zk-id",
  },
  {
    id: "proj-4",
    title: "DeFi Portfolio Tracker",
    by: "Team Delta",
    description: "Track and manage DeFi assets across chains.",
    tags: ["DeFi", "Analytics"],
    image: "/globe.svg",
    members: 6,
    stars: 18,
    hackathon: "ETHGlobal Online",
    repo: "https://github.com/team-delta/defi-tracker",
  },
  {
    id: "proj-5",
    title: "Payment Gateway",
    by: "Team Epsilon",
    description: "Easy crypto payments for e-commerce.",
    tags: ["Payments", "E-Commerce"],
    image: "/file.svg",
    members: 2,
    stars: 12,
    hackathon: "Solana Summer Camp",
    repo: "https://github.com/team-epsilon/payment-gateway",
  },
  {
    id: "proj-6",
    title: "DAO Management Tool",
    by: "Team Zeta",
    description: "Manage DAOs with proposals, voting, and treasury.",
    tags: ["DAO", "Governance"],
    image: "/window.svg",
    members: 7,
    stars: 8,
    hackathon: "Dehackpost Launch Hackathon",
    repo: "https://github.com/team-zeta/dao-tool",
  },
];

export default function ProjectsGallery() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Project Gallery</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Card
            key={p.id}
            className="hover:shadow-lg transition-shadow border-0 bg-white rounded-xl overflow-hidden"
          >
            <Image
              src={p.image}
              alt={p.title}
              width={800}
              height={128}
              className="w-full h-32 object-cover"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {p.hackathon} • By {p.by}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-2 text-gray-700">{p.description}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border px-2 py-0.5 text-xs bg-gray-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                <span>Members: {p.members}</span>
                <span>Stars: {p.stars}</span>
              </div>
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs"
              >
                View Repo
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
