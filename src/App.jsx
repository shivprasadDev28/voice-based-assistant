import React, { useState } from 'react';
import Header from './components/Header';
import TranscriptionPanel from './components/TranscriptionPanel';
import ControlPanel from './components/ControlPanel';

function App() {
  const [transcriptionText, setTranscriptionText] = useState('');

  const handleStartMeeting = () => {
    console.log('Start Meeting clicked');
    // Future: Initialize microphone and transcription
  };

  const handlePause = () => {
    console.log('Pause clicked');
    // Future: Pause transcription
  };

  const handleResume = () => {
    console.log('Resume clicked');
    // Future: Resume transcription
  };

  const handleSummarize = () => {
    console.log('Summarize clicked');
    // Future: Send to GPT for summarization
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <TranscriptionPanel transcriptionText={transcriptionText} />
      <ControlPanel
        onStartMeeting={handleStartMeeting}
        onPause={handlePause}
        onResume={handleResume}
        onSummarize={handleSummarize}
      />
    </div>
  );
}

export default App;


