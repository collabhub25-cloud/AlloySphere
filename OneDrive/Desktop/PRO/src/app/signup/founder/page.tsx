import { RoleSignupPage } from '@/components/auth/role-signup-page';

export default function FounderSignup() {
    return (
        <RoleSignupPage
            role="founder"
            accent="text-blue-600"
            accentBg="bg-blue-50"
            title="Founder"
            subtitle="Create your founder account to start building with verified talent."
        />
    );
}
