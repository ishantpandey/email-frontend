"use client";
import { useState } from "react";
import { MdStar, MdStarBorder, MdRefresh, MdMoreVert } from "react-icons/md";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

export default function AllMailsPage() {
  // Sample email data
  const [emails] = useState([
    {
      id: 1,
      from: "john.doe@example.com",
      subject: "Project Update - Q4 Review",
      time: "10:30 AM",
      starred: true,
      read: false,
    },
    {
      id: 2,
      from: "newsletter@techcrunch.com",
      subject: "Weekly Tech News - AI Developments",
      time: "9:15 AM",
      starred: false,
      read: true,
    },
    {
      id: 3,
      from: "support@company.com",
      subject: "Your account has been updated",
      time: "Yesterday",
      starred: false,
      read: true,
    },
    {
      id: 4,
      from: "team@slack.com",
      subject: "New message from Development Team",
      time: "Yesterday",
      starred: true,
      read: false,
    },
    {
      id: 5,
      from: "notifications@github.com",
      subject: "Pull request #123 has been merged",
      time: "2 days ago",
      starred: false,
      read: true,
    },
    {
      id: 6,
      from: "admin@system.com",
      subject: "System maintenance scheduled",
      time: "3 days ago",
      starred: false,
      read: false,
    },
    {
      id: 7,
      from: "marketing@company.com",
      subject: "New product launch announcement",
      time: "1 week ago",
      starred: true,
      read: true,
    },
    {
      id: 8,
      from: "hr@company.com",
      subject: "Monthly team meeting reminder",
      time: "1 week ago",
      starred: false,
      read: true,
    },
    {
      id: 9,
      from: "billing@aws.com",
      subject: "AWS Invoice for January 2026",
      time: "2 days ago",
      starred: false,
      read: false,
    },
    {
      id: 10,
      from: "security@microsoft.com",
      subject: "Security alert: New sign-in detected",
      time: "5 hours ago",
      starred: true,
      read: false,
    },
    
  ]);

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [starredEmails, setStarredEmails] = useState(
    emails.filter((email) => email.starred).map((email) => email.id)
  );
  const [first, setFirst] = useState(0);
  const [rows] = useState(15); // Fixed to 15 rows

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.checked) {
      setSelectedEmails(emails.map((email) => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  // Handle individual email selection
  const handleEmailSelect = (emailId, checked) => {
    if (checked) {
      setSelectedEmails([...selectedEmails, emailId]);
    } else {
      setSelectedEmails(selectedEmails.filter((id) => id !== emailId));
    }
  };

  // Handle star toggle
  const handleStarToggle = (emailId) => {
    if (starredEmails.includes(emailId)) {
      setStarredEmails(starredEmails.filter((id) => id !== emailId));
    } else {
      setStarredEmails([...starredEmails, emailId]);
    }
  };

  // Handle pagination
  const onPageChange = (event) => {
    setFirst(event.first);
  };

  const displayedEmails = emails.slice(first, first + rows);

  return (
    <div className="h-full">
      <div className="w-full max-w-none sm:max-w-8xl mx-0 sm:mx-1 md:mx-1 lg:mx-1 py-0 sm:py-1 md:py-1">
        {/* Main Content Card */}
        <div className="bg-white border-0 sm:border rounded-none sm:rounded-lg border-gray-200 overflow-hidden shadow-none w-full">
          <div className="p-2 sm:p-6 md:p-8">
            {/* All Mails Section */}
            <div className="bg-white">
              <div className="flex items-center mb-6">
                <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                <h4 className="text-xl font-semibold text-gray-900">
                  All Mails
                </h4>
                <div className="flex items-center gap-2 ml-auto">
                  {selectedEmails.length > 0 && (
                    <Button
                      label="Delete"
                      icon="pi pi-trash"
                      className="p-button-danger"
                      size="small"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                    />
                  )}
                  <button
                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    // tooltip="Refresh"
                  >
                    <MdRefresh className="w-5 h-5 text-orange-500" />
                  </button>
                </div>
              </div>
              {/* Email Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-3 py-2">
                <Checkbox
                  checked={selectedEmails.length === emails.length}
                  indeterminate={
                    selectedEmails.length > 0 &&
                    selectedEmails.length < emails.length
                      ? true
                      : undefined
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="w-10 px-2 py-2"></th>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedEmails.map((email) => (
              <tr
                key={email.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  !email.read ? "bg-gray-100" : ""
                }`}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <Checkbox
                    checked={selectedEmails.includes(email.id)}
                    onChange={(e) =>
                      handleEmailSelect(email.id, e.checked)
                    }
                  />
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <button
                    onClick={() => handleStarToggle(email.id)}
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    {starredEmails.includes(email.id) ? (
                      <MdStar className="w-4 h-4 text-orange-500" />
                    ) : (
                      <MdStarBorder className="w-4 h-4 text-gray-400 hover:text-orange-500" />
                    )}
                  </button>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {email.from}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div
                    className={`text-sm ${
                      !email.read
                        ? "font-semibold text-gray-900"
                        : "font-normal text-gray-700"
                    }`}
                  >
                    {email.subject}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  <div className="text-xs text-gray-500">{email.time}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-0 sm:px-2 py-3 sm:py-4 mt-4 sm:mt-6">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={emails.length}
          onPageChange={onPageChange}
          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first}-{last} of {totalRecords}"
          className="p-paginator-sm"
          style={{ fontSize: "0.75rem" }}
          pt={{
            root: { 
              className: "p-1",
              style: { padding: "0.25rem" }
            },
            firstPageButton: { 
              style: { padding: "0.25rem 0.5rem", fontSize: "0.75rem" }
            },
            previousPageButton: { 
              style: { padding: "0.25rem 0.5rem", fontSize: "0.75rem" }
            },
            nextPageButton: { 
              style: { padding: "0.25rem 0.5rem", fontSize: "0.75rem" }
            },
            lastPageButton: { 
              style: { padding: "0.25rem 0.5rem", fontSize: "0.75rem" }
            },
            current: { 
              style: { fontSize: "0.75rem", padding: "0.25rem" }
            }
          }}
        />
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}