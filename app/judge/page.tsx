import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JudgeDashboard() {
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
              Scoring UI will go here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="track-b">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Bar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Scoring UI will go here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
