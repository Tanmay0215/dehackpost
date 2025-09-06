"use client";
import { useAuth } from '@/lib/auth/useAuth';
import { UserRole } from '@/lib/auth/types';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface HackathonProtectedRouteProps {
  children: React.ReactNode;
  hackathonId: string;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access this page</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// For hackathon-specific role protection
export function HackathonProtectedRoute({ 
  children, 
  hackathonId, 
  requiredRole, 
  fallback 
}: HackathonProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRoleForHackathon } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated && hackathonId) {
      checkPermission();
    }
  }, [isAuthenticated, hackathonId, requiredRole]);

  const checkPermission = async () => {
    try {
      const result = await hasRoleForHackathon(hackathonId, requiredRole);
      setHasPermission(result);
    } catch (error) {
      console.error('Error checking permission:', error);
      setHasPermission(false);
    }
  };

  if (isLoading || hasPermission === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access this page</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">
            You need {requiredRole} role for this hackathon to access this page
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
