"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/lib/auth/types";
import { normalizeAddress } from "@/lib/auth/utils";

interface ProfilePageProps {
  params: Promise<{ wallet: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [wallet, setWallet] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { address: currentUserAddress } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    params.then(({ wallet }) => setWallet(wallet));
  }, [params]);

  const isOwnProfile = currentUserAddress && 
    normalizeAddress(currentUserAddress) === normalizeAddress(wallet);

  useEffect(() => {
    fetchProfile();
  }, [wallet]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/profile', {
        headers: {
          'x-wallet-address': normalizeAddress(wallet)
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
      } else if (response.status === 404) {
        setError('Profile not found');
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Profile Not Found</h1>
          <p className="text-gray-600">No profile found for wallet address: {wallet}</p>
          {isOwnProfile && (
            <div className="mt-4">
              <a 
                href="/register" 
                className="text-blue-600 hover:underline"
              >
                Create your profile
              </a>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {profile.profile?.name || 'Anonymous User'}
        </h1>
        {isOwnProfile && (
          <a 
            href="/register" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </a>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Wallet:</span> {profile.address}
            </div>
            {profile.profile?.email && (
              <div>
                <span className="font-medium">Email:</span> {profile.profile.email}
              </div>
            )}
            {profile.profile?.bio && (
              <div>
                <span className="font-medium">Bio:</span> {profile.profile.bio}
              </div>
            )}
            {profile.experience && (
              <div>
                <span className="font-medium">Experience:</span> {profile.experience}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Hackathons Participated:</span> {profile.stats?.hackathonsParticipated || 0}
            </div>
            <div>
              <span className="font-medium">Hackathons Won:</span> {profile.stats?.hackathonsWon || 0}
            </div>
            <div>
              <span className="font-medium">Projects Submitted:</span> {profile.stats?.projectsSubmitted || 0}
            </div>
            <div>
              <span className="font-medium">Total Rewards:</span> {profile.stats?.totalRewards || '0'} ETH
            </div>
          </CardContent>
        </Card>

        {profile.skills && profile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profile.profile?.github && (
              <div>
                <a 
                  href={`https://github.com/${profile.profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub: {profile.profile.github}
                </a>
              </div>
            )}
            {profile.profile?.website && (
              <div>
                <a 
                  href={profile.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Website: {profile.profile.website}
                </a>
              </div>
            )}
            {profile.profile?.twitter && (
              <div>
                <a 
                  href={`https://twitter.com/${profile.profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Twitter: {profile.profile.twitter}
                </a>
              </div>
            )}
            {profile.profile?.linkedin && (
              <div>
                <a 
                  href={profile.profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn: {profile.profile.linkedin}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
