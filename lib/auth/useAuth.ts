"use client";
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { UserProfile, AuthContextualState, UserRole } from './types';
import { normalizeAddress, getUserRoleForHackathon, hasRoleForHackathon } from './utils';

export function useAuth(): AuthContextualState & {
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  refetchUser: () => Promise<void>;
} {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address && isConnected) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [address, isConnected]);

  const fetchUserProfile = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'x-wallet-address': normalizeAddress(address)
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!address) throw new Error('No wallet connected');
    
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': normalizeAddress(address)
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
    return updatedUser;
  };

  const getRoleForHackathon = async (hackathonId: string): Promise<UserRole> => {
    if (!address) return UserRole.PARTICIPANT;
    return await getUserRoleForHackathon(address, hackathonId);
  };

  const hasRoleForHackathonCheck = async (hackathonId: string, role: UserRole): Promise<boolean> => {
    if (!address) return false;
    return await hasRoleForHackathon(address, hackathonId, role);
  };

  return {
    user,
    isAuthenticated: isConnected && !!address && !!user,
    isLoading,
    updateProfile,
    refetchUser: fetchUserProfile,
    getRoleForHackathon,
    hasRoleForHackathon: hasRoleForHackathonCheck
  };
}
