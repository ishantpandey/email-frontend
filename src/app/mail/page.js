"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AnimatedButton from "@/component/AnimatedButton";
import Logo from "@/component/Logo";
import Notification from "@/component/Notification";
import AuthWrapper from "@/component/AuthWrapper";

export default function ComposePage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
    priority: "normal",
    userType: "single", // New field for user type selection
  });

  const [isSending, setIsSending] = useState(false);
  const [bulkEmails, setBulkEmails] = useState(""); // For bulk email addresses
  const [notification, setNotification] = useState(null); // For success/error notifications

  const handleInputChange = (field, value) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Auto-dismiss success notifications after 3 seconds
    if (type === "success") {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    // Validation based on user type
    if (emailData.userType === "single") {
      if (!emailData.to.trim()) {
        showNotification("error", "Please enter a recipient email address");
        return;
      }
      if (!validateEmail(emailData.to)) {
        showNotification("error", "Please enter a valid email address");
        return;
      }
    } else if (emailData.userType === "bulk") {
      if (!bulkEmails.trim()) {
        showNotification("error", "Please enter bulk email addresses");
        return;
      }
      // Validate bulk emails
      const emailList = bulkEmails
        .split(/[,;\n]+/)
        .map((email) => email.trim())
        .filter((email) => email);
      const invalidEmails = emailList.filter((email) => !validateEmail(email));
      if (invalidEmails.length > 0) {
        showNotification("error", "Some email addresses are invalid");
        return;
      }
    }

    if (!emailData.subject.trim()) {
      showNotification("error", "Please enter a subject");
      return;
    }

    setIsSending(true);

    try {
      let emailPayload;
      let apiEndpoint;

      // Prepare payload based on user type
      switch (emailData.userType) {
        case "single":
          emailPayload = {
            to: emailData.to,
            subject: emailData.subject,
            message: emailData.message,
            priority: emailData.priority,
            userType: emailData.userType,
          };
          apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_EMAIL_SEND_ENDPOINT}`;
          break;

        case "bulk":
          const emailList = bulkEmails
            .split(/[,;\n]+/)
            .map((email) => email.trim())
            .filter((email) => email);
          emailPayload = {
            emails: emailList,
            subject: emailData.subject,
            message: emailData.message,
            priority: emailData.priority,
            userType: emailData.userType,
          };
          apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_EMAIL_BULK_SEND_ENDPOINT}`;
          break;

        case "all":
          emailPayload = {
            subject: emailData.subject,
            message: emailData.message,
            priority: emailData.priority,
            userType: emailData.userType,
          };
          apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_EMAIL_SEND_ALL_ENDPOINT}`;
          break;

        default:
          throw new Error("Invalid user type selected");
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        showNotification("error", result.message || "Failed to send email");
        return;
      }

      // Handle successful response
      if (result.success) {
        let successMessage = "Email sent successfully!";
        
        if (emailData.userType === "bulk") {
          successMessage = "Bulk emails queued successfully!";
        } else if (emailData.userType === "all") {
          successMessage = "Email queued for all users!";
        }

        showNotification("success", successMessage);

        // Reset form after successful send
        setEmailData({
          to: "",
          subject: "",
          message: "",
          priority: "normal",
          userType: "single",
        });
        setBulkEmails("");
      } else {
        showNotification("error", result.message || "Email sending failed");
      }
          result.error ? { error: result.error } : null
    } catch (error) {
      console.error("Error sending email:", error);
      showNotification("error", "Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen ">
        <Notification
          notification={notification}
          onDismiss={dismissNotification}
        />

        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {/* Header Section */}
         

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-8">
              {/* Delivery Type Section */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Delivery Type</h2>
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                  {[
                    { value: 'single', label: 'Single User', desc: 'Send to one recipient', icon: '👤' },
                    { value: 'bulk', label: 'Bulk Users', desc: 'Send to multiple recipients', icon: '👥' },
                    { value: 'all', label: 'All Users', desc: 'Send to all registered users', icon: '🌐' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        handleInputChange("userType", type.value);
                        setEmailData((prev) => ({
                          ...prev,
                          to: "",
                          userType: type.value,
                        }));
                        setBulkEmails("");
                      }}
                      className={`flex-1 px-2 py-3 sm:px-3 sm:py-4 border-2 rounded-lg sm:rounded-xl text-center transition-all duration-300 ${
                        emailData.userType === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="text-sm sm:text-lg mb-0.5 sm:mb-1">{type.icon}</div>
                      <div className="text-xs sm:text-sm font-semibold">{type.label}</div>
                      <div className="text-xs mt-0.5 sm:mt-1 opacity-75 hidden sm:block">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold text-gray-900">Recipients</h2>
                </div>
                
                {emailData.userType === "single" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      📧 Recipient Email Address
                    </label>
                    <input
                      type="email"
                      value={emailData.to}
                      onChange={(e) => handleInputChange("to", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter recipient email address"
                    />
                  </div>
                )}

                {emailData.userType === "bulk" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      📝 Multiple Email Addresses
                    </label>
                    <textarea
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      placeholder="Enter multiple emails (one per line or comma-separated)

Example:
user1@example.com
user2@example.com"
                    />
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💡</span>
                      <span>Separate emails with commas or new lines</span>
                    </div>
                  </div>
                )}

                {emailData.userType === "all" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl">🚨</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">Broadcasting to All Users</h3>
                        <p className="text-amber-800 leading-relaxed">
                          This email will be sent to every registered user in the system. 
                          Please review your message carefully before sending.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Content Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold text-gray-900">Email Content</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Subject and Priority Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ✉️ Subject Line
                      </label>
                      <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter a compelling subject line"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🔥 Priority Level
                      </label>
                      <select
                        value={emailData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="low">🟢 Low Priority</option>
                        <option value="normal">🔵 Normal Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📄 Message Content
                    </label>
                    <textarea
                      value={emailData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      placeholder="Write your email message here...

Tip: Keep your message clear and concise for better engagement."
                    />
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="text-sm text-gray-600 order-2 sm:order-1">
                    <span className="inline-flex items-center">
                      <span className="mr-2">💡</span>
                      Review your email before sending
                    </span>
                  </div>
                  
                  <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setEmailData({
                          to: "",
                          subject: "",
                          message: "",
                          priority: "normal",
                          userType: "single",
                        });
                        setBulkEmails("");
                        router.back();
                      }}
                      className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isSending}
                      className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                    >
                      {isSending ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">🚀</span>
                          Send Email
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </AuthWrapper>
  );
}
