import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            <h1 className="text-2xl font-bold">Voice-based Meeting Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              Prototype v1.0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;


