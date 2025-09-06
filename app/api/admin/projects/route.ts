import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Project } from '@/lib/models/project';
import { isSystemAdmin } from '@/lib/admin/utils';

// Get all projects
export async function GET(req: NextRequest) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const projects = await Project.find({}).sort({ submissionDate: -1 });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Create new project
export async function POST(req: NextRequest) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const body = await req.json();

        const project = new Project(body);
        await project.save();

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
