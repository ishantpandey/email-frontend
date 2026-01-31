"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  MdInbox,
  MdStar,
  MdStarOutline,
  MdDrafts,
  MdDescription,
  MdSubscriptions,
  MdSchedule,
  MdGroup,
  MdDelete,
  MdClose,
  MdAdd,
  MdEmail,
} from "react-icons/md";

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
    { id: "primary", label: "Primary", icon: <MdStarOutline className="w-5 h-5 text-orange-500" />, count: 5, route: "/mail/primary" },
    { id: "starred", label: "Starred", icon: <MdStar className="w-5 h-5 text-orange-500" />, count: 3, route: "/mail/starred" },
    { id: "draft", label: "Draft", icon: <MdDrafts className="w-5 h-5 text-orange-500" />, count: 2, route: "/mail/draft" },
    { id: "template", label: "Template", icon: <MdDescription className="w-5 h-5 text-orange-500" />, count: 7, route: "/mail/templates" },
    {
      id: "subscription",
      label: "Subscription",
      icon: <MdSubscriptions className="w-5 h-5 text-orange-500" />,
      count: 15,
      route: "/mail/subscriptions"
    },
    {
      id: "scheduled",
      label: "Scheduled",
      icon: <MdSchedule className="w-5 h-5 text-orange-500" />,
      count: 4,
      route: "/mail/scheduled"
    },
    {
      id: "allusers",
      label: "All Users",
      icon: <MdGroup className="w-5 h-5 text-orange-500" />,
      count: 342,
      route: "/mail/users"
    },
    { id: "bin", label: "Bin", icon: <MdDelete className="w-5 h-5 text-orange-500" />, count: 8, route: "/mail/bin" },
  ];

  // Check if item is active based on current path
  const isItemActive = (route) => {
    if (route === '/compose-mail') {
      return pathname === '/compose-mail' || pathname.startsWith('/compose-mail/');
    }
    return pathname === route;
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
         <button onClick={() => router.push('/mail/compose-mail')} className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
          <MdAdd className="w-6 h-6" />
          <span> Compose</span>
        </button>
          {/* <button
            onClick={onClose}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors lg:hidden"
          >
            <MdClose className="w-6 h-6 text-gray-500" />
          </button> */}
        </div>
      </div>

      {/* Compose Button */}
      {/* <div className="p-4 border-b border-gray-200">
        
      </div> */}

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
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
                title={`Navigate to ${item.label}`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      isActive
                        ? "bg-orange-200 text-orange-800"
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
