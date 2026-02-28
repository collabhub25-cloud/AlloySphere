'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const roles = [
    { id: 'founder' as const, label: 'Founder', color: 'bg-blue-600', hover: 'hover:bg-blue-50 hover:text-blue-600', ring: 'ring-blue-600' },
    { id: 'investor' as const, label: 'Investor', color: 'bg-emerald-600', hover: 'hover:bg-emerald-50 hover:text-emerald-600', ring: 'ring-emerald-600' },
    { id: 'talent' as const, label: 'Talent', color: 'bg-violet-600', hover: 'hover:bg-violet-50 hover:text-violet-600', ring: 'ring-violet-600' },
];

export default function LoginPage() {
    const router = useRouter();
    const { login, fetchUser } = useAuthStore();
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
                // Verify role matches
                const userRole = data.user?.role;
                if (userRole && userRole !== selectedRole) {
                    toast.error(`This account is registered as ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}. Please select the correct role.`);
                    setIsLoading(false);
                    return;
                }

                login(data.user);
                toast.success('Welcome back!');
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

    const currentRole = roles.find(r => r.id === selectedRole)!;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">CollabHub</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
                        <p className="text-sm text-gray-500 mb-6">Select your role and enter your credentials.</p>

                        {/* Role Selector */}
                        <div className="grid grid-cols-3 gap-2 mb-8">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`py-2.5 px-3 rounded-md text-sm font-medium transition-all border ${selectedRole === role.id
                                            ? `${role.color} text-white border-transparent`
                                            : `border-gray-200 text-gray-500 ${role.hover}`
                                        }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-1.5">
                                    <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600">Forgot password?</Link>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2.5 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-50 ${currentRole.color}`}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : `Sign in as ${currentRole.label}`}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Don&apos;t have an account?{' '}
                            <Link href={`/signup/${selectedRole}`} className="font-medium text-primary hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
