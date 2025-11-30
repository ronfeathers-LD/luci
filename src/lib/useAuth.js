/**
 * Authentication Hook for Next.js
 * 
 * Manages user authentication state using localStorage
 * Compatible with existing authentication flow
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Refresh user roles if user exists but roles are missing
        if (userData && userData.id && (!userData.roles || userData.roles.length === 0)) {
          fetch(`/api/users?id=${userData.id}`)
            .then(res => res.json())
            .then(data => {
              if (data.roles) {
                const updatedUser = { ...userData, roles: data.roles };
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                setUser(updatedUser);
              }
            })
            .catch(err => console.error('Error refreshing user roles:', err));
        }
      } catch (error) {
        console.error('Error parsing saved user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Refresh user roles on mount if user exists
  useEffect(() => {
    const refreshUserRoles = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`/api/users?id=${user.id}`);
          if (response.ok) {
            const userData = await response.json();
            if (userData.roles) {
              const updatedUser = { ...user, roles: userData.roles };
              localStorage.setItem('userInfo', JSON.stringify(updatedUser));
              setUser(updatedUser);
            }
          }
        } catch (error) {
          console.error('Error refreshing user roles:', error);
        }
      }
    };

    if (user && user.id) {
      refreshUserRoles();
    }
  }, []); // Only run once on mount

  const handleSignIn = async (userInfo) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        
        // Track analytics
        if (typeof window !== 'undefined' && window.analytics) {
          window.analytics.track('user_signed_in', { email: userData.email, userId: userData.id });
        }
      } else {
        // Fallback to saving Google user info if API fails
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
        
        if (typeof window !== 'undefined' && window.analytics) {
          window.analytics.track('user_signed_in', { email: userInfo.email });
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Fallback to saving Google user info if API fails
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
      
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('user_signed_in', { email: userInfo.email });
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    
    // Disable Google Sign-In auto-select
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    // Track analytics
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('user_signed_out');
    }
    
    // Use window.location for a full page reload to clear all state
    window.location.href = '/';
  };

  const hasAdminRole = (userToCheck = user) => {
    if (!userToCheck || !userToCheck.roles) return false;
    return userToCheck.roles.some(role => role.name && role.name.toLowerCase() === 'admin');
  };

  return {
    user,
    loading,
    handleSignIn,
    handleSignOut,
    hasAdminRole,
  };
}

