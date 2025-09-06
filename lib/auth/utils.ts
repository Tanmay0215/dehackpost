import { NextRequest } from 'next/server';
import { UserRole } from './types';
import { Hackathon } from '@/lib/models/hackathon';

/**
 * Extract wallet address from request headers
 */
export function getWalletFromRequest(req: NextRequest): string | null {
  return req.headers.get('x-wallet-address');
}

/**
 * Check if user has required role for a specific hackathon
 */
export async function hasRoleForHackathon(
  walletAddress: string, 
  hackathonId: string, 
  requiredRole: UserRole
): Promise<boolean> {
  try {
    const hackathon = await Hackathon.findOne({ id: hackathonId });
    if (!hackathon) return false;

    const normalizedAddress = normalizeAddress(walletAddress);
    
    switch (requiredRole) {
      case UserRole.ADMIN:
        return hackathon.roles.admins.map(normalizeAddress).includes(normalizedAddress);
      case UserRole.ORGANIZER:
        return hackathon.roles.organizers.map(normalizeAddress).includes(normalizedAddress) ||
               hackathon.roles.admins.map(normalizeAddress).includes(normalizedAddress);
      case UserRole.JUDGE:
        return hackathon.roles.judges.map(normalizeAddress).includes(normalizedAddress) ||
               hackathon.roles.admins.map(normalizeAddress).includes(normalizedAddress);
      case UserRole.PARTICIPANT:
        return hackathon.roles.participants.map(normalizeAddress).includes(normalizedAddress) ||
               hackathon.roles.judges.map(normalizeAddress).includes(normalizedAddress) ||
               hackathon.roles.organizers.map(normalizeAddress).includes(normalizedAddress) ||
               hackathon.roles.admins.map(normalizeAddress).includes(normalizedAddress);
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking hackathon role:', error);
    return false;
  }
}

/**
 * Get user's role for a specific hackathon
 */
export async function getUserRoleForHackathon(
  walletAddress: string, 
  hackathonId: string
): Promise<UserRole> {
  try {
    const hackathon = await Hackathon.findOne({ id: hackathonId });
    if (!hackathon) return UserRole.PARTICIPANT;

    const normalizedAddress = normalizeAddress(walletAddress);
    
    if (hackathon.roles.admins.map(normalizeAddress).includes(normalizedAddress)) {
      return UserRole.ADMIN;
    }
    if (hackathon.roles.organizers.map(normalizeAddress).includes(normalizedAddress)) {
      return UserRole.ORGANIZER;
    }
    if (hackathon.roles.judges.map(normalizeAddress).includes(normalizedAddress)) {
      return UserRole.JUDGE;
    }
    
    return UserRole.PARTICIPANT;
  } catch (error) {
    console.error('Error getting hackathon role:', error);
    return UserRole.PARTICIPANT;
  }
}

/**
 * Check if user is the creator of a hackathon
 */
export async function isHackathonCreator(
  walletAddress: string, 
  hackathonId: string
): Promise<boolean> {
  try {
    const hackathon = await Hackathon.findOne({ id: hackathonId });
    return hackathon ? normalizeAddress(hackathon.creator) === normalizeAddress(walletAddress) : false;
  } catch (error) {
    console.error('Error checking hackathon creator:', error);
    return false;
  }
}

/**
 * Check if wallet address is valid Ethereum address
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Normalize wallet address to lowercase
 */
export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

/**
 * Add user to hackathon role
 */
export async function addUserToHackathonRole(
  hackathonId: string,
  walletAddress: string,
  role: UserRole,
  adminAddress: string
): Promise<boolean> {
  try {
    // Check if admin has permission to assign roles
    const hasPermission = await hasRoleForHackathon(adminAddress, hackathonId, UserRole.ADMIN) ||
                         await isHackathonCreator(adminAddress, hackathonId);
    
    if (!hasPermission) return false;

    const normalizedAddress = normalizeAddress(walletAddress);
    const roleField = `roles.${role}s`;
    
    await Hackathon.findOneAndUpdate(
      { id: hackathonId },
      { $addToSet: { [roleField]: normalizedAddress } }
    );
    
    return true;
  } catch (error) {
    console.error('Error adding user to hackathon role:', error);
    return false;
  }
}

/**
 * Remove user from hackathon role
 */
export async function removeUserFromHackathonRole(
  hackathonId: string,
  walletAddress: string,
  role: UserRole,
  adminAddress: string
): Promise<boolean> {
  try {
    // Check if admin has permission to remove roles
    const hasPermission = await hasRoleForHackathon(adminAddress, hackathonId, UserRole.ADMIN) ||
                         await isHackathonCreator(adminAddress, hackathonId);
    
    if (!hasPermission) return false;

    const normalizedAddress = normalizeAddress(walletAddress);
    const roleField = `roles.${role}s`;
    
    await Hackathon.findOneAndUpdate(
      { id: hackathonId },
      { $pull: { [roleField]: normalizedAddress } }
    );
    
    return true;
  } catch (error) {
    console.error('Error removing user from hackathon role:', error);
    return false;
  }
}
