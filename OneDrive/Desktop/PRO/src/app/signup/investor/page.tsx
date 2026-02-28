import { RoleSignupPage } from '@/components/auth/role-signup-page';

export default function InvestorSignup() {
    return (
        <RoleSignupPage
            role="investor"
            accent="text-emerald-600"
            accentBg="bg-emerald-50"
            title="Investor"
            subtitle="Create your investor account to discover verified deal flow."
        />
    );
}
