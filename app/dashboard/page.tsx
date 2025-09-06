"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";

function DashboardContent() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Your Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.profile?.name || 'Anonymous'}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>Wallet: {user?.address}</p>
              <p>Hackathons Participated: {user?.stats?.hackathonsParticipated || 0}</p>
              <p>Projects Submitted: {user?.stats?.projectsSubmitted || 0}</p>
              <p>Hackathons Won: {user?.stats?.hackathonsWon || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <a href="/register" className="block text-blue-600 hover:underline">
                Complete Profile Setup
              </a>
              <a href="/projects" className="block text-blue-600 hover:underline">
                View All Projects
              </a>
              <a href="/create" className="block text-blue-600 hover:underline">
                Create Hackathon
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function UserDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
