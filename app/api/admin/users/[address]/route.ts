import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { User } from '@/lib/models/user';
import { isSystemAdmin } from '@/lib/admin/utils';
import { normalizeAddress } from '@/lib/auth/utils';

// Update user
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const { address } = await params;
        const body = await req.json();

        const normalizedAddress = normalizeAddress(address);
        const user = await User.findOneAndUpdate(
            { address: normalizedAddress },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete user
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        // if (!(await isSystemAdmin(req))) {
        //     return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        // }

        await connectToDatabase();
        const { address } = await params;

        const normalizedAddress = normalizeAddress(address);
        const user = await User.findOneAndDelete({ address: normalizedAddress });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
