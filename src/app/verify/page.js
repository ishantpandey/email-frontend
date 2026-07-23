'use client';
import { Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../store/slices/authSlice';
import dynamic from 'next/dynamic';

const AnimatedButton = dynamic(() => import('../../component/AnimatedButton'), { ssr: false });
const Notification = dynamic(() => import('../../component/Notification'), { ssr: false });
const Logo = dynamic(() => import('../../component/Logo'), { ssr: false });
import MobileNavigation from '../../component/MobileNavigation';
import { FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

// Main component that uses useSearchParams
function VerifyContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [notification, setNotification] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token) {
      setVerificationStatus('error');
      setNotification({
        type: 'error',
        message: 'Invalid verification link. No token found.'
      });
      setIsLoading(false);
      return;
    }

    verifyEmail(token, email);
  }, [searchParams]);

  useEffect(() => {
    // Start countdown timer when verification is successful
    if (verificationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationStatus === 'success' && countdown === 0) {
      // Redirect to home page when countdown reaches 0
      router.push('/');
    }
  }, [verificationStatus, countdown, router]);

  const verifyEmail = async (token, email) => {
    try {
      setIsLoading(true);
      
      // Create query parameters for the API request
      const queryParams = new URLSearchParams();
      queryParams.append('token', token);
      queryParams.append('email', email);
      
      // Make API call to backend verify endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Backend returns { success: true/false, message: "...", user?: {...}, token?: "..." }
      if (data.success) {
        setVerificationStatus('success');
        setNotification({
          type: 'success',
          message: data.message || 'Your email has been successfully verified!'
        });

        // Dispatch setAuthData to update Redux store using common reducer
        if (data.user || data.token) {
          dispatch(setAuthData({
            user: data.user,
            token: data.token
          }));
        }
      } else {
        setVerificationStatus('error');
        setNotification({
          type: 'error',
          message: data.message || 'Email verification failed. The link may be invalid or expired.'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setNotification({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <>
      <MobileNavigation />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Notification */}
        <Notification 
          notification={notification} 
          onDismiss={dismissNotification}
        />

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo />
            </div>

            {/* Verification Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center">
                {isLoading ? (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                      <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      Verifying Your Email
                    </h1>
                    <p className="text-gray-600">
                      Please wait while we verify your email address...
                    </p>
                  </>
                ) : verificationStatus === 'success' ? (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                      <FaCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      Email Verified Successfully!
                    </h1>
                    <p className="text-gray-600 mb-6">
                      Congratulations! Your email has been verified. You can now access all features of your account.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        You will be automatically redirected to the home page in{' '}
                        <span className="font-semibold">{countdown}</span> seconds.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <AnimatedButton 
                        onClick={handleReturnHome}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Go to Home
                      </AnimatedButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                      <FaTimes className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">
                      We couldn't verify your email address. The verification link may be invalid, expired, or already used.
                    </p>
                    <div className="space-y-3">
                      <AnimatedButton 
                        onClick={handleGoToLogin}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Go to Login
                      </AnimatedButton>
                      <AnimatedButton 
                        onClick={handleReturnHome}
                        variant="outline"
                        className="w-full border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Return to Home
                      </AnimatedButton>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Need help?{' '}
                <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Export wrapped with Suspense
export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}