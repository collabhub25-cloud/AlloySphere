'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

interface RoleSignupPageProps {
    role: 'founder' | 'investor' | 'talent';
    accent: string;
    accentBg: string;
    title: string;
    subtitle: string;
}

export function RoleSignupPage({ role, accent, accentBg, title, subtitle }: RoleSignupPageProps) {
    const router = useRouter();
    const { login } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user);
                toast.success('Welcome to CollabHub!');
                router.push(`/dashboard/${role}`);
            } else {
                if (data.fields && Object.keys(data.fields).length > 0) {
                    toast.error(Object.values(data.fields)[0] as string);
                } else {
                    toast.error(data.error || 'Registration failed');
                }
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className={`h-5 w-5 ${accent}`} />
                        <span className="text-lg font-semibold">CollabHub</span>
                    </Link>
                    <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                        Already have an account?
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <Link href={`/${role === 'founder' ? 'founders' : role === 'investor' ? 'investors' : 'talent'}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>

                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <div className={`inline-flex items-center gap-2 text-sm font-medium ${accent} ${accentBg} px-3 py-1 rounded-full mb-4`}>
                            {title}
                        </div>
                        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
                        <p className="text-sm text-gray-500 mb-8">{subtitle}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2.5 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-50 ${role === 'founder' ? 'bg-blue-600 hover:bg-blue-700' :
                                        role === 'investor' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                            'bg-violet-600 hover:bg-violet-700'
                                    }`}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className={`font-medium ${accent} hover:underline`}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
