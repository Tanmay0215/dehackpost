import mongoose from 'mongoose';
import { UserProfile } from '../auth/types';

const UserSchema = new mongoose.Schema<UserProfile>({
  address: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true
  },
  profile: {
    name: String,
    email: String,
    bio: String,
    avatar: String, // IPFS CID
    website: String,
    github: String,
    twitter: String,
    linkedin: String,
  },
  skills: [String],
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true }
  },
  stats: {
    hackathonsParticipated: { type: Number, default: 0 },
    hackathonsWon: { type: Number, default: 0 },
    projectsSubmitted: { type: Number, default: 0 },
    totalRewards: { type: String, default: '0' }
  }
}, { 
  timestamps: true 
});

// Export model with proper error handling for Next.js hot reloading
let UserModel: mongoose.Model<UserProfile>;

try {
  UserModel = mongoose.model<UserProfile>('User');
} catch {
  UserModel = mongoose.model<UserProfile>('User', UserSchema);
}

export const User = UserModel;
