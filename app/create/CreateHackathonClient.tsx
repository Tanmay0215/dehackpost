"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { buildHackathon } from "@/lib/hackathon";
import type { Registry } from "@/lib/types";
import type { HackathonPrize, HackathonJudge } from "@/lib/hackathon";

export function CreateHackathonClient() {
  const { address } = useAccount();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tracks, setTracks] = useState<string>("DeFi, AI x Blockchain, NFTs");
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "ended">(
    "upcoming"
  );
  const [prizes, setPrizes] = useState<HackathonPrize[]>([
    {
      title: "1st Prize",
      reward: "2000 USDC",
      sponsor: "Polygon",
      winner: null,
    },
  ]);
  const [judges, setJudges] = useState<HackathonJudge[]>([
    { name: "Alice", wallet: "0xJudge1" },
  ]);
  const [projectsCID, setProjectsCID] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (address && !organizer) {
      setOrganizer(address);
    }
  }, [address, organizer]);

  // Rest of the component logic...
  const parsedProjectsCID = useMemo(() => {
    return projectsCID
      ? projectsCID.split(",").map((s) => s.trim())
      : [];
  }, [projectsCID]);

  const parsedTracks = useMemo(() => {
    return tracks.split(",").map((track) => track.trim());
  }, [tracks]);

  const handleAddPrize = () => {
    setPrizes([
      ...prizes,
      { title: "", reward: "", sponsor: "", winner: null },
    ]);
  };

  const handleRemovePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const handlePrizeChange = (
    index: number,
    field: keyof HackathonPrize,
    value: string
  ) => {
    const newPrizes = [...prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setPrizes(newPrizes);
  };

  const handleAddJudge = () => {
    setJudges([...judges, { name: "", wallet: "" }]);
  };

  const handleRemoveJudge = (index: number) => {
    setJudges(judges.filter((_, i) => i !== index));
  };

  const handleJudgeChange = (
    index: number,
    field: keyof HackathonJudge,
    value: string
  ) => {
    const newJudges = [...judges];
    newJudges[index] = { ...newJudges[index], [field]: value };
    setJudges(newJudges);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const hackathon = buildHackathon({
        id,
        name,
        description: desc,
        organizer,
        schedule: {
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
        },
        status,
        tracks: parsedTracks,
        prizes,
        judges,
        projectsCID: parsedProjectsCID,
        createdAt: createdAt || new Date().toISOString(),
      });

      const result = await fetch("/api/hackathon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hackathon),
      });

      if (result.ok) {
        const response = await result.json();
        alert(`Hackathon created successfully! ID: ${response.id}`);
        // Reset form
        setId("");
        setName("");
        setDesc("");
        setStart("");
        setEnd("");
        setTracks("DeFi, AI x Blockchain, NFTs");
        setStatus("upcoming");
        setPrizes([
          {
            title: "1st Prize",
            reward: "2000 USDC",
            sponsor: "Polygon",
            winner: null,
          },
        ]);
        setJudges([{ name: "Alice", wallet: "0xJudge1" }]);
        setProjectsCID("");
        setCreatedAt("");
      } else {
        throw new Error("Failed to create hackathon");
      }
    } catch (error) {
      console.error("Error creating hackathon:", error);
      alert("Error creating hackathon. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create New Hackathon
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="id">Hackathon ID</Label>
            <Input
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="unique-hackathon-id"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Hackathon Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Awesome Hackathon"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe your hackathon..."
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">Organizer Wallet</Label>
          <Input
            id="organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="start">Start Date</Label>
            <Input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end">End Date</Label>
            <Input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tracks">Tracks (comma-separated)</Label>
          <Input
            id="tracks"
            value={tracks}
            onChange={(e) => setTracks(e.target.value)}
            placeholder="DeFi, AI x Blockchain, NFTs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
          </select>
        </div>

        {/* Prizes Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Prizes</Label>
            <Button type="button" onClick={handleAddPrize} variant="outline">
              Add Prize
            </Button>
          </div>
          {prizes.map((prize, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Prize {index + 1}</h4>
                {prizes.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemovePrize(index)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="Prize Title"
                  value={prize.title}
                  onChange={(e) =>
                    handlePrizeChange(index, "title", e.target.value)
                  }
                />
                <Input
                  placeholder="Reward Amount"
                  value={prize.reward}
                  onChange={(e) =>
                    handlePrizeChange(index, "reward", e.target.value)
                  }
                />
                <Input
                  placeholder="Sponsor"
                  value={prize.sponsor}
                  onChange={(e) =>
                    handlePrizeChange(index, "sponsor", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Judges Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Judges</Label>
            <Button type="button" onClick={handleAddJudge} variant="outline">
              Add Judge
            </Button>
          </div>
          {judges.map((judge, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Judge {index + 1}</h4>
                {judges.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveJudge(index)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Judge Name"
                  value={judge.name}
                  onChange={(e) =>
                    handleJudgeChange(index, "name", e.target.value)
                  }
                />
                <Input
                  placeholder="Wallet Address"
                  value={judge.wallet}
                  onChange={(e) =>
                    handleJudgeChange(index, "wallet", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectsCID">Projects CID (comma-separated)</Label>
          <Input
            id="projectsCID"
            value={projectsCID}
            onChange={(e) => setProjectsCID(e.target.value)}
            placeholder="QmHash1, QmHash2, ..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdAt">Created At (optional)</Label>
          <Input
            id="createdAt"
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 text-lg"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Hackathon"}
        </Button>
      </form>
    </div>
  );
}
