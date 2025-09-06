import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import { Hackathon } from '@/lib/models/hackathon';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const hackathon = await Hackathon.findOne({ id });
    
    if (!hackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }
    
    return NextResponse.json(hackathon);
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const updates = await req.json();
    
    const hackathon = await Hackathon.findOneAndUpdate(
      { id },
      updates,
      { new: true }
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
