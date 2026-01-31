"use client";
import {
  MdEmail
} from "react-icons/md";

export default function ComposePage() {
  return (
    <div className="h-full hidden lg:block">
      <div className="w-full max-w-none sm:max-w-8xl  mx-0 sm:mx-1 md:mx-1 lg:mx-1 py-0 sm:py-1 md:py-1">
        {/* Main Content Card */}
        <div className="bg-white   overflow-hidden shadow-none  w-full h-full md:h-[700px] lg:h-[600px]  ">
          <div className="p-2 sm:p-6 md:p-8">
            {/* Large Mail Icon Section */}
            <div className="flex flex-col items-center justify-center py-16 mt-8">
              <div className="flex flex-col items-center space-y-4">
                <MdEmail className="w-24 h-24 text-orange-500" />
                <p className="text-lg text-gray-600 font-medium">Select content to read</p>
                <p className="text-sm text-gray-400 max-w-md text-center">
                  Choose an email from the list to view its contents, or compose a new email to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
