'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../lib/useAuth';

// Dynamically import components to avoid SSR issues
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { user, loading, handleSignIn, handleSignOut } = useAuth();

  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.pageView('/');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-lean-almost-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lean-green"></div>
      </div>
    );
  }

  if (!user) {
    const LoginPage = dynamic(() => import('../components/auth/LoginPage'), { ssr: false });
    return <LoginPage onSignIn={handleSignIn} />;
  }

  return <Dashboard user={user} onSignOut={handleSignOut} />;
}

