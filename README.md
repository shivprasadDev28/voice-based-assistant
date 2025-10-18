# AI Meeting Assistant

A voice-based AI meeting assistant that provides real-time transcription, AI-powered summarization, and downloadable meeting notes.

## Features

- 🎤 **Real-time Voice Recording** - Uses Web Speech API for high-quality audio capture
- 📝 **Live Transcription** - Converts speech to text in real-time
- 🤖 **AI Summarization** - Generates intelligent bullet points and key insights
- 📊 **Meeting Analytics** - Provides meeting duration, word count, and readability metrics
- 💾 **Export Options** - Download transcripts and summaries in text format
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful, intuitive interface

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Speech Recognition**: Web Speech API
- **AI Processing**: Custom summarization algorithms
- **Styling**: Modern CSS with gradients and animations

## Prerequisites

- Node.js (version 14 or higher)
- A modern web browser (Chrome, Edge, or Safari recommended)
- Microphone access

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-meeting-assistant.git
   cd ai-meeting-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Starting a Meeting

1. Click "Start Meeting Assistant" on the landing page
2. Grant microphone permissions when prompted
3. Click "Start Recording" to begin capturing audio
4. Speak naturally - your speech will be transcribed in real-time

### During the Meeting

- **Pause/Resume**: Use the pause button to temporarily stop recording
- **Live Transcript**: Watch your speech converted to text in real-time
- **AI Summary**: View AI-generated bullet points and key insights

### After the Meeting

1. Click "Stop Recording" to end the session
2. Review the generated summary and transcript
3. Download the transcript or summary using the export buttons
4. Click "Back to Home" to start a new meeting

## API Endpoints

### POST /api/summarize
Enhanced AI summarization with meeting type support.

**Request Body:**
```json
{
  "transcript": "Your meeting transcript here...",
  "meetingType": "business" // optional: "business", "technical", "general"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "keyTopics": ["topic1", "topic2"],
    "bulletPoints": ["point1", "point2"],
    "actionItems": ["action1", "action2"],
    "decisions": ["decision1", "decision2"],
    "metrics": {
      "wordCount": 500,
      "sentenceCount": 25,
      "estimatedDuration": "10 minutes",
      "averageWordsPerMinute": 50,
      "readabilityScore": 75
    }
  }
}
```

### POST /api/save-meeting
Save meeting data for future reference.

### GET /api/meetings
Retrieve meeting history.

### GET /api/meetings/:id
Get specific meeting details.

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Safari
- ❌ Firefox (limited Web Speech API support)

## Troubleshooting

### Microphone Issues
- Ensure microphone permissions are granted
- Check if another application is using the microphone
- Try refreshing the page and granting permissions again

### Speech Recognition Not Working
- Use a supported browser (Chrome, Edge, or Safari)
- Check your internet connection
- Speak clearly and at a normal pace
- Reduce background noise

### Performance Issues
- Close other browser tabs to free up memory
- Ensure stable internet connection
- Use a modern device with sufficient processing power

## Development

### Running in Development Mode
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Project Structure
```
ai-meeting-assistant/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend
├── package.json        # Dependencies
├── README.md           # This file
└── data/               # Meeting data storage (created automatically)
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Web Speech API for speech recognition capabilities
- Font Awesome for icons
- Google Fonts for typography
- The open-source community for inspiration and tools

## Support

For support, email support@aimeetingassistant.com or create an issue in the GitHub repository.

---

**Note**: This application requires microphone access and works best in a quiet environment. The AI summarization is currently using simplified algorithms - for production use, consider integrating with advanced AI services like OpenAI or Google AI.
