"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useAuth } from "@/lib/auth/useAuth";
import { useEffect, useState } from "react";

export function AuthAwareCTA() {
  const { isConnected } = useAccount();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (isConnected && isAuthenticated) {
    // User is connected and has a profile
    return (
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link href="/dashboard">
          <Button size="lg" className="px-8 py-3">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/discover">
          <Button variant="outline" size="lg" className="px-8 py-3">
            Discover Hackathons
          </Button>
        </Link>
      </div>
    );
  }

  if (isConnected && !isAuthenticated) {
    // User is connected but needs to set up profile
    return (
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link href="/register">
          <Button size="lg" className="px-8 py-3">
            Complete Profile Setup
          </Button>
        </Link>
        <Link href="/discover">
          <Button variant="outline" size="lg" className="px-8 py-3">
            Browse Hackathons
          </Button>
        </Link>
      </div>
    );
  }

  // User needs to connect wallet
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <div className="flex flex-col items-center gap-4">
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button 
              size="lg" 
              className="px-8 py-3 flex items-center gap-2"
              onClick={openConnectModal}
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet to Start
            </Button>
          )}
        </ConnectButton.Custom>
        <p className="text-sm text-gray-500">
          Connect your wallet to participate in hackathons
        </p>
      </div>
      <Link href="/discover">
        <Button variant="outline" size="lg" className="px-8 py-3">
          Browse Hackathons
        </Button>
      </Link>
    </div>
  );
}

export function AuthAwareFooterCTA() {
  const { isConnected } = useAccount();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <div className="h-12 w-32 bg-white/20 animate-pulse rounded"></div>
        <div className="h-12 w-32 bg-white/20 animate-pulse rounded"></div>
      </div>
    );
  }

  if (isConnected && isAuthenticated) {
    return (
      <>
        <p className="mt-4 text-lg text-blue-100">
          Welcome back! Continue your hackathon journey
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="text-blue-600 border-white hover:bg-white">
              View Dashboard
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline" className="text-blue-600 border-white hover:bg-white">
              View Projects
            </Button>
          </Link>
        </div>
      </>
    );
  }

  if (isConnected && !isAuthenticated) {
    return (
      <>
        <p className="mt-4 text-lg text-blue-100">
          Complete your profile to start participating
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-blue-600 border-white hover:bg-white">
              Setup Profile
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline" className="text-blue-600 border-white hover:bg-white">
              View Projects
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="mt-4 text-lg text-blue-100">
        Join the decentralized hackathon revolution today
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button 
              size="lg" 
              variant="outline" 
              className="text-blue-600 border-white hover:bg-white flex items-center gap-2"
              onClick={openConnectModal}
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          )}
        </ConnectButton.Custom>
        <Link href="/projects">
          <Button size="lg" variant="outline" className="text-blue-600 border-white hover:bg-white">
            View Projects
          </Button>
        </Link>
      </div>
    </>
  );
}
