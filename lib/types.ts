export type ProjectMetadata = {
    id: string;
    hackathonId: string;
    teamName: string;
    members: { name: string; wallet: string }[];
    projectTitle: string;
    description: string;
    tags: string[];
    repoURL: string;
    demoURL: string;
    mediaCIDs: string[];
    submittedAt: string;
    status: 'draft' | 'submitted' | 'finalist' | 'winner';
};

export type UserProfile = {
    wallet: string;
    username: string;
    bio: string;
    profileImageCID?: string;
    participatedHackathons: { hackathonId: string; projectCID: string }[];
    reputation: { hackathonsWon: number; projectsSubmitted: number };
};

export type JudgeFeedback = {
    id: string;
    projectId: string;
    judgeWallet: string;
    scores: { innovation: number; usability: number; technical: number; presentation: number };
    comments: string;
    submittedAt: string;
    signature?: string;
};

export type Registry = {
    hackathons: { id: string; cid: string }[];
    users: { wallet: string; cid: string }[];
};

export type PinataFileMetadata = {
    id: string;
    name: string;
    cid: string;
    size: number;
    number_of_files: number;
    mime_type: string | null;
    group_id: string | null;
    keyvalues?: Record<string, unknown>;
    created_at: string;
};


