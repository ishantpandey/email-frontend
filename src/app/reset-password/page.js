'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
const AnimatedButton = dynamic(() => import('../../component/AnimatedButton'), { ssr: false });
const Notification = dynamic(() => import('../../component/Notification'), { ssr: false });
const Logo = dynamic(() => import('../../component/Logo'), { ssr: false });
import MobileNavigation from '../../component/MobileNavigation';
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaArrowLeft, FaSpinner } from 'react-icons/fa';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [resetData, setResetData] = useState({
    token: '',
    email: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token) {
      setNotification({
        type: 'error',
        message: 'Invalid reset link. No token found.'
      });
      return;
    }

    setResetData({
      token: token,
      email: email || ''
    });
  }, [searchParams]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
    // Clear notification when user types
    if (notification) setNotification(null);
  }, [notification]);

  const checkPasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, []);

  const getStrengthColor = useCallback(() => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-orange-500';
    return 'bg-green-500';
  }, [passwordStrength]);

  const getStrengthText = useCallback(() => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  }, [passwordStrength]);

  const validateForm = () => {
    if (!formData.password.trim()) {
      setNotification({
        type: 'error',
        message: 'Please enter your new password'
      });
      return false;
    }

    if (formData.password.length < 6) {
      setNotification({
        type: 'error',
        message: 'Password must be at least 6 characters long'
      });
      return false;
    }

    if (!formData.confirmPassword.trim()) {
      setNotification({
        type: 'error',
        message: 'Please confirm your password'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setNotification({
        type: 'error',
        message: 'Passwords do not match'
      });
      return false;
    }

    if (passwordStrength < 3) {
      setNotification({
        type: 'error',
        message: 'Please choose a stronger password'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resetData.token) {
      setNotification({
        type: 'error',
        message: 'Invalid reset token. Please request a new password reset.'
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetData.token,
          email: resetData.email,
          newPassword: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          message: data.message || 'Password reset successful! You can now login with your new password.'
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to reset password. The link may be invalid or expired.'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setNotification({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

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

          {/* Reset Password Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Reset Your Password
              </h1>
              <p className="text-gray-600">
                Enter your new password below. Make sure it's strong and secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your new password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength <= 2 ? 'text-red-600' : 
                        passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Password should contain:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li className={formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                          At least 6 characters
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                          Lowercase letter
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                          Uppercase letter
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                          Number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                          Special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your new password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 text-sm">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-green-600 flex items-center">
                        <FaCheck className="h-4 w-4 mr-1" />
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-red-600 flex items-center">
                        <FaTimes className="h-4 w-4 mr-1" />
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <AnimatedButton 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Resetting Password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </AnimatedButton>
              </div>
            </form>

            {/* Footer Links */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <FaArrowLeft /> Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}