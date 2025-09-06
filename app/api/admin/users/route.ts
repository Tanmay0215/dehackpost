import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { User } from '@/lib/models/user';
import { isSystemAdmin } from '@/lib/admin/utils';

// Get all users
export async function GET(req: NextRequest) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const users = await User.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Create new user (though users typically self-register)
export async function POST(req: NextRequest) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const body = await req.json();

        const user = new User(body);
        await user.save();

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
