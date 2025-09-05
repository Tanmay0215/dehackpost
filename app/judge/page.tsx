import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { JudgeFeedback } from "@/lib/types";

export default function JudgeDashboard() {
  const [projectId, setProjectId] = useState("");
  const [judgeWallet, setJudgeWallet] = useState("");
  const [scores, setScores] = useState({
    innovation: 0,
    usability: 0,
    technical: 0,
    presentation: 0,
  });
  const [comments, setComments] = useState("");
  const [cid, setCid] = useState<string | null>(null);

  async function submitFeedback() {
    const payload: JudgeFeedback = {
      id: `feedback-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      judgeWallet,
      scores,
      comments,
      submittedAt: new Date().toISOString(),
    };
    const res = await fetch("/api/ipfs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());
    setCid(res?.cid ?? null);
  }
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">Judge Dashboard</h1>
      <Tabs defaultValue="track-a" className="w-full">
        <TabsList>
          <TabsTrigger value="track-a">Track A</TabsTrigger>
          <TabsTrigger value="track-b">Track B</TabsTrigger>
        </TabsList>
        <TabsContent value="track-a">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Foo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="grid gap-2">
                <input
                  className="border px-2 py-1 rounded"
                  placeholder="Project ID"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                />
                <input
                  className="border px-2 py-1 rounded"
                  placeholder="Judge Wallet"
                  value={judgeWallet}
                  onChange={(e) => setJudgeWallet(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border px-2 py-1 rounded"
                    type="number"
                    placeholder="Innovation"
                    value={scores.innovation}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        innovation: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    className="border px-2 py-1 rounded"
                    type="number"
                    placeholder="Usability"
                    value={scores.usability}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        usability: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    className="border px-2 py-1 rounded"
                    type="number"
                    placeholder="Technical"
                    value={scores.technical}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        technical: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    className="border px-2 py-1 rounded"
                    type="number"
                    placeholder="Presentation"
                    value={scores.presentation}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        presentation: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <textarea
                  className="border px-2 py-1 rounded"
                  placeholder="Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <button
                  className="border px-3 py-1 rounded bg-black text-white"
                  onClick={submitFeedback}
                >
                  Submit Feedback to IPFS
                </button>
                {cid && <div className="text-xs">Feedback CID: {cid}</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="track-b">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Bar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Same form as Track A.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
