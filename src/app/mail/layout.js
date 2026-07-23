"use client";
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import axios from "axios";
import ComposeSidebar from "@/component/ComposeSidebar";
import EmailList from "@/component/EmailList";
import MobileNavigation from "@/component/MobileNavigation";
import AuthWrapper from "@/component/AuthWrapper";
import { setLoading, setEmails, setError, setSelectedEmail } from "@/store/slices/emailSlice";

export default function ComposeLayout({ children, params }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { token } = useSelector((state) => state.auth);
  const { emails, loading, error, selectedEmailId } = useSelector((state) => state.email);
  const [sidebarOpen, setSidebarOpen] = useState(false);
   

  // Fetch emails from API
  const fetchEmails = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // Get token from Redux or localStorage
      let authToken = token;
      if (!authToken && typeof window !== 'undefined') {
        authToken = localStorage.getItem('authToken');
      }
      
      // Prepare headers with bearer token
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

   
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL 
    // console.log('Fetching emails from:', `${API_URL}${EMAIL_LIST_ENDPOINT}`);
      const response = await axios.get(`${API_URL}/email/list`, {
        headers
      });
      // Extract emails from nested response structure
      const emailsData = response.data?.data?.emails || response.data || [];
      dispatch(setEmails(emailsData));
    } catch (err) {
      console.error('Failed to fetch emails:', err);
      dispatch(setError(err.response?.data?.message || 'Failed to fetch emails'));
      dispatch(setEmails([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [dispatch]);

  return (
    <AuthWrapper>
      <div className="h-screen  flex flex-col overflow-hidden">
        {/* Mobile Navigation */}
        <MobileNavigation
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar */}
          <div
            className={`w-64 md:w-60 lg:w-68 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
              sidebarOpen
                ? "fixed left-0 top-16 h-[calc(100vh-64px)] transform translate-x-0 z-30"
                : "fixed left-0 top-16 h-[calc(100vh-64px)] transform -translate-x-full z-30"
            } lg:relative lg:top-0 lg:h-full lg:translate-x-0 lg:block`}
          >
            <ComposeSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
   
          {/* Email List */}
          <div className={`flex-shrink-0 ${
            (selectedEmailId || pathname === '/mail/compose-mail') ? 'hidden lg:block' : 'block'
          }`}>
            <EmailList
              selectedEmailId={selectedEmailId}
              onEmailSelect={(id) => dispatch(setSelectedEmail(id))}
              emails={emails}
              loading={loading}
              error={error}
              onRefresh={fetchEmails}
            />
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col min-w-0 lg:ml-0 `}>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="h-full p-1 sm:p-1">
                {/* Back button for small screens when email is selected */}
               
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-3 flex-shrink-0">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="hidden sm:inline">
                    💡 Tip: Use Ctrl+Enter to send quickly
                  </span>
                  <span className="sm:hidden">💡 Quick send: Ctrl+Enter</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="hidden sm:inline">Auto-save enabled</span>
                  <span className="sm:hidden">Auto-save</span>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            style={{ top: "64px" }} // Account for mobile navigation
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthWrapper>
  );
}
