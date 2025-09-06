import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IPFS_GATEWAY } from "@/lib/constants";
import Link from "next/link";

async function getProjects() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      return data.projects || [];
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }
  return [];
}

export default async function ProjectsGallery() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Project Gallery</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No projects yet</h2>
          <p className="text-gray-600 mb-6">Projects are submitted through hackathons.</p>
          <Link href="/discover">
            <Button>Browse Hackathons</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Gallery</h1>
        <Link href="/discover">
          <Button>Browse Hackathons</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow border rounded-xl overflow-hidden"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {project.hackathonId} • By {project.team.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-3 text-gray-700">{project.description}</div>
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Team members */}
              <div className="text-xs text-gray-500 mb-3">
                <span>Team: {project.team.members.length} member{project.team.members.length !== 1 ? 's' : ''}</span>
                <br />
                <span>Submitted: {new Date(project.submissionDate).toLocaleDateString()}</span>
              </div>

              {/* Project Content Links */}
              <div className="space-y-1">
                {project.content?.code && (
                  <div>
                    <a
                      href={project.content.code.startsWith('http') ? project.content.code : `${IPFS_GATEWAY}/ipfs/${project.content.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs block"
                    >
                      📁 View Code
                    </a>
                  </div>
                )}
                {project.content?.demo && (
                  <div>
                    <a
                      href={`${IPFS_GATEWAY}/ipfs/${project.content.demo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs block"
                    >
                      🎥 View Demo
                    </a>
                  </div>
                )}
                {project.content?.presentation && (
                  <div>
                    <a
                      href={`${IPFS_GATEWAY}/ipfs/${project.content.presentation}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs block"
                    >
                      📊 View Presentation
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
