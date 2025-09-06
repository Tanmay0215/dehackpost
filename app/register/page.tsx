"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function ProfileSetupForm() {
  const { user, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    email: user?.profile?.email || '',
    bio: user?.profile?.bio || '',
    github: user?.profile?.github || '',
    website: user?.profile?.website || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || 'beginner'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await updateProfile({
        profile: {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          github: formData.github,
          website: formData.website,
        },
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: formData.experience as 'beginner' | 'intermediate' | 'advanced'
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Set up your profile to participate in hackathons
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <Label>Wallet Address</Label>
          <p className="font-mono text-sm">{user?.address}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your display name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="github">GitHub Username</Label>
            <Input
              id="github"
              value={formData.github}
              onChange={(e) => setFormData({...formData, github: e.target.value})}
              placeholder="username"
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              placeholder="React, Solidity, Python, AI"
            />
          </div>

          <div>
            <Label htmlFor="experience">Experience Level</Label>
            <select
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <ProtectedRoute>
      <ProfileSetupForm />
    </ProtectedRoute>
  );
}
