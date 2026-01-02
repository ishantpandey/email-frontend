'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const AuthWrapper = ({ children, redirectTo = '/login' }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setIsChecking(false);
      
      if (!loading && !isAuthenticated) {
        const currentPath = window.location.pathname;
        const redirectPath = currentPath === '/' ? redirectTo : `${redirectTo}?redirect=${currentPath.substring(1)}`;
        router.push(redirectPath);
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, loading, router, redirectTo]);

  // Show loading screen while checking authentication
  if (isChecking || loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {loading || isChecking ? 'Loading...' : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;