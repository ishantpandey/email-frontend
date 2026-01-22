import {
  MdEmail,
  MdGroup,
  MdPublic,
  MdPriorityHigh,
  MdLowPriority,
} from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa";

// Priority options for dropdown
export const priorityOptions = [
  {
    name: "Low Priority",
    code: "low",
    icon: <MdLowPriority className="text-orange-500" />,
  },
  {
    name: "Normal Priority",
    code: "normal",
    icon: <FaRegEnvelope className="text-orange-500" />,
  },
  {
    name: "High Priority",
    code: "high",
    icon: <MdPriorityHigh className="text-orange-500" />,
  },
];

// Transmission type options
export const transmissionOptions = [
  {
    name: "Single Recipient",
    code: "single",
    icon: <MdEmail className="text-orange-500" />,
  },
  {
    name: "Bulk Recipients",
    code: "bulk",
    icon: <MdGroup className="text-orange-500" />,
  },
  {
    name: "All Users",
    code: "all",
    icon: <MdPublic className="text-orange-500" />,
  },
];

// Email validation function
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Parse and validate bulk emails
export const parseBulkEmails = (bulkEmailArray) => {
  // Handle both array and string inputs
  let emailList;
  if (Array.isArray(bulkEmailArray)) {
    emailList = bulkEmailArray.filter((email) => email && email.trim());
  } else {
    emailList = bulkEmailArray
      .split(/[,;\n]+/)
      .map((email) => email.trim())
      .filter((email) => email);
  }
  
  const invalidEmails = emailList.filter((email) => !validateEmail(email));
  
  return {
    emailList,
    invalidEmails,
    isValid: invalidEmails.length === 0,
  };
};

// Validation for email data
export const validateEmailData = (emailData, bulkEmails) => {
  if (emailData.userType === "single") {
    if (!emailData.to.trim()) {
      return { isValid: false, error: "Please enter a recipient email address" };
    }
    if (!validateEmail(emailData.to)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }
  } else if (emailData.userType === "bulk") {
    if (!bulkEmails.length) {
      return { isValid: false, error: "Please enter bulk email addresses" };
    }
    const { invalidEmails } = parseBulkEmails(bulkEmails);
    if (invalidEmails.length > 0) {
      return { isValid: false, error: "Some email addresses are invalid" };
    }
  }

  if (!emailData.subject.trim()) {
    return { isValid: false, error: "Please enter a subject" };
  }

  return { isValid: true };
};

// Prepare email payload based on user type
export const prepareEmailPayload = (emailData, bulkEmails) => {
  switch (emailData.userType) {
    case "single":
      return {
        payload: {
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          priority: emailData.priority,
          userType: emailData.userType,
        },
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_EMAIL_SEND_ENDPOINT}`,
      };

    case "bulk":
      const { emailList } = parseBulkEmails(bulkEmails);
      return {
        payload: {
          emails: emailList,
          subject: emailData.subject,
          message: emailData.message,
          priority: emailData.priority,
          userType: emailData.userType,
        },
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_EMAIL_BULK_SEND_ENDPOINT}`,
      };

    case "all":
      return {
        payload: {
          subject: emailData.subject,
          message: emailData.message,
          priority: emailData.priority,
          userType: emailData.userType,
        },
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_EMAIL_SEND_ALL_ENDPOINT}`,
      };

    default:
      throw new Error("Invalid user type selected");
  }
};

// Send email API call
export const sendEmail = async (emailData, bulkEmails) => {
  const { payload, endpoint } = prepareEmailPayload(emailData, bulkEmails);
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send email");
  }

  return result;
};

// Get success message based on user type
export const getSuccessMessage = (userType) => {
  switch (userType) {
    case "bulk":
      return "Bulk emails queued successfully!";
    case "all":
      return "Email queued for all users!";
    default:
      return "Email sent successfully!";
  }
};

// Initial email data state
export const initialEmailData = {
  to: "",
  subject: "",
  message: "",
  priority: "normal",
  userType: "single",
};

// Reset email form data
export const resetEmailData = () => ({
  ...initialEmailData,
});