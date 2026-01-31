'use client';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import MobileNavigation from '../../component/MobileNavigation';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaGoogle, FaGithub, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

// Memoize heavy or frequently re-rendered components
const AnimatedButton = dynamic(() => import('../../component/AnimatedButton'), { ssr: false });
const Notification = dynamic(() => import('../../component/Notification'), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT}`, {
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

  return (
    <>
      <MobileNavigation />
      <div className="h-[calc(100vh-4rem)] bg-white relative overflow-hidden flex items-center justify-center px-4">
        {/* Notification */}
        <Notification 
          notification={notification} 
          onDismiss={dismissNotification}
        />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-md py-6 z-10">
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
        <div className="bg-orange-50/80 backdrop-blur-xl rounded-3xl p-4 border border-orange-100 shadow-xl">
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
                variant="primary" 
                size="lg" 
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
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
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-orange-50 text-orange-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-orange-200 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 group"
                >
                  <FaGoogle className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="text-orange-600 group-hover:text-orange-800">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-orange-200 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 group"
                >
                  <FaGithub className="w-5 h-5 mr-2 text-orange-500" />
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