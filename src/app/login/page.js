'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../lib/useAuth';

const LoginPage = dynamic(() => import('../../components/auth/LoginPage'), { ssr: false });

export default function Login() {
  const router = useRouter();
  const { user, loading, handleSignIn } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      router.push('/');
    }
    
    // Track page view
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.pageView('/login');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-lean-almost-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lean-green"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return <LoginPage onSignIn={handleSignIn} />;
}

