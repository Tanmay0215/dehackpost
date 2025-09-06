import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Globe, Users, Trophy, Code } from "lucide-react";
import { AuthAwareCTA, AuthAwareFooterCTA } from "@/app/_components/auth-aware-cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Decentralized
            <span className="text-blue-600"> Hackathons</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Build, compete, and innovate on a fully decentralized platform. Host
            hackathons, submit projects, and judge submissions - all stored on
            IPFS.
          </p>
          <AuthAwareCTA />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose DeHackPost?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the future of hackathon management
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Fully Decentralized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All data stored on IPFS. No central authority, no single point
                  of failure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Global Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Participate from anywhere in the world. Truly borderless
                  hackathons.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built by developers, for developers. Open source and
                  transparent.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Easy Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Submit projects with just a few clicks. Automatic IPFS
                  storage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Fair Judging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transparent judging process with immutable feedback on IPFS.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built with modern web technologies for optimal performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <AuthAwareFooterCTA />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              DeHackPost
            </h3>
            <p className="text-gray-400 text-sm">
              Decentralized hackathon platform built on IPFS
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <Link
                href="/discover"
                className="text-gray-400 hover:text-white text-sm"
              >
                Discover
              </Link>
              <Link
                href="/create"
                className="text-gray-400 hover:text-white text-sm"
              >
                Create
              </Link>
              <Link
                href="/projects"
                className="text-gray-400 hover:text-white text-sm"
              >
                Projects
              </Link>
              <Link
                href="/judge"
                className="text-gray-400 hover:text-white text-sm"
              >
                Judge
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
