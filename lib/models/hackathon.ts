import mongoose, { Schema, Document } from 'mongoose';
import { HackathonRoles } from '../auth/types';

export interface IHackathon extends Document {
  id: string;
  name: string;
  description: string;
  creator: string; // Wallet address of the hackathon creator
  schedule: {
    start: string;
    end: string;
  };
  tracks: string[];
  prizes: {
    title: string;
    reward: string;
    sponsor?: string;
    winner?: string;
  }[];
  roles: HackathonRoles; // Role-based access control
  status: 'upcoming' | 'ongoing' | 'ended';
  createdAt: string;
  ipfsCID?: string;
  projectsCID: string[];
}

const HackathonSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true }, // Wallet address of creator
  schedule: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  tracks: [{ type: String }],
  prizes: [{
    title: { type: String, required: true },
    reward: { type: String, required: true },
    sponsor: { type: String },
    winner: { type: String }
  }],
  roles: {
    admins: [{ type: String }], // Array of wallet addresses
    organizers: [{ type: String }], // Array of wallet addresses  
    judges: [{ type: String }], // Array of wallet addresses
    participants: [{ type: String }] // Array of wallet addresses (optional)
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'ended'],
    default: 'upcoming'
  },
  createdAt: { type: String, default: () => new Date().toISOString() },
  ipfsCID: { type: String },
  projectsCID: [{ type: String }]
});

// Export model with proper error handling for Next.js hot reloading
let HackathonModel: mongoose.Model<IHackathon>;

try {
  HackathonModel = mongoose.model<IHackathon>('Hackathon');
} catch {
  HackathonModel = mongoose.model<IHackathon>('Hackathon', HackathonSchema);
}

export const Hackathon = HackathonModel;
