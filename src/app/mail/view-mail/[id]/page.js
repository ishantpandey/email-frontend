"use client";
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { MdStar, MdStarBorder, MdAttachment, MdReply, MdForward, MdDelete, MdArrowBack, MdMoreVert } from "react-icons/md";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { setSelectedEmail } from "@/store/slices/emailSlice";

export default function EmailDetailPage({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { emails } = useSelector((state) => state.email);
  const [email, setEmail] = useState(null);
  const [starred, setStarred] = useState(false);
  const menuRef = useRef(null);
  
  // Unwrap params promise using React.use()
  const resolvedParams = use(params);
  console.log('Resolved Params:', resolvedParams);

  // Helper function to format date
  const formatEmailDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format time
  const formatEmailTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (emails && emails.length > 0) {
      const emailId = resolvedParams.id;
      const foundEmail = emails.find(e => e._id === emailId);
      if (foundEmail) {
        setEmail(foundEmail);
        setStarred(foundEmail.isStarred || false);
      } else {
        console.log('Email not found with ID:', emailId);
        // Optionally redirect back or show error
      }
    }
  }, [emails, resolvedParams.id]);

  const handleStarToggle = () => {
    setStarred(!starred);
  };

  const handleReply = () => {
    router.push('/mail/compose-mail?action=reply&id=' + resolvedParams.id);
  };

  const handleForward = () => {
    router.push('/mail/compose-mail?action=forward&id=' + resolvedParams.id);
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('Delete email:', resolvedParams.id);
    router.back();
  };

  const menuItems = [
    {
      label: 'Move to Folder',
      icon: 'pi pi-folder',
      command: () => console.log('Move to folder')
    },
    {
      label: 'Print',
      icon: 'pi pi-print',
      command: () => console.log('Print email')
    },
    {
      separator: true
    },
    {
      label: 'Report Spam',
      icon: 'pi pi-exclamation-triangle',
      command: () => console.log('Report spam')
    }
  ];

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <div className="text-gray-500">Loading email...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 pt-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Back button - only visible on small devices */}
          <Button
            icon={<MdArrowBack className="w-5 h-5" />}
            onClick={() => {
              dispatch(setSelectedEmail(null));
              router.push('/mail');
            }}
            className="p-1 lg:hidden"
            text
            tooltip="Back to inbox"
            tooltipOptions={{ position: 'bottom' }}
            style={{
              color: "#6b7280"
            }}
          />
          
          {/* Spacer for large screens */}
          <div className="hidden lg:block w-8"></div>
          
          <div className="flex items-center gap-2">
            <Button
              icon={starred ? <MdStar className="w-5 h-5" /> : <MdStarBorder className="w-5 h-5" />}
              onClick={handleStarToggle}
              className="p-1"
              text
              tooltip={starred ? "Remove star" : "Add star"}
              tooltipOptions={{ position: 'bottom' }}
              style={{
                color: starred ? "#f97316" : "#6b7280"
              }}
            />
            <Button
              icon={<MdReply className="w-5 h-5" />}
              onClick={handleReply}
              className="p-1"
              text
              tooltip="Reply"
              tooltipOptions={{ position: 'bottom' }}
              style={{
                color: "#f97316"
              }}
            />
            <Button
              icon={<MdForward className="w-5 h-5" />}
              onClick={handleForward}
              className="p-1"
              text
              tooltip="Forward"
              tooltipOptions={{ position: 'bottom' }}
              style={{
                color: "#f97316"
              }}
            />
            <Button
              icon={<MdDelete className="w-5 h-5" />}
              onClick={handleDelete}
              className="p-1"
              text
              tooltip="Delete"
              tooltipOptions={{ position: 'bottom' }}
              style={{
                color: "#ef4444"
              }}
            />
            <Button
              icon={<MdMoreVert className="w-5 h-5" />}
              onClick={(e) => menuRef.current.toggle(e)}
              className="p-1"
              text
              tooltip="More options"
              tooltipOptions={{ position: 'bottom' }}
              style={{
                color: "#6b7280"
              }}
            />
            <Menu
              ref={menuRef}
              model={menuItems}
              popup
            />
          </div>
        </div>

        {/* Email Subject */}
        <div className="mb-3">
          <h5 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            {email.subject || 'No Subject'}
            {email.attachments && email.attachments.length > 0 && <MdAttachment className="w-4 h-4 text-gray-500" />}
          </h5>
        </div>

        {/* Email Meta */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {(email.userName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900">{email.userName || 'Unknown User'}</div>
                <div className="text-gray-500">{email.userEmail || 'unknown@email.com'}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div>{formatEmailTime(email.createdAt)}</div>
            <div className="text-xs text-gray-400">{formatEmailDate(email.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap text-gray-800 leading-relaxed"
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: '1.6'
              }}
              dangerouslySetInnerHTML={{ __html: email.message || 'No content available' }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex gap-3">
          <Button
            label="Reply"
            icon="pi pi-reply"
            onClick={handleReply}
            className="px-4 py-2"
            size="small"
                    style={{
                      backgroundColor: "#f97316",
                      borderColor: "#f97316",
                      color: "white",
                      fontSize: "12px",
                      height: "28px",
                    }}
          />
          <Button
            label="Reply All"
            icon="pi pi-reply"
            onClick={() => router.push('/mail/compose-mail?action=replyAll&id=' + resolvedParams.id)}
            outlined
            className="px-4 py-2"
           size="small"
                    style={{
                      backgroundColor: "#f97316",
                      borderColor: "#f97316",
                      color: "white",
                      fontSize: "12px",
                      height: "28px",
                    }}
          />
          <Button
            label="Forward"
            icon="pi pi-share-alt"
            onClick={handleForward}
            outlined
            className="px-4 py-2"
            size="small"
                    style={{
                      backgroundColor: "#f97316",
                      borderColor: "#f97316",
                      color: "white",
                      fontSize: "12px",
                      height: "28px",
                    }}
          />
        </div>
      </div>
    </div>
  );
}
