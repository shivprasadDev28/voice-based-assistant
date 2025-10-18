# Voice-based Meeting Assistant (Prototype)

A desktop application prototype built with Electron, React, and TailwindCSCS for voice-based meeting transcription and summarization.

## 🚀 Features (Current Prototype)

- **Modern UI**: Clean, responsive interface built with React and TailwindCSS
- **Electron Desktop App**: Cross-platform desktop application
- **Control Panel**: Start Meeting, Pause, Resume, and Summarize buttons
- **Transcription Panel**: Scrollable text area for live transcription display

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

## 🛠️ Installation

1. **Navigate to the project directory:**
   ```bash
   cd C:\projectvba
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🎯 Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

This will:
- Start the Vite development server for React
- Launch the Electron window automatically
- Open DevTools for debugging

### Production Mode

To build and run the production version:

```bash
npm run build
npm start
```

## 📁 Project Structure

```
C:\projectvba\
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── TranscriptionPanel.jsx  # Main transcription display
│   │   └── ControlPanel.jsx     # Control buttons
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles with Tailwind
├── main.js                      # Electron main process
├── preload.js                   # Electron preload script
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🎨 UI Components

### Header
- Displays app name: "Voice-based Meeting Assistant"
- Includes microphone icon
- Shows prototype version badge

### Transcription Panel
- Scrollable text area for live transcription
- Currently shows placeholder message
- Ready for real-time transcription integration

### Control Panel
- **Start Meeting**: Begins transcription session
- **Pause**: Temporarily stops transcription
- **Resume**: Continues paused transcription
- **Summarize**: Generates meeting summary

## 🔮 Future Integration Ready

The application is structured to easily integrate:

1. **Firebase Google Sign-In**: User authentication
2. **Microphone Capture**: Real-time audio recording
3. **System Audio Capture**: Desktop audio recording
4. **Whisper API**: Speech-to-text transcription
5. **GPT API**: Meeting summarization and analysis

## 🛡️ Security

The application uses Electron security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- Preload script for secure IPC communication

## 📝 Notes

- This is a **UI prototype** - buttons are clickable but don't perform actions yet
- Console logs are added to verify button clicks (check DevTools)
- All components are modular and ready for functionality integration

## 🐛 Troubleshooting

**Window doesn't open:**
- Make sure port 5173 is not in use
- Check that Node.js and npm are properly installed

**Styles not loading:**
- Clear the Vite cache: `rm -rf node_modules/.vite`
- Reinstall dependencies: `npm install`

**Electron won't start:**
- Wait for the Vite dev server to fully start
- Check console for any error messages

## 📄 License

MIT

## 👨‍💻 Development

To modify the UI:
1. Edit components in `src/components/`
2. The app will hot-reload automatically in dev mode
3. Use TailwindCSS classes for styling

To add functionality:
1. Implement handler functions in `App.jsx`
2. Add IPC communication in `preload.js` and `main.js` as needed
3. Integrate external APIs (Firebase, Whisper, GPT)


