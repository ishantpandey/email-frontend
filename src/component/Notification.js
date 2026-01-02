"use client";

const Notification = ({ notification, onDismiss }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-2 sm:top-4 left-2 right-2 sm:left-auto sm:right-4 z-[60] max-w-xs sm:max-w-md w-full sm:w-auto ${
      notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    } border rounded-lg shadow-lg p-3 sm:p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {notification.type === 'success' ? (
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-2 sm:ml-3 flex-1">
          <p className={`text-xs sm:text-sm ${
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {notification.message}
          </p>
        </div>
        <div className="ml-2 sm:ml-4 flex-shrink-0">
          <button
            onClick={onDismiss}
            className={`inline-flex text-xs sm:text-sm font-medium p-1 rounded hover:bg-black/5 transition-colors ${
              notification.type === 'success' 
                ? 'text-green-600 hover:text-green-500' 
                : 'text-red-600 hover:text-red-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              notification.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
            }`}
            aria-label="Dismiss notification"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;