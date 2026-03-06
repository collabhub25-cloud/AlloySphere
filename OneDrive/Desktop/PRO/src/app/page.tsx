'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { ThreeParticleField } from '@/components/ui/three-particle-field';
import { InteractiveGlobe } from '@/components/ui/interactive-globe';

export default function Home() {
  const { isAuthenticated, user, isLoading, fetchUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try { await fetchUser(); } catch { /* not authenticated */ }
      setLoading(false);
    };
    check();
  }, [fetchUser, setLoading]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-transparent text-foreground">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-base font-medium tracking-wide">Collab·Hub</span>
            <Link href="/login" className="text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center px-6 relative overflow-hidden">
          {/* ——— Three.js 3D Background Effects ——— */}
          <ThreeParticleField />

          <div className="max-w-6xl mx-auto w-full relative" style={{ paddingTop: '64px', paddingBottom: '64px', zIndex: 10 }}>
            {/* Hero split: Text left, Globe right */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4 mb-16">
              {/* Left — Text content */}
              <div className="flex-1">
                <h1 className="mb-4 text-4xl font-bold tracking-tight">Verified startup<br />collaboration.</h1>
                <p className="max-w-md mb-8 text-muted-foreground text-base leading-relaxed">
                  A platform for founders, investors, and talent to work together through trust scores, legal agreements, and milestone payments.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xl font-semibold text-foreground">500+</p>
                    <p className="text-muted-foreground">Verified Users</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-xl font-semibold text-foreground">50+</p>
                    <p className="text-muted-foreground">Startups</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-xl font-semibold text-foreground">Global</p>
                    <p className="text-muted-foreground">Network</p>
                  </div>
                </div>
              </div>

              {/* Right — Interactive Globe */}
              <div className="hidden lg:flex items-center justify-center flex-shrink-0">
                <InteractiveGlobe
                  size={420}
                  dotColor="rgba(196, 169, 125, ALPHA)"
                  arcColor="rgba(196, 169, 125, 0.35)"
                  markerColor="rgba(139, 111, 71, 1)"
                  autoRotateSpeed={0.0015}
                />
              </div>
            </div>

            {/* Role cards */}
            <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
              <Link href="/founders" className="group p-8 transition-colors bg-card hover:bg-accent">
                <p className="text-sm mb-1 text-muted-foreground">Founders</p>
                <p className="font-medium mb-5 group-hover:text-primary transition-colors text-card-foreground">Build with verified talent</p>
                <span className="text-sm text-primary">Learn more →</span>
              </Link>
              <Link href="/investors" className="group p-8 transition-colors bg-card hover:bg-accent">
                <p className="text-sm mb-1 text-muted-foreground">Investors</p>
                <p className="font-medium mb-5 group-hover:text-primary transition-colors text-card-foreground">Verified deal flow</p>
                <span className="text-sm text-[#4A6A8A]">Learn more →</span>
              </Link>
              <Link href="/talent" className="group p-8 transition-colors bg-card hover:bg-accent">
                <p className="text-sm mb-1 text-muted-foreground">Talent</p>
                <p className="font-medium mb-5 group-hover:text-primary transition-colors text-card-foreground">Join trusted projects</p>
                <span className="text-sm text-[#A889AE]">Learn more →</span>
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-border py-5 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CollabHub
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
