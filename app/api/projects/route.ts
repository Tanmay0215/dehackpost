import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Project } from '@/lib/models/project';

// Get all projects (public endpoint)
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const url = new URL(req.url);
        const hackathonId = url.searchParams.get('hackathonId');
        
        let query = {};
        if (hackathonId) {
            query = { hackathonId };
        }
        
        const projects = await Project.find(query).sort({ submissionDate: -1 });
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Create new project (public endpoint for submissions)
export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const body = await req.json();
        const {
            title,
            description,
            hackathonId,
            track,
            team,
            tags,
            content, // Contains CIDs for demo, code, presentation
            submitterWallet
        } = body;

        // Validate required fields
        if (!title || !description || !hackathonId || !team) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate hackathon exists and is active
        try {
            const regResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/registry`, {
                cache: 'no-store'
            });
            const registry = await regResponse.json();
            const hackathonEntry = registry.hackathons?.find((h: any) => h.id === hackathonId);
            
            if (!hackathonEntry) {
                return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
            }

            // Fetch hackathon details to check if it's still active
            const ipfsGateway = process.env.NEXT_PUBLIC_GATEWAY_URL || '';
            const hackathonResponse = await fetch(`${ipfsGateway}/ipfs/${hackathonEntry.cid}`, {
                cache: 'no-store'
            });
            const hackathonData = await hackathonResponse.json();
            
            const now = new Date();
            const endDate = new Date(hackathonData.schedule?.end);
            
            if (now > endDate) {
                return NextResponse.json({ 
                    error: 'Hackathon has ended. Submissions are no longer accepted.' 
                }, { status: 400 });
            }
            
        } catch (error) {
            console.error('Error validating hackathon:', error);
            return NextResponse.json({ error: 'Failed to validate hackathon' }, { status: 500 });
        }

        // Generate unique project ID
        const projectId = `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const newProject = new Project({
            id: projectId,
            title,
            description,
            hackathonId,
            track,
            team,
            tags: tags || [],
            content: content || {},
            submissionDate: new Date().toISOString()
        });

        await newProject.save();
        
        return NextResponse.json({ 
            success: true, 
            project: newProject,
            message: 'Project submitted successfully' 
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
