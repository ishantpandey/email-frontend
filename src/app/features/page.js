'use client';
import { useState } from 'react';
import MobileNavigation from "../../component/MobileNavigation";

export default function FeaturePage() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const advancedFeatures = [
    {
      title: "Priority-based Email",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v13" />
          <circle cx="12" cy="18" r="2.5" fill="currentColor" />
          <path d="M12 3l4 4M12 3l-4 4" />
        </svg>
      ),
      description: "Mark emails as High, Medium, or Low priority and manage your inbox efficiently. Important messages always stand out with color-coded indicators."
    },
    {
      title: "Unicast Email",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      description: "Send personalized emails to a single recipient with ease and track delivery status in real time. Perfect for one-on-one communication."
    },
    {
      title: "Multicast Email",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <circle cx="7" cy="12" r="2" />
          <circle cx="17" cy="12" r="2" />
          <path d="M9 12h6" />
        </svg>
      ),
      description: "Easily send the same message to a select group of recipients. Perfect for teams and project updates with targeted distribution."
    },
    {
      title: "Broadcast Email",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8" />
          <path d="M8 16h8" />
          <path d="M6 10l12 4" />
        </svg>
      ),
      description: "Reach your entire audience at once with broadcast emails. Ideal for announcements, newsletters, and company-wide communications."
    },
    {
      title: "Scheduled Mail",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 3" />
          <path d="M16 2v2M8 2v2" />
        </svg>
      ),
      description: "Compose emails now and schedule them to be sent later. Never miss a deadline or important event again with smart scheduling."
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">

      <MobileNavigation />

       <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full px-2 md:px-10 py-4 md:py-10">
        <section className="w-full max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-10 text-center tracking-tight drop-shadow">
            Discover What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Feature Card 1 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-orange-100 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-200">
              <span className="bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg text-white rounded-xl p-5 mb-4 flex items-center justify-center">
                {/* Shield Lock SVG for Security */}
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3l7 4v5c0 5.25-3.5 9.74-7 10-3.5-.26-7-4.75-7-10V7l7-4z" />
                  <circle cx="12" cy="13" r="2" />
                  <path d="M12 15v2" />
                </svg>
              </span>
              <h3 className="font-bold text-orange-700 text-xl mb-2 text-center">
                Secure Email Communication
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Your emails are protected with industry-leading security
                protocols, including end-to-end encryption and multi-factor
                authentication for maximum privacy.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-orange-100 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-200">
              <span className="bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg text-white rounded-xl p-5 mb-4 flex items-center justify-center">
                {/* Touch UI SVG for Intuitive UI */}
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 18v-6a2 2 0 1 1 4 0v6" />
                  <rect x="8" y="3" width="8" height="4" rx="2" />
                  <path d="M6 8v8a6 6 0 0 0 12 0V8" />
                </svg>
              </span>
              <h3 className="font-bold text-orange-700 text-xl mb-2 text-center">
                Intuitive User Interface
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Navigate your inbox and features with ease on any device. Our
                adaptive design ensures a seamless experience whether you're on
                desktop, tablet, or mobile.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-orange-100 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-200">
              <span className="bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg text-white rounded-xl p-5 mb-4 flex items-center justify-center">
                {/* Lightning Bolt SVG for Speed */}
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 2L3 14h7v8l7-12h-7z" />
                </svg>
              </span>
              <h3 className="font-bold text-orange-700 text-xl mb-2 text-center">
                Fast & Reliable
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Experience lightning-fast email delivery and robust uptime. Our
                infrastructure is optimized for speed and reliability, so you
                never miss an important message.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-orange-100 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-200">
              <span className="bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg text-white rounded-xl p-5 mb-4 flex items-center justify-center">
                {/* Template SVG for Customizable Templates */}
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10M7 12h10M7 16h6" />
                </svg>
              </span>
              <h3 className="font-bold text-orange-700 text-xl mb-2 text-center">
                Customizable Templates
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Create and use beautiful email templates for any occasion.
                Personalize your communication with easy-to-edit designs and
                reusable layouts.
              </p>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-orange-100 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-200">
              <span className="bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg text-white rounded-xl p-5 mb-4 flex items-center justify-center">
                {/* Support SVG for Dedicated Support */}
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <h3 className="font-bold text-orange-700 text-xl mb-2 text-center">
                Dedicated Support
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Our support team is available 24/7 to help you with any issues
                or questions. Get fast, friendly assistance whenever you need
                it.
              </p>
            </div>
          </div>
          <div className="mt-14 flex justify-center">
            <a
              href="/register"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-200"
            >
              Get Started Now
            </a>
          </div>
        </section>
      </main>

      {/* Advanced Features Dropdown Section */}
      <div className="w-full bg-white/80 backdrop-blur-sm  py-6 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">Advanced Email Features</h2>
          <div className="space-y-3">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md  overflow-hidden">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full flex items-center justify-between p-5 hover:bg-orange-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-orange-500">
                      {feature.icon}
                    </span>
                    <h3 className="text-lg font-bold text-orange-700">{feature.title}</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-orange-500 transition-transform duration-200 ${
                      openDropdown === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === index && (
                  <div className="px-5 pb-5 pt-2 bg-orange-50/50 border-t border-orange-100">
                    <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
     
    </div>
  );
}
