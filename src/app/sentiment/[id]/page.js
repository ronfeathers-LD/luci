'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../lib/useAuth';

const SentimentDetailPage = dynamic(() => import('../../../components/user/SentimentDetailPage'), { ssr: false });

export default function SentimentDetail() {
  const router = useRouter();
  const params = useParams();
  const analysisId = params?.id;
  const { user, loading, handleSignOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    // Track page view
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.pageView(`/sentiment/${analysisId}`);
    }
  }, [user, loading, router, analysisId]);

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

  if (!analysisId) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center bg-lean-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="typography-heading text-lean-black mb-4">Invalid Analysis</h1>
          <p className="text-lean-black-70 mb-6">Analysis ID is required.</p>
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

  return <SentimentDetailPage user={user} onSignOut={handleSignOut} analysisId={analysisId} />;
}

