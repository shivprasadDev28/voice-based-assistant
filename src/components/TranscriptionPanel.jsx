import React from 'react';

function TranscriptionPanel({ transcriptionText }) {
  return (
    <main className="flex-1 p-6 overflow-hidden">
      <div className="h-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Live Transcription
          </h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {transcriptionText ? (
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {transcriptionText}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg font-medium">No active transcription</p>
                <p className="text-sm mt-2">Click "Start Meeting" to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default TranscriptionPanel;


