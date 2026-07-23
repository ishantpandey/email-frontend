'use client';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import MobileNavigation from '../../component/MobileNavigation';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaGoogle, FaGithub, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../store/slices/authSlice';

// Memoize heavy or frequently re-rendered components
const AnimatedButton = dynamic(() => import('../../component/AnimatedButton'), { ssr: false });
const Notification = dynamic(() => import('../../component/Notification'), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
    // Clear error when user types
    if (error) setError('');
  }, [error]);

  const checkPasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, []);

  const getStrengthColor = useCallback(() => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  }, [passwordStrength]);

  const getStrengthText = useCallback(() => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  }, [passwordStrength]);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Make direct API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Show success notification
      setNotification({
        type: 'success',
        message: data.message || 'Registration successful! Please check your email to verify your account.'
      });
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error messages
      if (error.message.includes('Email already exists') || error.message.includes('already registered')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, validateEmail]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError('');
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: tokenResponse.access_token }),
          }
        );
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Google sign-up failed');
        }
        dispatch(setAuthData({ user: data.user, token: data.token }));
        setNotification({ type: 'success', message: 'Signed up with Google successfully!' });
        setTimeout(() => router.push('/'), 1500);
      } catch (err) {
        setError(err.message || 'Google sign-up failed. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-up failed. Please try again.');
    },
  });

  return (
    <>
      <MobileNavigation />
      <div className="h-[calc(100vh-5rem)] bg-white relative overflow-hidden flex items-center justify-center py-5 px-4 h-full">
        {/* Notification */}
        <Notification 
          notification={notification} 
          onDismiss={dismissNotification}
        />
      
     

      <div className="w-full max-w-md  z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-orange-700 text-sm">
            Join FlowMail and start managing your emails efficiently
          </p>
        </div>

        {/* Registration Form */}
        <div className=" backdrop-blur-xl rounded-xl p-4 border border-gray-200">
            {/* Error Message */}
            {error && (
              <div className="mb-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <FaExclamationCircle className="w-4 h-4 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-orange-800 mb-1 flex items-center gap-1">
                  <FaUser /> Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-10 bg-white/90 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FaUser className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-orange-800 mb-1 flex items-center gap-1">
                  <FaEnvelope /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-10 bg-white/90 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FaEnvelope className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-orange-800 mb-2 flex items-center gap-1">
                  <FaLock /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/90 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FaLock className="w-5 h-5 text-orange-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-orange-600">Password Strength</span>
                      <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`} 
                           style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <AnimatedButton 
                type="submit" 
              
               
                className="w-full  text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"><FaArrowRight /></span>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </AnimatedButton>

              {/* Social Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center text-xs p-1.5">
                  <span className="px-2 bg-orange-300 text-white rounded-full">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={isGoogleLoading || isLoading}
                  className="flex items-center justify-center px-4 py-2 border border-orange-200 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-orange-400 border-t-transparent rounded-full" />
                  ) : (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  )}
                  <span className="text-orange-600 group-hover:text-orange-800">
                    {isGoogleLoading ? 'Connecting...' : 'Google'}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-orange-200 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 group"
                >
                  <FaGithub className="w-5 h-5 mr-2 " />
                  <span className="text-orange-600 group-hover:text-orange-800">GitHub</span>
                </button>
              </div>
            </form>
          </div>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-orange-700">
            Already have an account?{' '}
            <button 
              onClick={() => router.push('/login')}
              className="text-orange-600 hover:text-orange-800 font-medium underline bg-transparent border-none cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}