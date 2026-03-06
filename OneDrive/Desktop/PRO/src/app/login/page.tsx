'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const roles = [
    { id: 'founder' as const, label: 'Founder', desc: 'Launch & grow' },
    { id: 'investor' as const, label: 'Investor', desc: 'Fund startups' },
    { id: 'talent' as const, label: 'Talent', desc: 'Join a team' },
];

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [selectedRole, setSelectedRole] = useState<'founder' | 'investor' | 'talent'>('founder');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const userRole = data.user?.role;
                if (userRole && userRole !== selectedRole) {
                    toast.error(`This account is registered as ${userRole}. Please select the correct role.`);
                    setIsLoading(false);
                    return;
                }
                login(data.user);
                router.push(`/dashboard/${userRole || selectedRole}`);
            } else {
                toast.error(data.error || 'Invalid credentials');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col page-enter bg-transparent text-foreground">
            <header className="border-b border-border">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <Link href="/" className="text-base font-medium tracking-wide">Collab·Hub</Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-sm">
                    <h2 className="mb-1">Sign in</h2>
                    <p className="text-sm mb-8 text-muted-foreground">Select your role, then enter your credentials.</p>

                    <div className="flex gap-1 mb-8 p-1.5 rounded-xl bg-accent">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRole(role.id)}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${selectedRole === role.id
                                    ? 'bg-background text-foreground shadow-sm scale-[1.02]'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <span className="block">{role.label}</span>
                                <span className="block text-[10px] mt-0.5 opacity-60">{role.desc}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background border border-border"
                                placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full px-3.5 py-2.5 rounded-lg text-sm pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background border border-border" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-foreground text-muted-foreground">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <Link href="/forgot-password" className="text-xs hover:underline text-muted-foreground">Forgot password?</Link>
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading}
                            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 group bg-primary text-primary-foreground">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-6 text-muted-foreground">
                        No account?{' '}
                        <Link href={`/signup/${selectedRole}`} className="font-medium hover:underline text-foreground">Create one</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
