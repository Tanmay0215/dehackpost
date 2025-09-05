import { NextRequest, NextResponse } from 'next/server';
import { IPFS_GATEWAY, REGISTRY_CID_ENV } from '@/lib/constants';
import type { Registry } from '@/lib/types';

async function fetchFromGateway(cid: string): Promise<unknown> {
    const url = `${IPFS_GATEWAY}/ipfs/${cid}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch registry from ${url}`);
    return res.json();
}

export async function GET() {
    try {
        if (!REGISTRY_CID_ENV) {
            return NextResponse.json({ hackathons: [], users: [] } as Registry);
        }
        const data = (await fetchFromGateway(REGISTRY_CID_ENV)) as Registry;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ hackathons: [], users: [] } as Registry);
    }
}

export async function POST(req: NextRequest) {
    // This endpoint just returns the merged registry object; client will upload to IPFS.
    try {
        const body = (await req.json()) as {
            current: Registry;
            add?: { id: string; cid: string }; // add hackathon
            addUser?: { wallet: string; cid: string }; // add user profile
        };

        const hackathons = [...(body.current?.hackathons ?? [])];
        if (body.add) hackathons.push(body.add);

        const users = [...(body.current?.users ?? [])];
        if (body.addUser) users.push(body.addUser);

        const next: Registry = { hackathons, users };
        return NextResponse.json(next);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}


