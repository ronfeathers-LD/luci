/**
 * Navigation Utilities for Next.js
 * 
 * Provides Next.js-compatible navigation helpers
 * Replaces window.navigate() usage
 */

import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook for navigation (replaces window.navigate)
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navigate = (path) => {
    router.push(path);
  };
  
  return {
    navigate,
    currentPath: pathname,
  };
}

/**
 * Get current pathname (for use outside components)
 */
export function getCurrentPath() {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
}

