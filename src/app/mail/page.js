"use client";
import {
  getSuccessMessage,
  initialEmailData,
  priorityOptions,
  resetEmailData,
  sendEmail,
  transmissionOptions,
  validateEmailData,
} from "@/utils/emailUtils";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useCallback, useState } from "react";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaBolt } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import {
  MdPeople,
  MdSubject
} from "react-icons/md";
import { useSelector } from "react-redux";
import CustomChips from "@/component/CustomChips";
const Notification = dynamic(() => import("@/component/Notification"), {
  ssr: false,
});
const EditorWithPreview = dynamic(
  () => import("@/component/EditorWithPreview"),
  { ssr: false },
);

export default function ComposePage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [emailData, setEmailData] = useState(initialEmailData);
  
  const [isSending, setIsSending] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [bulkEmails, setBulkEmails] = useState([]); // For bulk email addresses
  const [notification, setNotification] = useState(null); // For success/error notifications

  const handleInputChange = useCallback((field, value) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    // Auto-dismiss success notifications after 3 seconds
    if (type === "success") {
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleSend = useCallback(async () => {
    // Validate email data using utility function
    const validation = validateEmailData(emailData, bulkEmails);
    if (!validation.isValid) {
      showNotification("error", validation.error);
      return;
    }

    setIsSending(true);

    try {
      const result = await sendEmail(emailData, bulkEmails);

      if (result.success) {
        const successMessage = getSuccessMessage(emailData.userType);
        showNotification("success", successMessage);

        // Reset form after successful send
        setEmailData(resetEmailData());
        setBulkEmails([]);
      } else {
        showNotification("error", result.message || "Email sending failed");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      showNotification("error", error.message || "Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [emailData, bulkEmails, router]);

  const handleSaveDraft = useCallback(async () => {
    setIsDraftSaving(true);
    try {
      // Simulate saving to draft
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification("success", "Email saved to drafts successfully!");
    } catch (error) {
      showNotification("error", "Failed to save draft. Please try again.");
    } finally {
      setIsDraftSaving(false);
    }
  }, [showNotification]);

  const handleReset = useCallback(() => {
    setEmailData(resetEmailData());
    setBulkEmails([]);
  }, []);

  return (
    <div className="h-full ">
      <Notification
        notification={notification}
        onDismiss={dismissNotification}
      />

      <div className="w-full max-w-none sm:max-w-8xl  mx-0 sm:mx-1 md:mx-1 lg:mx-1 py-0 sm:py-1 md:py-1">
        {/* Header Section */}

        {/* Main Content Card */}
        <div className="bg-white border-0 sm:border rounded-none sm:rounded-lg border-gray-200 overflow-hidden shadow-none  w-full">
          <div className="p-2 sm:p-6 md:p-8">
            {/* Email Composition Section */}
            <div className="bg-white">
              <div className="flex items-center mb-6">
                <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                <h4 className="text-xl font-semibold text-gray-900">
                  Email Composition
                </h4>
              </div>

              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Top Row - All Dropdowns */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                  {/* Transmission Type (from Delivery Type Section) */}
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      <span className="flex items-center gap-1 sm:gap-2">
                        <HiOutlinePaperAirplane className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                        <span className="text-xs sm:text-sm">Transmission Type</span>
                      </span>
                    </label>
                    <Dropdown
                      value={transmissionOptions.find(
                        (option) => option.code === emailData.userType,
                      )}
                      onChange={(e) => {
                        handleInputChange("userType", e.value.code);
                        setEmailData((prev) => ({
                          ...prev,
                          to: "",
                          userType: e.value.code,
                        }));
                        setBulkEmails([]);
                      }}
                      options={transmissionOptions}
                      optionLabel="name"
                      placeholder="Select transmission type"
                      className="w-full text-xs flex items-center sm:text-sm border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                      size="small"
                      style={{
                        height: "32px",
                        fontSize: "12px",
                        borderColor: "#f97316",
                      }}
                      itemTemplate={(option) => (
                        <div className="flex items-center gap-1 text-sm py-1">
                          {option.icon}
                          <span>{option.name}</span>
                        </div>
                      )}
                      valueTemplate={(option) => (
                        <div className="flex items-center gap-1 text-sm">
                          {option?.icon}
                          <span>{option?.name}</span>
                        </div>
                      )}
                    />
                  </div>

                  {/* Priority Level */}
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      <span className="flex items-center gap-1 sm:gap-2">
                        <FaBolt className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                        <span className="text-xs sm:text-sm">Priority Level</span>
                      </span>
                    </label>
                    <Dropdown
                      value={priorityOptions.find(
                        (option) => option.code === emailData.priority,
                      )}
                      onChange={(e) =>
                        handleInputChange("priority", e.value.code)
                      }
                      options={priorityOptions}
                      optionLabel="name"
                      placeholder="Select priority level"
                      className="w-full text-xs sm:text-sm flex items-center border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                      size="small"
                      style={{
                        height: "32px",
                        fontSize: "12px",
                        borderColor: "#f97316",
                      }}
                      itemTemplate={(option) => (
                        <div className="flex items-center gap-2 text-sm">
                          {option.icon}
                          <span>{option.name}</span>
                        </div>
                      )}
                      valueTemplate={(option) => (
                        <div className="flex items-center gap-2 text-sm">
                          {option?.icon}
                          <span>{option?.name}</span>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Recipients and Subject Row */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Recipients based on type - Above Subject */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      <span className="flex items-center gap-2">
                        <MdPeople className="w-4 h-4 text-orange-500" />
                        <span>Recipients</span>
                      </span>
                    </label>

                    {emailData.userType === "single" && (
                      <InputText
                        type="email"
                        value={emailData.to}
                        onChange={(e) =>
                          handleInputChange("to", e.target.value)
                        }
                        placeholder="Enter email address"
                        className="w-full"
                        style={{
                          outline: "none",
                          height: "32px",
                          fontSize: "14px",
                        }}
                      />
                    )}

                    {emailData.userType === "bulk" && (
                      <CustomChips
                        value={bulkEmails}
                        onChange={setBulkEmails}
                        placeholder="Enter email addresses"
                        className="w-full"
                      />
                    )}

                    {emailData.userType === "all" && (
                      <div className="w-full p-3 bg-orange-50 border border-orange-300 rounded-lg text-center">
                        <span className="text-orange-800 text-sm flex items-center justify-center gap-1">
                          <MdPublic className="w-4 h-4 text-orange-500" />
                          <span>Broadcasting to all users</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subject - Below Recipients */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      <span className="flex items-center gap-2">
                        <MdSubject className="w-4 h-4 text-orange-500" />
                        <span>Subject Line</span>
                      </span>
                    </label>
                    <InputText
                      value={emailData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder="Enter subject line"
                      className="w-full"
                      style={{
                        outline: "none",
                        height: "32px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                {/* Message Content */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    <span className="flex items-center gap-2">
                      <BiMessageSquareDetail className="w-4 h-4 text-orange-500" />
                      <span>Message Content</span>
                    </span>
                  </label>
                  <EditorWithPreview
                    value={emailData.message}
                    onChange={(value) => handleInputChange("message", value)}
                    editorHeight="300px"
                  />
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="bg-white border-t border-gray-200 px-0 sm:px-6 py-3 sm:py-4 mt-4 sm:mt-6 w-full">
              <div className="flex items-center justify-between gap-2 w-full">
                {/* Reset Button - Left Side */}
                <div className="flex-shrink-0">
                  <Button
                    label="Reset"
                    icon="pi pi-refresh"
                    onClick={handleReset}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs"
                    outlined
                    size="small"
                    style={{
                      borderColor: "#6b7280",
                      color: "#6b7280",
                    }}
                  />
                </div>

                {/* Send and Draft Buttons - Right Side */}
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    label={isDraftSaving ? "Saving..." : "Draft"}
                    icon={
                      isDraftSaving ? "pi pi-spin pi-spinner" : "pi pi-save"
                    }
                    onClick={handleSaveDraft}
                    loading={isDraftSaving}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs"
                    outlined
                    size="small"
                    style={{
                      borderColor: "#f97316",
                      color: "#f97316",
                    }}
                  />
                  <Button
                    label={isSending ? "Sending..." : "Send"}
                    icon={isSending ? "pi pi-spin pi-spinner" : "pi pi-send"}
                    onClick={handleSend}
                    loading={isSending}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs"
                    size="small"
                    style={{
                      backgroundColor: "#f97316",
                      borderColor: "#f97316",
                      color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
