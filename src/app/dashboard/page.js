'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../lib/useAuth';

const Dashboard = dynamic(() => import('../../components/Dashboard'), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, handleSignOut } = useAuth();

  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.pageView('/dashboard');
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-lean-almost-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lean-green"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <Dashboard user={user} onSignOut={handleSignOut} />;
}

