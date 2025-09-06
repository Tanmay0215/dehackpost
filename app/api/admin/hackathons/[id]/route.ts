import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Hackathon } from '@/lib/models/hackathon';
import { isSystemAdmin } from '@/lib/admin/utils';

// Update hackathon
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

        const hackathon = await Hackathon.findOneAndUpdate(
            { id },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!hackathon) {
            return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
        }

        return NextResponse.json(hackathon);
    } catch (error) {
        console.error('Error updating hackathon:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete hackathon
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

        const hackathon = await Hackathon.findOneAndDelete({ id });

        if (!hackathon) {
            return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Hackathon deleted successfully' });
    } catch (error) {
        console.error('Error deleting hackathon:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
