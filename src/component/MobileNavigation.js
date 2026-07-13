'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Logo from './Logo';
import AnimatedButton from './AnimatedButton';
import { MdSmartToy } from 'react-icons/md';

export default function MobileNavigation({ sidebarOpen = false, onSidebarToggle = () => {} }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Header */}
      <header className="relative bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Sidebar Toggle Button - Only for authenticated users on small screens and when on mail pages */}
              {isAuthenticated && pathname.startsWith('/mail') && (
                <button
                  onClick={onSidebarToggle}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${
                    sidebarOpen 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">F</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">FlowMail</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => router.push('/features')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Pricing
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Contact
              </button>
               
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1.5 rounded-full">
                    Hi, {user.name || user.firstName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 px-2 hover:text-orange-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                   <img src="icons8-ai-chatting-50.png" alt="Chat Bot" className="w-6 h-6  text-orange-600 cursor-pointer"
                 onClick={() => router.push('/chat')} />
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Sign In
                </button>
              )}
              
             
              
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              {isAuthenticated && user ? (
                /* Profile Avatar Button */
                <button
                  onClick={toggleMenu}
                  className="p-1 rounded-full hover:bg-orange-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center ring-2 ring-orange-100 hover:ring-orange-200 transition-all">
                    <span className="text-white text-sm font-medium">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || user.firstName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </span>
                  </div>
                </button>
              ) : (
                /* Regular Menu Button for Non-authenticated Users */
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-orange-100 shadow-lg z-50">
            <div className="px-6 py-6 space-y-1">
              <button 
                onClick={() => { router.push('/'); setIsMenuOpen(false); }}
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-orange-600 transition-colors w-full text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </button>
              <button 
                onClick={() => { router.push('/features'); setIsMenuOpen(false); }}
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-orange-600 transition-colors w-full text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Features</span>
              </button>
              <button 
                onClick={() => { router.push('/pricing'); setIsMenuOpen(false); }}
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-orange-600 transition-colors w-full text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>Pricing</span>
              </button>
              <button 
                onClick={() => { router.push('/contact'); setIsMenuOpen(false); }}
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-orange-600 transition-colors w-full text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact</span>
              </button>
              
              {isAuthenticated && user ? (
                <div className="pt-4 border-t border-orange-100 mt-4">
                  <div className="text-sm text-orange-700 mb-3">
                    Welcome, {user.name || user.firstName || user.email?.split('@')[0] || 'User'}!
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-orange-100 mt-4">
                  <button 
                    onClick={handleSignIn}
                    className="flex items-center justify-center space-x-2 w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}