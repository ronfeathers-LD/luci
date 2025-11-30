'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../lib/useAuth';

const AdminPage = dynamic(() => import('../../components/admin/AdminPage'), { ssr: false });

export default function Admin() {
  const router = useRouter();
  const { user, loading, handleSignOut, hasAdminRole } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (!hasAdminRole()) {
        router.push('/');
        return;
      }
    }
    
    // Track page view
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.pageView('/admin');
    }
  }, [user, loading, hasAdminRole, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-lean-almost-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lean-green"></div>
      </div>
    );
  }

  if (!user || !hasAdminRole()) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center bg-lean-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="typography-heading text-lean-black mb-4">Access Denied</h1>
          <p className="text-lean-black-70 mb-6">
            You need administrator privileges to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <AdminPage user={user} onSignOut={handleSignOut} />;
}

