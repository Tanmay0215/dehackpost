import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  description: string;
  hackathonId: string;
  team: {
    name: string;
    members: {
      name: string;
      wallet: string;
    }[];
  };
  tags: string[];
  submissionDate: string;
  content: {
    demo?: string;  // IPFS CID
    code?: string;  // IPFS CID or GitHub URL
    presentation?: string; // IPFS CID
  };
  ipfsCID?: string; // Full project data on IPFS
  scores: {
    judgeWallet: string;
    criteria: string;
    score: number;
    feedback?: string;
  }[];
}

const ProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  hackathonId: { type: String, required: true, ref: 'Hackathon' },
  team: {
    name: { type: String, required: true },
    members: [{
      name: { type: String, required: true },
      wallet: { type: String, required: true }
    }]
  },
  tags: [{ type: String }],
  submissionDate: { type: String, default: () => new Date().toISOString() },
  content: {
    demo: { type: String },
    code: { type: String },
    presentation: { type: String }
  },
  ipfsCID: { type: String },
  scores: [{
    judgeWallet: { type: String, required: true },
    criteria: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    feedback: { type: String }
  }]
});

export const Project = mongoose.models?.Project || mongoose.model<IProject>('Project', ProjectSchema);
