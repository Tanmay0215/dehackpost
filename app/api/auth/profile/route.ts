import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { User } from '@/lib/models/user';
import { getWalletFromRequest, isValidWalletAddress, normalizeAddress } from '@/lib/auth/utils';

// Get user profile
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const address = getWalletFromRequest(req);
    if (!address || !isValidWalletAddress(address)) {
      return NextResponse.json({ error: 'Valid wallet address required' }, { status: 401 });
    }

    const normalizedAddress = normalizeAddress(address);
    let user = await User.findOne({ address: normalizedAddress });
    
    // Create user if doesn't exist
    if (!user) {
      user = await User.create({ 
        address: normalizedAddress,
        preferences: {
          notifications: true,
          publicProfile: true
        },
        stats: {
          hackathonsParticipated: 0,
          hackathonsWon: 0,
          projectsSubmitted: 0,
          totalRewards: '0'
        }
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in GET /api/auth/profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const address = getWalletFromRequest(req);
    if (!address || !isValidWalletAddress(address)) {
      return NextResponse.json({ error: 'Valid wallet address required' }, { status: 401 });
    }

    const updates = await req.json();
    const normalizedAddress = normalizeAddress(address);
    
    // Don't allow updating address through this endpoint  
    const { address: addressFromRequest, ...allowedUpdates } = updates;
    
    const user = await User.findOneAndUpdate(
      { address: normalizedAddress },
      { $set: allowedUpdates },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in PUT /api/auth/profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
