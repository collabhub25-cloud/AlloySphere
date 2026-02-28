'use client';

import Link from 'next/link';
import { Shield, Users, FileCheck, DollarSign, Target, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: 'Verified Talent Pool',
        description: 'Every talent on CollabHub passes identity and skill verification before they can apply.',
    },
    {
        icon: FileCheck,
        title: 'Legal Agreement Engine',
        description: 'Auto-generate NDAs, contracts, and agreements. Digital signing with audit trails.',
    },
    {
        icon: DollarSign,
        title: 'Milestone-Based Payments',
        description: 'Track deliverables and release payments per milestone. Full receipt tracking.',
    },
    {
        icon: Shield,
        title: 'Trust Score System',
        description: 'Every user earns trust through verification, completed work, and collaboration history.',
    },
];

const steps = [
    'Create your startup profile',
    'Post roles and requirements',
    'Review verified applicants',
    'Sign agreements digitally',
    'Track milestones and pay securely',
];

export default function FounderLanding() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Nav */}
            <header className="border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-lg font-semibold">CollabHub</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Sign In</Link>
                        <Link href="/signup/founder" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Start Building
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium bg-blue-50 px-4 py-1.5 rounded-full mb-6">
                        <Zap className="h-3.5 w-3.5" />
                        For Founders
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                        Build Your Startup
                        <br />With Verified Talent
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Hire verified professionals, manage milestones, sign agreements, and track payments—all on a trust-verified platform built for serious founders.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/signup/founder" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                            Start Building <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/login" className="text-sm text-gray-500 font-medium hover:text-gray-900">
                            Already have an account?
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Why Founders Choose CollabHub</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-white rounded-lg border border-gray-200">
                                <f.icon className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">{f.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
                    <div className="space-y-4">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold shrink-0">
                                    {i + 1}
                                </div>
                                <span className="text-sm font-medium">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-gray-900 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
                    <p className="text-gray-400 mb-8">Join hundreds of founders using CollabHub to hire, manage, and scale.</p>
                    <Link href="/signup/founder" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-8 py-3 rounded-md hover:bg-blue-500 transition-colors">
                        Create Founder Account <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} CollabHub. All rights reserved.
            </footer>
        </div>
    );
}
