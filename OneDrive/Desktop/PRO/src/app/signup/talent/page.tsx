import { RoleSignupPage } from '@/components/auth/role-signup-page';

export default function TalentSignup() {
    return (
        <RoleSignupPage
            role="talent"
            accent="text-violet-600"
            accentBg="bg-violet-50"
            title="Talent"
            subtitle="Create your talent account to join high-trust projects."
        />
    );
}
