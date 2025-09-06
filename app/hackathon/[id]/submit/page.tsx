"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { IPFS_GATEWAY } from "@/lib/constants";

interface FileUpload {
  file: File;
  type: 'demo' | 'code' | 'presentation';
  cid?: string | null;
  uploading?: boolean;
}

interface Hackathon {
  id: string;
  name: string;
  description: string;
  schedule: { start: string; end: string };
  tracks: string[];
}

export default function HackathonSubmitProject() {
  const params = useParams();
  const hackathonId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  
  // Hackathon data
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Basic project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamName, setTeamName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [tags, setTags] = useState("");
  const [repoURL, setRepoURL] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  
  // File uploads
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadHackathonData();
  }, [hackathonId]);

  const loadHackathonData = async () => {
    try {
      setLoading(true);
      
      // Get hackathon from registry
      const reg = await fetch("/api/registry", { cache: "no-store" }).then(r => r.json());
      const entry = reg.hackathons?.find((h: any) => h.id === hackathonId);
      
      if (!entry) {
        throw new Error('Hackathon not found');
      }

      // Fetch hackathon details from IPFS
      const hackathonData = await fetch(`${IPFS_GATEWAY}/ipfs/${entry.cid}`, {
        cache: "no-store",
      }).then(r => r.json());

      setHackathon(hackathonData);
      
      // Check if hackathon is active
      const now = new Date();
      const endDate = new Date(hackathonData.schedule.end);
      
      if (now > endDate) {
        alert('This hackathon has ended. Submissions are no longer accepted.');
      }
      
    } catch (error) {
      console.error('Error loading hackathon:', error);
      alert('Failed to load hackathon data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading hackathon details...</p>
        </div>
      </main>
    );
  }

  if (!hackathon) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Hackathon Not Found</CardTitle>
            <CardDescription>
              The hackathon you're trying to submit to doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/discover'}>
              Browse Hackathons
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleFileUpload = (file: File, type: 'demo' | 'code' | 'presentation') => {
    const newFile: FileUpload = { file, type };
    setFiles(prev => [...prev.filter(f => f.type !== type), newFile]);
  };

  const uploadFileToIPFS = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ipfs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return result.cid || null;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    // Check if hackathon is still active
    const now = new Date();
    const endDate = new Date(hackathon.schedule.end);
    
    if (now > endDate) {
      alert('This hackathon has ended. Submissions are no longer accepted.');
      return;
    }

    setSubmitting(true);
    
    try {
      // Step 1: Upload all files to IPFS and get their CIDs
      const contentCIDs: Record<string, string> = {};
      
      for (const fileUpload of files) {
        setFiles(prev => prev.map(f => 
          f.type === fileUpload.type ? { ...f, uploading: true } : f
        ));
        
        const cid = await uploadFileToIPFS(fileUpload.file);
        if (cid) {
          contentCIDs[fileUpload.type] = cid;
        }
        
        setFiles(prev => prev.map(f => 
          f.type === fileUpload.type ? { ...f, uploading: false, cid } : f
        ));
      }

      // Add repo URL if provided
      if (repoURL) {
        contentCIDs.code = repoURL;
      }

      // Step 2: Create project object with basic details + CIDs
      const projectData = {
        title,
        description,
        hackathonId,
        track: selectedTrack,
        team: {
          name: teamName,
          members: [
            {
              name: memberName || 'Anonymous',
              wallet: address
            }
          ]
        },
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        content: contentCIDs,
        submitterWallet: address
      };

      // Step 3: Save to MongoDB
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Project submitted successfully:', result);
        setSubmitted(true);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit project');
      }

    } catch (error) {
      console.error('Error submitting project:', error);
      alert(`Failed to submit project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">🎉 Project Submitted Successfully!</CardTitle>
            <CardDescription>
              Your project has been submitted to "{hackathon.name}" and uploaded to IPFS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => window.location.href = `/hackathon/${hackathonId}`}>
              Back to Hackathon
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/projects'}
              className="ml-2"
            >
              View All Projects
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      {/* Hackathon Context */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Submitting to: {hackathon.name}</CardTitle>
          <CardDescription>
            Deadline: {new Date(hackathon.schedule.end).toLocaleDateString()} at{' '}
            {new Date(hackathon.schedule.end).toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
      </Card>

      <h1 className="mb-6 text-3xl font-bold">Submit Your Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Basic details about your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project..."
                required
                rows={4}
              />
            </div>

            {hackathon.tracks && hackathon.tracks.length > 0 && (
              <div>
                <Label htmlFor="track">Track</Label>
                <select
                  id="track"
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a track</option>
                  {hackathon.tracks.map((track: string) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="blockchain, ai, web3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
            <CardDescription>Tell us about your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="The Innovators"
                required
              />
            </div>

            <div>
              <Label htmlFor="memberName">Your Name</Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label>Connected Wallet</Label>
              <Input value={address || 'Not connected'} disabled />
            </div>
          </CardContent>
        </Card>

        {/* File Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Project Assets</CardTitle>
            <CardDescription>Upload your demo video, code, and presentation (stored on IPFS)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="repoURL">Code Repository URL</Label>
              <Input
                id="repoURL"
                value={repoURL}
                onChange={(e) => setRepoURL(e.target.value)}
                placeholder="https://github.com/username/project"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="demo">Demo Video (MP4, etc.)</Label>
              <Input
                id="demo"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'demo');
                }}
              />
              {files.find(f => f.type === 'demo')?.uploading && (
                <p className="text-sm text-blue-600">Uploading to IPFS...</p>
              )}
              {files.find(f => f.type === 'demo')?.cid && (
                <p className="text-sm text-green-600">✓ Uploaded to IPFS</p>
              )}
            </div>

            <div>
              <Label htmlFor="presentation">Presentation (PDF, PPT, etc.)</Label>
              <Input
                id="presentation"
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'presentation');
                }}
              />
              {files.find(f => f.type === 'presentation')?.uploading && (
                <p className="text-sm text-blue-600">Uploading to IPFS...</p>
              )}
              {files.find(f => f.type === 'presentation')?.cid && (
                <p className="text-sm text-green-600">✓ Uploaded to IPFS</p>
              )}
            </div>

            <div>
              <Label htmlFor="code">Additional Code Files (ZIP)</Label>
              <Input
                id="code"
                type="file"
                accept=".zip,.tar,.gz"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'code');
                }}
              />
              {files.find(f => f.type === 'code')?.uploading && (
                <p className="text-sm text-blue-600">Uploading to IPFS...</p>
              )}
              {files.find(f => f.type === 'code')?.cid && (
                <p className="text-sm text-green-600">✓ Uploaded to IPFS</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={submitting || !address}
        >
          {submitting ? 'Submitting...' : `Submit to ${hackathon.name}`}
        </Button>
      </form>
    </main>
  );
}
