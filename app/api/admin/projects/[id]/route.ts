import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Project } from '@/lib/models/project';
import { isSystemAdmin } from '@/lib/admin/utils';

// Update project
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        const project = await Project.findOneAndUpdate(
            { id },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete project
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const { id } = await params;

        const project = await Project.findOneAndDelete({ id });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
