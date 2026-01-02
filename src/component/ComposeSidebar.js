"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function ComposeSidebar({ isOpen = true, onClose = () => {} }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  // Handle navigation
  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'compose':
        router.push('/mail');
        break;
      case 'inbox':
        router.push('/mail/inbox');
        break;
      case 'primary':
        router.push('/mail/primary');
        break;
      case 'starred':
        router.push('/mail/starred');
        break;
      case 'draft':
        router.push('/mail/draft');
        break;
      case 'template':
        router.push('/mail/templates');
        break;
      case 'subscription':
        router.push('/mail/subscriptions');
        break;
      case 'scheduled':
        router.push('/mail/scheduled');
        break;
      case 'allusers':
        router.push('/mail/users');
        break;
      case 'bin':
        router.push('/mail/bin');
        break;
      default:
        break;
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Navigation items for email management
  const navigationItems = [
    { id: "inbox", label: "Inbox", icon: "📥", count: 12, route: "/mail/inbox" },
    { id: "primary", label: "Primary", icon: "⭐", count: 5, route: "/mail/primary" },
    { id: "starred", label: "Starred", icon: "⭐", count: 3, route: "/mail/starred" },
    { id: "draft", label: "Draft", icon: "📝", count: 2, route: "/mail/draft" },
    { id: "template", label: "Template", icon: "📄", count: 7, route: "/mail/templates" },
    {
      id: "subscription",
      label: "Subscription",
      icon: "📊",
      count: 15,
      route: "/mail/subscriptions"
    },
    {
      id: "scheduled",
      label: "Scheduled",
      icon: "⏰",
      count: 4,
      route: "/mail/scheduled"
    },
    {
      id: "allusers",
      label: "All Users",
      icon: "👥",
      count: 342,
      route: "/mail/users"
    },
    { id: "bin", label: "Bin", icon: "🗑️", count: 8, route: "/mail/bin" },
  ];

  // Check if item is active based on current path
  const isItemActive = (route) => {
    if (route === '/compose') {
      return pathname === '/compose' || pathname.startsWith('/compose/');
    }
    return pathname === route;
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Email</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Compose Button */}
      <div className="p-4 border-b border-gray-200">
        <button onClick={() => router.push('/mail')} className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span> Compose</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Navigation</h4>
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = isItemActive(item.route);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={`Navigate to ${item.label}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      isActive
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
