'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLoginForm } from '../components/AdminLoginForm';

export default function HomePage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If a user session exists, redirect them to the dashboard.
    if (user) {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  // If there's no user, the page will render the login form.
  // The component returns null while checking to avoid a flash of the login form.
  if (user) {
    return null; // Or a loading spinner
  }

  return <AdminLoginForm />;
}
