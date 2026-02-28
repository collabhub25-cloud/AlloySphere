'use client';

import Link from 'next/link';
import { Shield, Code2, DollarSign, Award, FileCheck, ArrowRight, Zap } from 'lucide-react';

const features = [
    {
        icon: Code2,
        title: 'Skill Validation',
        description: 'Complete skill assessments and get verified badges that founders trust.',
    },
    {
        icon: DollarSign,
        title: 'Milestone Payments',
        description: 'Get paid per milestone. No chasing invoices — payments tracked and verified on-platform.',
    },
    {
        icon: Award,
        title: 'Trust Score Growth',
        description: 'Build your professional trust score with every project, verification, and signed agreement.',
    },
    {
        icon: FileCheck,
        title: 'Legal Protection',
        description: 'Every engagement starts with a signed agreement. Dispute resolution built in.',
    },
];

export default function TalentLanding() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Nav */}
            <header className="border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-violet-600" />
                        <span className="text-lg font-semibold">CollabHub</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Sign In</Link>
                        <Link href="/signup/talent" className="text-sm font-medium bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition-colors">
                            Join Now
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-violet-600 text-sm font-medium bg-violet-50 px-4 py-1.5 rounded-full mb-6">
                        <Zap className="h-3.5 w-3.5" />
                        For Talent
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                        Join High-Trust
                        <br />Projects
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Work with verified founders, get paid per milestone, and build an unshakeable professional reputation through trust scores and verified credentials.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/signup/talent" className="inline-flex items-center gap-2 bg-violet-600 text-white font-medium px-6 py-3 rounded-md hover:bg-violet-700 transition-colors">
                            Join High-Trust Projects <ArrowRight className="h-4 w-4" />
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
                    <h2 className="text-2xl font-bold text-center mb-12">Why Talent Chooses CollabHub</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-white rounded-lg border border-gray-200">
                                <f.icon className="h-6 w-6 text-violet-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">{f.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust progression */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-12">Grow Your Trust Level</h2>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier, i) => {
                            const colors = ['bg-orange-100 text-orange-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-purple-100 text-purple-700'];
                            return (
                                <div key={tier} className={`px-4 py-2 rounded-full text-sm font-semibold ${colors[i]}`}>
                                    {tier}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-sm text-gray-500 mt-6 max-w-lg mx-auto">
                        Complete verifications, deliver milestones, and maintain agreements to climb trust tiers and unlock premium opportunities.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-violet-600 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Your skills deserve trust.</h2>
                    <p className="text-violet-100 mb-8">Join CollabHub and start building your verified professional profile.</p>
                    <Link href="/signup/talent" className="inline-flex items-center gap-2 bg-white text-violet-700 font-medium px-8 py-3 rounded-md hover:bg-violet-50 transition-colors">
                        Create Talent Account <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} CollabHub. All rights reserved.
            </footer>
        </div>
    );
}
