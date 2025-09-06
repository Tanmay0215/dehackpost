export interface UserProfile {
  address: string; // Wallet address (primary identifier)
  profile: {
    name?: string;
    email?: string;
    bio?: string;
    avatar?: string; // IPFS CID for profile picture
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  skills?: string[];
  experience?: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
  };
  stats: {
    hackathonsParticipated: number;
    hackathonsWon: number;
    projectsSubmitted: number;
    totalRewards: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HackathonRoles {
  admins: string[]; 
  organizers: string[]; 
  judges: string[]; 
  participants: string[]; 
}

export enum UserRole {
  PARTICIPANT = 'participant',
  ORGANIZER = 'organizer',
  JUDGE = 'judge',
  ADMIN = 'admin'
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextualState extends AuthState {
  getRoleForHackathon: (hackathonId: string) => Promise<UserRole>;
  hasRoleForHackathon: (hackathonId: string, role: UserRole) => Promise<boolean>;
}
