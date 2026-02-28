'use client';

import { use } from 'react';
import { ProfilePage } from '@/components/profile/profile-page';

export default function UserProfilePage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = use(params);

    return <ProfilePage profileId={userId} />;
}
