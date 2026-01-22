"use client";
import { useState } from "react";
import { MdStar, MdStarBorder, MdAttachment, MdDelete, MdRefresh, MdCalendarToday } from "react-icons/md";

export default function EmailList({ selectedEmailId, onEmailSelect }) {
  // Sample email data
  const [emails] = useState([
    {
      id: 1,
      from: "John Doe",
      email: "john.doe@example.com",
      subject: "Project Update - Q4 Review Meeting",
      preview: "Hi team, I wanted to share the latest updates on our Q4 project...",
      time: "10:30 AM",
      starred: true,
      read: false,
      hasAttachment: false,
    },
    {
      id: 2,
      from: "TechCrunch Newsletter",
      email: "newsletter@techcrunch.com",
      subject: "Weekly Tech News - AI Developments",
      preview: "This week in tech: OpenAI announces new features, Google updates...",
      time: "9:15 AM",
      starred: false,
      read: true,
      hasAttachment: false,
    },
    {
      id: 3,
      from: "Support Team",
      email: "support@company.com",
      subject: "Your account has been updated",
      preview: "Your account settings have been successfully updated. Here are the...",
      time: "Yesterday",
      starred: false,
      read: true,
      hasAttachment: true,
    },
    {
      id: 4,
      from: "Slack Team",
      email: "team@slack.com",
      subject: "New message from Development Team",
      preview: "You have 3 new messages in #development channel. Click to view...",
      time: "Yesterday",
      starred: true,
      read: false,
      hasAttachment: false,
    },
    {
      id: 5,
      from: "GitHub",
      email: "notifications@github.com",
      subject: "Pull request #123 has been merged",
      preview: "Your pull request 'Fix authentication bug' has been successfully...",
      time: "2 days ago",
      starred: false,
      read: true,
      hasAttachment: false,
    },
    {
      id: 6,
      from: "System Admin",
      email: "admin@system.com",
      subject: "System maintenance scheduled",
      preview: "Scheduled maintenance will occur on Sunday at 2:00 AM UTC...",
      time: "3 days ago",
      starred: false,
      read: false,
      hasAttachment: true,
    },
    {
      id: 7,
      from: "Marketing Team",
      email: "marketing@company.com",
      subject: "New product launch announcement",
      preview: "We're excited to announce the launch of our new product line...",
      time: "1 week ago",
      starred: true,
      read: true,
      hasAttachment: false,
    },
    {
      id: 8,
      from: "HR Department",
      email: "hr@company.com",
      subject: "Monthly team meeting reminder",
      preview: "Don't forget about our monthly all-hands meeting scheduled...",
      time: "1 week ago",
      starred: false,
      read: true,
      hasAttachment: false,
    },
  ]);

  const [starredEmails, setStarredEmails] = useState(
    emails.filter((email) => email.starred).map((email) => email.id)
  );
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleStarToggle = (emailId, e) => {
    e.stopPropagation();
    if (starredEmails.includes(emailId)) {
      setStarredEmails(starredEmails.filter((id) => id !== emailId));
    } else {
      setStarredEmails([...starredEmails, emailId]);
    }
  };

  const handleEmailSelect = (emailId, e) => {
    e.stopPropagation();
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter((id) => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };

  return (
    <div className="w-98 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
          
          {/* Action Bar - Single Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => console.log('Delete selected emails:', selectedEmails)}
              className="p-2 hover:bg-orange-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedEmails.length === 0}
              title="Delete selected emails"
            >
              <MdDelete className="w-4 h-4 text-orange-600" />
            </button>
            <button
              onClick={() => console.log('Refresh emails')}
              className="p-2 hover:bg-orange-100 rounded-md transition-colors"
              title="Refresh emails"
            >
              <MdRefresh className="w-4 h-4 text-orange-600" />
            </button>
            <button
              onClick={() => console.log('Open calendar')}
              className="p-2 hover:bg-orange-100 rounded-md transition-colors"
              title="Filter by date"
            >
              <MdCalendarToday className="w-4 h-4 text-orange-600" />
            </button>
            <span className="text-sm text-orange-600 font-medium">{emails.length}</span>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailSelect?.(email.id)}
            className={`border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedEmailId === email.id ? "bg-orange-50 border-l-4 border-l-orange-500" : ""
            } ${!email.read ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={(e) => handleEmailSelect(email.id, e)}
                className="mt-1 w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              
              {/* Star */}
              <button
                onClick={(e) => handleStarToggle(email.id, e)}
                className="mt-1 hover:bg-gray-100 p-1 rounded"
              >
                {starredEmails.includes(email.id) ? (
                  <MdStar className="w-4 h-4 text-orange-500" />
                ) : (
                  <MdStarBorder className="w-4 h-4 text-gray-400 hover:text-orange-500" />
                )}
              </button>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 min-w-0">
                    <h4
                      className={`text-sm truncate ${
                        !email.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                      }`}
                    >
                      {email.from}
                    </h4>
                    {email.hasAttachment && (
                      <MdAttachment className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{email.time}</span>
                </div>

                <h5
                  className={`text-sm truncate mb-1 ${
                    !email.read ? "font-semibold text-gray-900" : "font-normal text-gray-700"
                  }`}
                >
                  {email.subject}
                </h5>

                <p className="text-xs text-gray-500 truncate">{email.preview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{emails.filter((email) => !email.read).length} unread emails</span>
          {selectedEmails.length > 0 && (
            <span className="text-orange-600 font-medium">
              {selectedEmails.length} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}