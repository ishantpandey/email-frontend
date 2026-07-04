"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdStar, MdStarBorder, MdAttachment, MdDelete, MdRefresh, MdCalendarToday } from "react-icons/md";

export default function EmailList({ selectedEmailId, onEmailSelect, emails = [], loading = false, error = null, onRefresh }) {
  const router = useRouter();
  
  // Transform API data to component format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Use emails directly, ensure it's always an array
  const emailList = Array.isArray(emails) ? emails : [];

  const [starredEmails, setStarredEmails] = useState(
    emailList.filter((email) => email.isStarred).map((email) => email._id)
  );
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleEmailClick = (emailId) => {
    // Navigate to view-mail page with email id as parameter
    router.push(`/mail/view-mail/${emailId}`);
  };

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
    <div className="w-98 lg:w-90 bg-white border-r  border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="border-b rounded-md border-gray-200 p-3 flex-shrink-0">
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
              onClick={onRefresh}
              className="p-2 hover:bg-orange-100 rounded-md transition-colors"
              title="Refresh emails"
              disabled={loading}
            >
              <MdRefresh className={`w-4 h-4 text-orange-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => console.log('Open calendar')}
              className="p-2 hover:bg-orange-100 rounded-md transition-colors"
              title="Filter by date"
            >
              <MdCalendarToday className="w-4 h-4 text-orange-600" />
            </button>
            <span className="text-sm text-orange-600 font-medium">{emailList.length}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && emailList.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MdRefresh className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading emails...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && emailList.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Email List */}
      {(!loading || emailList.length > 0) && (
      <div className="flex-1 overflow-y-auto">
        {emailList.map((email) => (
          <div
            key={email._id}
            onClick={() => onEmailSelect?.(email._id)}
            className={`border-b rounded-md border-gray-200 shadow-sm p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedEmailId === email._id ? "bg-orange-50 border-l-4 border-l-orange-500" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedEmails.includes(email._id)}
                onChange={(e) => handleEmailSelect(email._id, e)}
                className="mt-1 w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              
              {/* Star */}
              <button
                onClick={(e) => handleStarToggle(email._id, e)}
                className="mt-1 hover:bg-gray-100 p-1 rounded"
              >
                {email.isStarred ? (
                  <MdStar className="w-4 h-4 text-orange-500" />
                ) : (
                  <MdStarBorder className="w-4 h-4 text-gray-400 hover:text-orange-500" />
                )}
              </button>

              {/* Email Content */}
              <div className="flex-1 min-w-0" onClick={() => handleEmailClick(email._id)}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 min-w-0">
                    <h4
                      className="text-sm truncate font-medium text-gray-700"
                    >
                      {email.userName || 'Unknown User'}
                    </h4>
                    {email.hasAttachment && (
                      <MdAttachment className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(email.createdAt)}</span>
                </div>

                <h5
                  className="text-sm truncate mb-1 font-normal text-gray-700"
                >
                  {email.subject || 'No Subject'}
                </h5>

                <p className="text-xs text-gray-500 truncate">{stripHtml(email.message || 'No content')}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {emailList.length === 0 && !loading && !error && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="mb-4">
                <svg 
                  className="mx-auto h-24 w-24 text-gray-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your inbox is empty</h3>
              <p className="text-gray-500 mb-6">Start by composing your first email or refresh to check for new messages.</p>
             
            </div>
          </div>
        )}
      </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{emailList.length} emails</span>
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