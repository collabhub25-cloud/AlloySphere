'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Building2, TrendingUp, Code2, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user, isLoading, fetchUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch {
        // Not authenticated
      }
      setLoading(false);
    };
    checkAuth();
  }, [fetchUser, setLoading]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  const roles = [
    {
      id: 'founder',
      title: 'Founder',
      subtitle: 'Build your startup with verified talent',
      icon: Building2,
      color: 'text-blue-600',
      bg: 'hover:border-blue-600/40',
      href: '/founders',
    },
    {
      id: 'investor',
      title: 'Investor',
      subtitle: 'Discover verified deal flow',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'hover:border-emerald-600/40',
      href: '/investors',
    },
    {
      id: 'talent',
      title: 'Talent',
      subtitle: 'Join high-trust projects',
      icon: Code2,
      color: 'text-violet-600',
      bg: 'hover:border-violet-600/40',
      href: '/talent',
    },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold tracking-tight">CollabHub</span>
            </div>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="text-center max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5" />
              Trust-verified startup ecosystem
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Three powerful ecosystems.
              <br />
              <span className="text-muted-foreground">Connected by trust.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose your role to explore how CollabHub empowers founders, investors,
              and talent to collaborate with confidence.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid gap-6 md:grid-cols-3 w-full max-w-4xl">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className={`group block p-8 rounded-lg border border-border bg-card transition-all duration-200 ${role.bg}`}
              >
                <role.icon className={`h-10 w-10 ${role.color} mb-4`} />
                <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{role.subtitle}</p>
                <div className={`flex items-center gap-1 text-sm font-medium ${role.color}`}>
                  Learn more
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CollabHub. All rights reserved.
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
