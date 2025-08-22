"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitProject() {
  const [title, setTitle] = useState("");
  const [repo, setRepo] = useState("");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Submit Project</h1>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="repo">Repository URL</Label>
          <Input
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="demo">Demo Link</Label>
          <Input id="demo" placeholder="https://..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="What did you build?" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Save draft</Button>
          <Button>Upload to IPFS</Button>
        </div>
      </div>
    </main>
  );
}
