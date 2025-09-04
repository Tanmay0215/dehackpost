export type HackathonPrize = {
    title: string;
    reward: string;
    sponsor?: string;
    winner?: string | null;
};

export type HackathonJudge = {
    name: string;
    wallet: string;
};

export type HackathonInput = {
    id: string;
    name: string;
    description: string;
    organizer: string;
    schedule: { start: string | Date; end: string | Date };
    tracks?: string[];
    prizes?: HackathonPrize[];
    judges?: HackathonJudge[];
    projectsCID?: string[];
    status?: 'upcoming' | 'ongoing' | 'ended';
    createdAt?: string | Date;
};

export type Hackathon = {
    id: string;
    name: string;
    description: string;
    organizer: string;
    schedule: { start: string; end: string };
    tracks: string[];
    prizes: HackathonPrize[];
    judges: HackathonJudge[];
    projectsCID: string[];
    status: 'upcoming' | 'ongoing' | 'ended';
    createdAt: string;
};

export function buildHackathon(input: HackathonInput): Hackathon {
    return {
        id: input.id,
        name: input.name,
        description: input.description,
        organizer: input.organizer,
        schedule: {
            start: new Date(input.schedule.start).toISOString(),
            end: new Date(input.schedule.end).toISOString(),
        },
        tracks: input.tracks ?? [],
        prizes: (input.prizes ?? []).map((p) => ({
            title: p.title,
            reward: p.reward,
            sponsor: p.sponsor,
            winner: p.winner ?? null,
        })),
        judges: input.judges ?? [],
        projectsCID: input.projectsCID ?? [],
        status: input.status ?? 'upcoming',
        createdAt: input.createdAt ? new Date(input.createdAt).toISOString() : new Date().toISOString(),
    };
}


