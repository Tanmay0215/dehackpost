import { NextRequest, NextResponse } from 'next/server';
import { buildHackathon, HackathonInput } from '@/lib/hackathon';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<HackathonInput>;

        if (!body || !body.id || !body.name || !body.description || !body.organizer || !body.schedule?.start || !body.schedule?.end) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hackathon = buildHackathon({
            id: body.id,
            name: body.name,
            description: body.description,
            organizer: body.organizer,
            schedule: {
                start: body.schedule.start,
                end: body.schedule.end,
            },
            tracks: body.tracks ?? ['DeFi', 'AI x Blockchain', 'NFTs'],
            prizes: body.prizes,
            judges: body.judges,
            projectsCID: body.projectsCID,
            status: body.status ?? 'upcoming',
            createdAt: body.createdAt ?? new Date().toISOString(),
        });

        return NextResponse.json(hackathon);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}


