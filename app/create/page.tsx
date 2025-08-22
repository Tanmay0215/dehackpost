"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateHackathon() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Create Hackathon</h1>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hackathon title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short overview"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Publish to IPFS</Button>
        </div>
      </div>
    </main>
  );
}
