'use client';

import Link from 'next/link';
import { Shield, TrendingUp, BarChart3, FileCheck, Eye, ArrowRight, Zap } from 'lucide-react';

const features = [
    {
        icon: TrendingUp,
        title: 'Verified Deal Flow',
        description: 'Every startup on CollabHub is verified. Trust scores, KYC status, and team composition are transparent.',
    },
    {
        icon: Shield,
        title: 'Accreditation Gating',
        description: 'Only Level 3 verified investors can invest. Protects the ecosystem and ensures serious participation.',
    },
    {
        icon: BarChart3,
        title: 'Risk Transparency',
        description: 'Trust scores, agreement history, dispute records — all visible before you commit capital.',
    },
    {
        icon: Eye,
        title: 'Due Diligence Tools',
        description: 'Request access to financial documents, team profiles, and milestone history before investing.',
    },
];

export default function InvestorLanding() {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Nav */}
            <header className="border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        <span className="text-lg font-semibold text-white">CollabHub</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm text-gray-400 hover:text-white">Sign In</Link>
                        <Link href="/signup/investor" className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-500 transition-colors">
                            Explore Startups
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-4 py-1.5 rounded-full mb-6">
                        <Zap className="h-3.5 w-3.5" />
                        For Investors
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-white">
                        Discover Verified
                        <br />Deal Flow
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Invest in trust-verified startups with transparent risk metrics, accreditation controls, and full due diligence visibility.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/signup/investor" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-medium px-6 py-3 rounded-md hover:bg-emerald-500 transition-colors">
                            Explore Verified Startups <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/login" className="text-sm text-gray-400 font-medium hover:text-white">
                            Already have an account?
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12 text-white">Why Investors Choose CollabHub</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
                                <f.icon className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1 text-white">{f.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-6 border-t border-gray-800">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-emerald-400">100%</div>
                        <p className="text-sm text-gray-500 mt-1">KYC Verified Startups</p>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-emerald-400">L3+</div>
                        <p className="text-sm text-gray-500 mt-1">Investor Accreditation</p>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-emerald-400">0</div>
                        <p className="text-sm text-gray-500 mt-1">Hidden Risk Factors</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-emerald-600">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 text-white">Start your due diligence.</h2>
                    <p className="text-emerald-100 mb-8">Join investors who trust CollabHub for verified deal flow.</p>
                    <Link href="/signup/investor" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-medium px-8 py-3 rounded-md hover:bg-emerald-50 transition-colors">
                        Create Investor Account <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} CollabHub. All rights reserved.
            </footer>
        </div>
    );
}
