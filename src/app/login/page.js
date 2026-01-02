"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAuthData, setAuthError } from "../../store/slices/authSlice";
import AnimatedButton from "../../component/AnimatedButton";
import Notification from "../../component/Notification";
import ForgotPasswordModal from "../../component/ForgotPasswordModal";
import MobileNavigation from "../../component/MobileNavigation";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { isLoading, error: authError, isAuthenticated } = useSelector((state) => state.auth);
  
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect');
      const destination = redirectTo ? `/${redirectTo}` : '/';
      router.push(destination);
    }
  }, [isAuthenticated, router, searchParams]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (error) setError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter your password");
      return;
    }

    dispatch(setLoading(true));
    setError("");

    try {
      // Make direct API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // Handle backend response format with success field
      if (!data.success) {
        // Check for specific email verification error
        if (data.message && data.message.includes("verify")) {
          const errorMsg = "⚠️ Please verify your email before logging in. Check your inbox for the verification link.";
          setError(errorMsg);
          dispatch(setAuthError(errorMsg));
          return; // Stop execution here, don't redirect
        } else {
          throw new Error(data.message || "Login failed");
        }
      }

      // Success case - use common reducer
      dispatch(setAuthData({
        user: data.user,
        token: data.token
      }));

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Login successful! Welcome back.'
      });

      // Redirect to requested page or dashboard after showing notification
      setTimeout(() => {
        const redirectTo = searchParams.get('redirect');
        const destination = redirectTo ? `/${redirectTo}` : '/';
        router.push(destination);
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage;
      // Handle specific error messages
      if (error.message.includes("verify your email") || error.message.includes("Please verify")) {
        errorMessage = "⚠️ Please verify your email before logging in. Check your inbox for the verification link.";
      } else if (
        error.message.includes("Invalid credentials") ||
        error.message.includes("User not found") ||
        error.message.includes("Incorrect password")
      ) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
      } else {
        errorMessage = error.message || "Login failed. Please try again.";
      }
      
      setError(errorMessage);
      dispatch(setAuthError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleForgotPasswordSubmit = async (email, errorMessage) => {
    // Handle validation errors from modal
    if (errorMessage) {
      setNotification({
        type: 'error',
        message: errorMessage
      });
      return;
    }

    setIsResettingPassword(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          message: data.message || 'Password reset link sent! Check your email.'
        });
        setShowForgotPasswordModal(false);
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to send reset email. Please try again.'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setNotification({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <>
      <MobileNavigation />
      <div className="min-h-[calc(100vh-4rem)]  via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Notification */}
        <Notification 
          notification={notification} 
          onDismiss={dismissNotification}
        />
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={closeForgotPasswordModal}
        onSubmit={handleForgotPasswordSubmit}
        initialEmail={formData.email}
        isLoading={isResettingPassword}
      />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="flex items-center justify-center py-8 px-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-orange-700">Sign in to your FlowMail account</p>
          </div>

        {/* Login Form */}
        <div className="bg-orange-50/80 backdrop-blur-xl rounded-3xl p-4 border border-orange-100 shadow-xl">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-orange-800 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 bg-white/90 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-orange-800 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-10 pr-10 bg-white/90 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-4 h-4 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-orange-700">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                >
                  Forgot Password?
                </button>
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
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  <>
                    Sign In
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </AnimatedButton>

              {/* Social Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-orange-50 text-orange-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-orange-200 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 group"
                >
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
                  <span className="text-orange-600 group-hover:text-orange-800">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-orange-200 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 group"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-orange-600 group-hover:text-orange-800">
                    GitHub
                  </span>
                </button>
              </div>
            </form>
          </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-orange-700">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-orange-600 hover:text-orange-800 font-medium underline bg-transparent border-none cursor-pointer"
            >
              Sign up for free
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}
