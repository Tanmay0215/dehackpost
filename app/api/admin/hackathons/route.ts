import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Hackathon } from '@/lib/models/hackathon';
import { isSystemAdmin } from '@/lib/admin/utils';

// Get all hackathons
export async function GET(req: NextRequest) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const hackathons = await Hackathon.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ hackathons });
    } catch (error) {
        console.error('Error fetching hackathons:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Create new hackathon
export async function POST(req: NextRequest) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const body = await req.json();

        const hackathon = new Hackathon(body);
        await hackathon.save();

        return NextResponse.json(hackathon);
    } catch (error) {
        console.error('Error creating hackathon:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
