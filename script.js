// Global variables
let recognition;
let isRecording = false;
let isPaused = false;
let transcript = '';
let finalTranscript = '';
let interimTranscript = '';
let meetingData = {
    transcript: '',
    summary: '',
    startTime: null,
    endTime: null
};

// DOM elements
const startMeetingBtn = document.getElementById('startMeeting');
const meetingInterface = document.getElementById('meetingInterface');
const backToHomeBtn = document.getElementById('backToHome');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const pauseBtn = document.getElementById('pauseBtn');
const recordingIndicator = document.getElementById('recordingIndicator');
const recordingText = document.getElementById('recordingText');
const transcriptDiv = document.getElementById('transcript');
const summaryDiv = document.getElementById('summary');
const downloadTranscriptBtn = document.getElementById('downloadTranscript');
const downloadSummaryBtn = document.getElementById('downloadSummary');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    setupEventListeners();
    checkBrowserSupport();
    addScrollAnimations();
    addInteractiveEffects();
});

// Check browser support for Web Speech API
function checkBrowserSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari.');
        return false;
    }
    return true;
}

// Initialize speech recognition
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        console.log('Speech recognition started');
        isRecording = true;
        updateRecordingUI(true);
    };
    
    recognition.onresult = function(event) {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Also add interim results to final transcript if no final results yet
        if (finalTranscript.trim() === '' && interimTranscript.trim() !== '') {
            finalTranscript = interimTranscript;
        }
        
        updateTranscriptDisplay();
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        handleRecognitionError(event.error);
    };
    
    recognition.onend = function() {
        console.log('Speech recognition ended');
        if (isRecording && !isPaused) {
            // Restart recognition if it was stopped unexpectedly
            setTimeout(() => {
                if (isRecording && !isPaused) {
                    recognition.start();
                }
            }, 100);
        }
    };
}

// Setup event listeners
function setupEventListeners() {
    startMeetingBtn.addEventListener('click', startMeeting);
    backToHomeBtn.addEventListener('click', backToHome);
    recordBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    pauseBtn.addEventListener('click', togglePause);
    downloadTranscriptBtn.addEventListener('click', downloadTranscript);
    downloadSummaryBtn.addEventListener('click', downloadSummary);
    
    // Chat event listeners
    setupChatEventListeners();
}

// Start meeting interface
function startMeeting() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.querySelector('.how-it-works').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    meetingInterface.classList.remove('hidden');
    
    meetingData.startTime = new Date();
    resetMeetingData();
}

// Back to home
function backToHome() {
    if (isRecording) {
        if (confirm('Are you sure you want to leave? Your current recording will be lost.')) {
            stopRecording();
            showHomePage();
        }
    } else {
        showHomePage();
    }
}

// Show home page
function showHomePage() {
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
    document.querySelector('.how-it-works').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    meetingInterface.classList.add('hidden');
}

// Start recording
function startRecording() {
    if (!checkBrowserSupport()) return;
    
    try {
        recognition.start();
        meetingData.startTime = new Date();
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        pauseBtn.disabled = false;
    } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Error starting speech recognition. Please try again.');
    }
}

// Stop recording
function stopRecording() {
    isRecording = false;
    isPaused = false;
    
    // Finalize transcript by adding any interim results
    if (interimTranscript.trim() !== '') {
        finalTranscript += interimTranscript + ' ';
        interimTranscript = '';
        updateTranscriptDisplay();
    }
    
    recognition.stop();
    
    recordBtn.disabled = false;
    stopBtn.disabled = true;
    pauseBtn.disabled = true;
    
    updateRecordingUI(false);
    meetingData.endTime = new Date();
    
    // Generate summary
    generateSummary();
}

// Toggle pause
function togglePause() {
    if (isPaused) {
        // Resume
        recognition.start();
        isPaused = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        updateRecordingUI(true);
    } else {
        // Pause
        recognition.stop();
        isPaused = true;
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        updateRecordingUI(false);
    }
}

// Update recording UI
function updateRecordingUI(recording) {
    if (recording) {
        recordingIndicator.classList.add('recording');
        recordingText.textContent = 'Recording...';
    } else {
        recordingIndicator.classList.remove('recording');
        recordingText.textContent = isPaused ? 'Paused' : 'Ready to Record';
    }
}

// Update transcript display
function updateTranscriptDisplay() {
    const fullTranscript = finalTranscript + interimTranscript;
    transcriptDiv.innerHTML = fullTranscript || '<p class="placeholder">Your meeting transcript will appear here...</p>';
    
    // Auto-scroll to bottom
    transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
}

// Handle recognition errors
function handleRecognitionError(error) {
    let errorMessage = 'Speech recognition error: ';
    
    switch (error) {
        case 'no-speech':
            errorMessage += 'No speech detected. Please try again.';
            break;
        case 'audio-capture':
            errorMessage += 'No microphone found. Please check your microphone.';
            break;
        case 'not-allowed':
            errorMessage += 'Microphone access denied. Please allow microphone access.';
            break;
        case 'network':
            errorMessage += 'Network error. Please check your internet connection.';
            break;
        default:
            errorMessage += error;
    }
    
    alert(errorMessage);
    
    // Reset UI
    isRecording = false;
    isPaused = false;
    recordBtn.disabled = false;
    stopBtn.disabled = true;
    pauseBtn.disabled = true;
    updateRecordingUI(false);
}

// Generate AI summary
async function generateSummary() {
    let transcriptText = finalTranscript.trim();
    
    // Fallback: if finalTranscript is empty, try to get text from the transcript display
    if (!transcriptText) {
        const transcriptElement = document.getElementById('transcript');
        if (transcriptElement) {
            transcriptText = transcriptElement.textContent.trim();
        }
    }
    
    if (!transcriptText) {
        console.log('No transcript text found. finalTranscript:', finalTranscript);
        console.log('Transcript element content:', document.getElementById('transcript')?.textContent);
        summaryDiv.innerHTML = '<p class="placeholder">No transcript available for summarization.</p>';
        return;
    }
    
    console.log('Generating summary for transcript:', transcriptText);
    summaryDiv.innerHTML = '<p class="placeholder">🤖 AI is analyzing your meeting content...</p>';
    
    try {
        // Call the backend API for enhanced summarization
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcript: transcriptText,
                meetingType: 'general'
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate summary');
        }
        
        const data = await response.json();
        const summary = data.summary;
        
        meetingData.summary = summary;
        meetingData.transcript = transcriptText;
        
        summaryDiv.innerHTML = formatSummary(summary);
        
        // Enable download buttons
        downloadTranscriptBtn.disabled = false;
        downloadSummaryBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating summary:', error);
        // Fallback to local summarization if API fails
        const summary = createAdvancedAISummary(transcriptText);
        meetingData.summary = summary;
        meetingData.transcript = transcriptText;
        summaryDiv.innerHTML = formatSummary(summary);
        downloadTranscriptBtn.disabled = false;
        downloadSummaryBtn.disabled = false;
    }
}

// Create advanced AI summary with intelligent processing
function createAdvancedAISummary(transcript) {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = transcript.toLowerCase().split(/\s+/);
    
    // Advanced keyword extraction with TF-IDF-like scoring
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'so', 'very', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'once']);
    
    const wordFreq = {};
    words.forEach((word, index) => {
        const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
        if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
    });
    
    // Calculate importance scores
    const totalWords = words.length;
    const keyTopics = Object.entries(wordFreq)
        .map(([word, freq]) => ({
            word,
            freq,
            score: freq * Math.log(totalWords / freq)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(item => item.word);
    
    // Generate AI-powered insights instead of copying sentences
    const aiInsights = generateAIInsights(transcript, keyTopics);
    
    // Extract and reformulate action items
    const actionItems = extractAndReformulateActionItems(transcript);
    
    // Extract and reformulate decisions
    const decisions = extractAndReformulateDecisions(transcript);
    
    // Extract key metrics and numbers
    const metrics = extractMetrics(transcript);
    
    // Generate comprehensive insights
    const insights = generateComprehensiveInsights(transcript, keyTopics);
    
    return {
        keyTopics: keyTopics,
        bulletPoints: aiInsights, // Now contains AI-generated insights, not copied sentences
        actionItems: actionItems,
        decisions: decisions,
        metrics: metrics,
        insights: insights,
        meetingDuration: calculateMeetingDuration(),
        wordCount: words.length,
        sentenceCount: sentences.length
    };
}

// Calculate sentence importance score
function calculateSentenceScore(sentence, keyTopics, wordFreq) {
    const lowerSentence = sentence.toLowerCase();
    let score = 0;
    
    // Length bonus (not too short, not too long)
    const length = sentence.length;
    if (length > 30 && length < 150) score += 2;
    
    // Keyword presence
    keyTopics.forEach(topic => {
        if (lowerSentence.includes(topic)) {
            score += wordFreq[topic] || 1;
        }
    });
    
    // Important words/phrases
    const importantPhrases = [
        'important', 'key', 'critical', 'essential', 'main', 'primary',
        'decision', 'conclusion', 'agreement', 'consensus', 'resolution',
        'action', 'task', 'next step', 'follow up', 'deadline', 'due',
        'budget', 'cost', 'price', 'revenue', 'profit', 'growth',
        'problem', 'issue', 'challenge', 'solution', 'improvement',
        'goal', 'objective', 'target', 'milestone', 'success'
    ];
    
    importantPhrases.forEach(phrase => {
        if (lowerSentence.includes(phrase)) score += 3;
    });
    
    // Question sentences (often important)
    if (sentence.includes('?')) score += 1;
    
    // Exclamation sentences (often important)
    if (sentence.includes('!')) score += 1;
    
    return score;
}

// Extract metrics and numbers from transcript
function extractMetrics(transcript) {
    const metrics = [];
    
    // Find percentages
    const percentages = transcript.match(/\d+%/g);
    if (percentages) {
        metrics.push(`Key percentages mentioned: ${percentages.join(', ')}`);
    }
    
    // Find dollar amounts
    const dollarAmounts = transcript.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (dollarAmounts) {
        metrics.push(`Financial figures: ${dollarAmounts.join(', ')}`);
    }
    
    // Find dates
    const dates = transcript.match(/\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s+\d{4})?/gi);
    if (dates) {
        metrics.push(`Important dates: ${dates.join(', ')}`);
    }
    
    // Find time references
    const times = transcript.match(/\b\d{1,2}:\d{2}\s*(?:am|pm)?\b/gi);
    if (times) {
        metrics.push(`Time references: ${times.join(', ')}`);
    }
    
    return metrics;
}

// Generate AI-powered insights that understand and interpret the content
function generateAIInsights(transcript, keyTopics) {
    const lowerTranscript = transcript.toLowerCase();
    const insights = [];
    
    // For very short transcripts, generate basic insights
    if (transcript.split(/\s+/).length < 10) {
        insights.push(`Brief discussion covering ${keyTopics.slice(0, 3).join(', ')}`);
        insights.push(`Key focus areas identified: ${keyTopics.slice(0, 5).join(', ')}`);
        return insights;
    }
    
    // Analyze meeting context and generate original insights
    const context = analyzeMeetingContext(transcript);
    
    // Generate insights based on understanding, not copying
    if (context.hasFinancialDiscussion) {
        insights.push(`The discussion centered around financial planning with a focus on ${context.financialFocus.join(', ')}`);
    }
    
    if (context.hasProjectManagement) {
        insights.push(`Project management was a key theme, with emphasis on ${context.projectAspects.join(', ')}`);
    }
    
    if (context.hasTeamDiscussion) {
        insights.push(`Team dynamics and personnel matters were addressed, particularly around ${context.teamFocus.join(', ')}`);
    }
    
    if (context.hasTechnicalContent) {
        insights.push(`Technical aspects were discussed, including ${context.technicalTopics.join(', ')}`);
    }
    
    if (context.hasCustomerFocus) {
        insights.push(`Customer satisfaction and service quality were important discussion points`);
    }
    
    if (context.hasStrategicPlanning) {
        insights.push(`Strategic planning and future direction were key elements of the conversation`);
    }
    
    if (context.hasProblemSolving) {
        insights.push(`Problem-solving and issue resolution were central to the meeting's agenda`);
    }
    
    if (context.hasGrowthDiscussion) {
        insights.push(`Growth opportunities and expansion plans were explored`);
    }
    
    if (context.hasTimelineConcerns) {
        insights.push(`Timeline management and deadline adherence were important considerations`);
    }
    
    if (context.hasResourceAllocation) {
        insights.push(`Resource allocation and budget distribution were key decision points`);
    }
    
    // If no specific insights were generated, create general ones based on key topics
    if (insights.length === 0) {
        insights.push(`Discussion focused on ${keyTopics.slice(0, 3).join(', ')}`);
        insights.push(`Key themes identified: ${keyTopics.slice(0, 5).join(', ')}`);
    }
    
    return insights.slice(0, 6); // Limit to 6 most relevant insights
}

// Analyze meeting context to understand what was discussed
function analyzeMeetingContext(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    return {
        hasFinancialDiscussion: /budget|cost|revenue|profit|investment|financial|money|dollar|price/.test(lowerTranscript),
        financialFocus: extractFinancialTopics(lowerTranscript),
        
        hasProjectManagement: /project|timeline|deadline|milestone|schedule|planning|roadmap/.test(lowerTranscript),
        projectAspects: extractProjectTopics(lowerTranscript),
        
        hasTeamDiscussion: /team|staff|employee|hire|hiring|personnel|workforce|collaboration/.test(lowerTranscript),
        teamFocus: extractTeamTopics(lowerTranscript),
        
        hasTechnicalContent: /technical|code|development|system|api|database|software|technology|bug|feature/.test(lowerTranscript),
        technicalTopics: extractTechnicalTopics(lowerTranscript),
        
        hasCustomerFocus: /customer|client|user|satisfaction|service|support|experience/.test(lowerTranscript),
        
        hasStrategicPlanning: /strategy|strategic|plan|planning|vision|goal|objective|target|future/.test(lowerTranscript),
        
        hasProblemSolving: /problem|issue|challenge|difficulty|concern|trouble|fix|resolve|solution/.test(lowerTranscript),
        
        hasGrowthDiscussion: /growth|expand|increase|scale|development|improvement|progress/.test(lowerTranscript),
        
        hasTimelineConcerns: /urgent|deadline|timeline|schedule|time|asap|immediately|quickly/.test(lowerTranscript),
        
        hasResourceAllocation: /resource|allocation|budget|funding|investment|spend|cost|allocate/.test(lowerTranscript)
    };
}

// Extract specific topics for each category
function extractFinancialTopics(transcript) {
    const topics = [];
    if (/budget|budgeting/.test(transcript)) topics.push('budget planning');
    if (/revenue|income/.test(transcript)) topics.push('revenue generation');
    if (/cost|expense/.test(transcript)) topics.push('cost management');
    if (/investment|invest/.test(transcript)) topics.push('investment strategy');
    if (/profit|profitability/.test(transcript)) topics.push('profitability analysis');
    return topics;
}

function extractProjectTopics(transcript) {
    const topics = [];
    if (/timeline|schedule/.test(transcript)) topics.push('timeline management');
    if (/deadline|due/.test(transcript)) topics.push('deadline adherence');
    if (/milestone|phase/.test(transcript)) topics.push('milestone tracking');
    if (/planning|roadmap/.test(transcript)) topics.push('strategic planning');
    return topics;
}

function extractTeamTopics(transcript) {
    const topics = [];
    if (/hire|hiring/.test(transcript)) topics.push('recruitment');
    if (/collaboration|teamwork/.test(transcript)) topics.push('team collaboration');
    if (/training|development/.test(transcript)) topics.push('skill development');
    if (/performance|productivity/.test(transcript)) topics.push('performance management');
    return topics;
}

function extractTechnicalTopics(transcript) {
    const topics = [];
    if (/development|develop/.test(transcript)) topics.push('software development');
    if (/system|systems/.test(transcript)) topics.push('system architecture');
    if (/api|database/.test(transcript)) topics.push('technical infrastructure');
    if (/bug|issue|fix/.test(transcript)) topics.push('problem resolution');
    return topics;
}

// Extract and reformulate action items with AI interpretation
function extractAndReformulateActionItems(transcript) {
    const actionPatterns = [
        /(?:need to|should|must|have to|got to|gotta)\s+([^.!?]+)/gi,
        /(?:action|task|todo|follow up|next step)[s]?\s*:?\s*([^.!?]+)/gi,
        /(?:assign|delegate|responsible for)\s+([^.!?]+)/gi,
        /(?:deadline|due|by)\s+([^.!?]+)/gi,
        /(?:complete|finish|implement|create|update|review)\s+([^.!?]+)/gi
    ];
    
    const rawActions = [];
    actionPatterns.forEach(pattern => {
        const matches = transcript.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const cleanAction = match.replace(/^(?:need to|should|must|have to|got to|gotta|action|task|todo|follow up|next step|assign|delegate|responsible for|deadline|due|by|complete|finish|implement|create|update|review)[s]?\s*:?\s*/i, '').trim();
                if (cleanAction.length > 10 && cleanAction.length < 100) {
                    rawActions.push(cleanAction);
                }
            });
        }
    });
    
    // Reformulate actions with AI interpretation
    return rawActions.slice(0, 5).map(action => {
        // Add context and make it more actionable
        if (action.includes('update') || action.includes('modify')) {
            return `Update and refine ${action.toLowerCase()}`;
        } else if (action.includes('create') || action.includes('develop')) {
            return `Develop and implement ${action.toLowerCase()}`;
        } else if (action.includes('review') || action.includes('analyze')) {
            return `Conduct thorough review of ${action.toLowerCase()}`;
        } else {
            return `Execute ${action.toLowerCase()}`;
        }
    });
}

// Extract and reformulate decisions with AI interpretation
function extractAndReformulateDecisions(transcript) {
    const decisionPatterns = [
        /(?:decided|agreed|concluded|resolved|approved|rejected|chose|selected|voted|consensus)\s+([^.!?]+)/gi,
        /(?:we will|we'll|going to|plan to)\s+([^.!?]+)/gi,
        /(?:final decision|conclusion|outcome)\s*:?\s*([^.!?]+)/gi
    ];
    
    const rawDecisions = [];
    decisionPatterns.forEach(pattern => {
        const matches = transcript.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const cleanDecision = match.replace(/^(?:decided|agreed|concluded|resolved|approved|rejected|chose|selected|voted|consensus|we will|we'll|going to|plan to|final decision|conclusion|outcome)[s]?\s*:?\s*/i, '').trim();
                if (cleanDecision.length > 10 && cleanDecision.length < 100) {
                    rawDecisions.push(cleanDecision);
                }
            });
        }
    });
    
    // Reformulate decisions with AI interpretation
    return rawDecisions.slice(0, 4).map(decision => {
        // Add context and make it more professional
        if (decision.includes('hire') || decision.includes('recruit')) {
            return `Approved recruitment strategy for ${decision.toLowerCase()}`;
        } else if (decision.includes('budget') || decision.includes('cost')) {
            return `Budget allocation decision: ${decision.toLowerCase()}`;
        } else if (decision.includes('timeline') || decision.includes('schedule')) {
            return `Timeline adjustment: ${decision.toLowerCase()}`;
        } else {
            return `Strategic decision: ${decision.toLowerCase()}`;
        }
    });
}

// Generate comprehensive insights based on content analysis
function generateComprehensiveInsights(transcript, keyTopics) {
    const insights = [];
    const lowerTranscript = transcript.toLowerCase();
    
    // Sentiment analysis with AI interpretation
    const positiveWords = ['good', 'great', 'excellent', 'successful', 'positive', 'improved', 'better', 'achieved', 'completed', 'won', 'gained', 'progress', 'growth', 'increase', 'upgrade'];
    const negativeWords = ['bad', 'poor', 'failed', 'problem', 'issue', 'challenge', 'difficult', 'struggle', 'lost', 'declined', 'worse', 'decrease', 'concern', 'risk', 'threat'];
    
    const positiveCount = positiveWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    const negativeCount = negativeWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    
    if (positiveCount > negativeCount * 1.5) {
        insights.push('The meeting demonstrated an optimistic and forward-looking approach with strong team confidence');
    } else if (negativeCount > positiveCount * 1.5) {
        insights.push('The discussion focused on addressing challenges and implementing solutions');
    } else if (positiveCount > 0 && negativeCount > 0) {
        insights.push('A balanced approach was taken, addressing both opportunities and challenges');
    }
    
    // Action-oriented analysis
    const actionWords = ['action', 'task', 'todo', 'next step', 'follow up', 'assign', 'responsible', 'deadline', 'complete', 'implement'];
    const actionCount = actionWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    
    if (actionCount > 5) {
        insights.push('The meeting was highly productive with multiple concrete action items identified');
    } else if (actionCount > 2) {
        insights.push('Several actionable outcomes were established during the discussion');
    }
    
    // Decision-making analysis
    const decisionWords = ['decided', 'agreed', 'concluded', 'consensus', 'approved', 'chose'];
    const decisionCount = decisionWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    
    if (decisionCount > 3) {
        insights.push('Multiple strategic decisions were reached through collaborative discussion');
    }
    
    // Time-sensitive analysis
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('asap') || lowerTranscript.includes('immediately')) {
        insights.push('Time-sensitive matters requiring immediate attention were prioritized');
    }
    
    return insights;
}

// Format summary for display
function formatSummary(summary) {
    let html = '<div class="summary-content">';
    
    // AI Summary from Hugging Face (if available)
    if (summary.aiSummary) {
        html += '<h5><i class="fas fa-robot"></i> AI Summary</h5>';
        html += `<div class="ai-summary">${summary.aiSummary}</div>`;
    }
    
    // Key Topics (Real and Legitimate)
    if (summary.keyTopics && summary.keyTopics.length > 0) {
        html += '<h5><i class="fas fa-tags"></i> Key Topics</h5>';
        html += '<div class="topics">';
        summary.keyTopics.forEach(topic => {
            html += `<span class="topic-tag">${topic}</span>`;
        });
        html += '</div>';
    }
    
    // Intelligent Insights (AI Understanding)
    if (summary.intelligentInsights && summary.intelligentInsights.length > 0) {
        html += '<h5><i class="fas fa-brain"></i> AI Understanding</h5>';
        html += '<ul class="insights-list">';
        summary.intelligentInsights.forEach(insight => {
            html += `<li class="insight-item">${insight}</li>`;
        });
        html += '</ul>';
    }
    
    // Fallback for old format insights
    else if (summary.insights && summary.insights.length > 0) {
        html += '<h5><i class="fas fa-lightbulb"></i> AI Insights</h5>';
        html += '<ul class="insights-list">';
        summary.insights.forEach(insight => {
            html += `<li class="insight-item">${insight}</li>`;
        });
        html += '</ul>';
    }
    
    // Key Discussion Points (Legacy support)
    if (summary.bulletPoints && summary.bulletPoints.length > 0) {
        html += '<h5><i class="fas fa-list-ul"></i> Key Discussion Points</h5>';
        html += '<ul class="bullet-points">';
        summary.bulletPoints.forEach(point => {
            html += `<li>${point}</li>`;
        });
        html += '</ul>';
    } else if (!summary.intelligentInsights || summary.intelligentInsights.length === 0) {
        // Fallback for when no insights are generated
        html += '<h5><i class="fas fa-list-ul"></i> Key Discussion Points</h5>';
        html += '<ul class="bullet-points">';
        html += '<li>Meeting content analysis in progress...</li>';
        html += '</ul>';
    }
    
    // Decisions Made
    if (summary.decisions && summary.decisions.length > 0) {
        html += '<h5><i class="fas fa-gavel"></i> Decisions Made</h5>';
        html += '<ul class="decisions-list">';
        summary.decisions.forEach(decision => {
            html += `<li class="decision-item">${decision}</li>`;
        });
        html += '</ul>';
    }
    
    // Action Items
    if (summary.actionItems && summary.actionItems.length > 0) {
        html += '<h5><i class="fas fa-tasks"></i> Action Items</h5>';
        html += '<ul class="action-items">';
        summary.actionItems.forEach(item => {
            html += `<li class="action-item">${item}</li>`;
        });
        html += '</ul>';
    }
    
    // Key Metrics
    if (summary.metrics && summary.metrics.length > 0) {
        html += '<h5><i class="fas fa-chart-line"></i> Key Metrics</h5>';
        html += '<ul class="metrics-list">';
        summary.metrics.forEach(metric => {
            html += `<li class="metric-item">${metric}</li>`;
        });
        html += '</ul>';
    }
    
    // Meeting Statistics
    html += '<h5><i class="fas fa-chart-bar"></i> Meeting Statistics</h5>';
    html += '<div class="meeting-stats">';
    html += `<p><strong>Duration:</strong> ${summary.meetingDuration || 'Unknown'}</p>`;
    html += `<p><strong>Words:</strong> ${summary.wordCount || 0}</p>`;
    html += `<p><strong>Sentences:</strong> ${summary.sentenceCount || 0}</p>`;
    if (summary.metrics && summary.metrics.length > 0) {
        html += `<p><strong>Key Metrics Found:</strong> ${summary.metrics.length}</p>`;
    }
    html += '</div>';
    
    html += '</div>';
    return html;
}

// Calculate meeting duration
function calculateMeetingDuration() {
    if (!meetingData.startTime || !meetingData.endTime) {
        return 'Unknown';
    }
    
    const duration = meetingData.endTime - meetingData.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
}

// Download transcript
function downloadTranscript() {
    if (!meetingData.transcript) {
        alert('No transcript available to download.');
        return;
    }
    
    const content = `Meeting Transcript\n\nDate: ${new Date().toLocaleDateString()}\nDuration: ${calculateMeetingDuration()}\n\n${meetingData.transcript}`;
    downloadFile(content, 'meeting-transcript.txt');
}

// Download summary
function downloadSummary() {
    if (!meetingData.summary) {
        alert('No summary available to download.');
        return;
    }
    
    const summary = meetingData.summary;
    let content = `Meeting Summary\n\nDate: ${new Date().toLocaleDateString()}\nDuration: ${summary.meetingDuration}\n\n`;
    
    if (summary.keyTopics.length > 0) {
        content += `Key Topics: ${summary.keyTopics.join(', ')}\n\n`;
    }
    
    if (summary.bulletPoints.length > 0) {
        content += `Key Points:\n`;
        summary.bulletPoints.forEach((point, index) => {
            content += `${index + 1}. ${point}\n`;
        });
        content += '\n';
    }
    
    if (summary.actionItems.length > 0) {
        content += `Action Items:\n`;
        summary.actionItems.forEach((item, index) => {
            content += `${index + 1}. ${item}\n`;
        });
        content += '\n';
    }
    
    content += `Meeting Statistics:\n`;
    content += `- Duration: ${summary.meetingDuration}\n`;
    content += `- Words: ${summary.wordCount}\n`;
    content += `- Sentences: ${summary.sentenceCount}\n`;
    
    downloadFile(content, 'meeting-summary.txt');
}

// Download file utility
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Reset meeting data
function resetMeetingData() {
    transcript = '';
    finalTranscript = '';
    interimTranscript = '';
    meetingData = {
        transcript: '',
        summary: '',
        startTime: null,
        endTime: null
    };
    
    transcriptDiv.innerHTML = '<p class="placeholder">Your meeting transcript will appear here...</p>';
    summaryDiv.innerHTML = '<p class="placeholder">AI-generated summary will appear here...</p>';
    
    downloadTranscriptBtn.disabled = true;
    downloadSummaryBtn.disabled = true;
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Observe steps
    document.querySelectorAll('.step').forEach(step => {
        step.style.opacity = '0';
        observer.observe(step);
    });
}

// Add interactive effects
function addInteractiveEffects() {
    // Add hover effects to buttons
    document.querySelectorAll('.control-btn, .export-btn, .cta-button').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Add click ripple effect
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add typing effect to hero text
    const heroText = document.querySelector('.hero-content h2');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Add CSS for summary formatting and ripple effect
const style = document.createElement('style');
style.textContent = `
    .summary-content h5 {
        color: #333;
        margin: 20px 0 10px 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .topics {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .topic-tag {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .bullet-points, .action-items {
        margin-left: 20px;
        margin-bottom: 15px;
    }
    
    .bullet-points li, .action-items li {
        margin-bottom: 8px;
        line-height: 1.5;
    }
    
    .action-items li {
        color: #e74c3c;
        font-weight: 500;
    }
    
    .meeting-stats {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid #667eea;
    }
    
    .meeting-stats p {
        margin: 5px 0;
        color: #555;
    }
    
    .insights-list, .decisions-list, .metrics-list {
        margin-left: 20px;
        margin-bottom: 15px;
    }
    
    .insight-item, .decision-item, .metric-item {
        margin-bottom: 8px;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
        background: rgba(102, 126, 234, 0.05);
        border-left: 3px solid #667eea;
    }
    
    .insight-item {
        color: #2d3748;
        font-weight: 500;
    }
    
    .decision-item {
        color: #2b6cb0;
        font-weight: 600;
    }
    
    .metric-item {
        color: #38a169;
        font-weight: 500;
    }
    
    .action-item {
        color: #e53e3e;
        font-weight: 600;
        background: rgba(229, 62, 62, 0.05);
        padding: 8px 12px;
        border-radius: 8px;
        border-left: 3px solid #e53e3e;
        margin-bottom: 8px;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== AI CHAT ASSISTANT FUNCTIONALITY ====================

// Chat variables
let chatMessages = [];
let isTyping = false;

// Setup chat event listeners
function setupChatEventListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    if (chatInput && sendBtn) {
        // Send message on button click
        sendBtn.addEventListener('click', sendChatMessage);
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        
        // Enable/disable send button based on input
        chatInput.addEventListener('input', function() {
            sendBtn.disabled = !this.value.trim();
        });
    }
    
    // Setup suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            if (question) {
                document.getElementById('chatInput').value = question;
                sendChatMessage();
            }
        });
    });
}

// Send chat message
async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Clear input and disable send button
    chatInput.value = '';
    document.getElementById('sendMessage').disabled = true;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const response = await getAIResponse(message);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addChatMessage(response, 'ai');
        
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

// Add message to chat
function addChatMessage(message, sender) {
    const chatMessagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    
    // Store message
    chatMessages.push({ message, sender, timestamp: new Date() });
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    const chatMessagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span>AI is thinking</span>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get AI response
async function getAIResponse(userMessage) {
    try {
        // Get current meeting context
        const transcript = finalTranscript || document.getElementById('transcript').textContent || '';
        const summary = meetingData.summary || {};
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                transcript: transcript,
                summary: summary,
                chatHistory: chatMessages.slice(-10) // Last 10 messages for context
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get AI response');
        }
        
        const data = await response.json();
        return data.response;
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        // Fallback response
        return generateFallbackResponse(userMessage, transcript, summary);
    }
}

// Generate fallback response when API fails
function generateFallbackResponse(userMessage, transcript, summary) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for common questions
    if (lowerMessage.includes('decision') || lowerMessage.includes('decided')) {
        if (summary.decisions && summary.decisions.length > 0) {
            return `Based on the meeting, here are the key decisions made:\n\n• ${summary.decisions.join('\n• ')}`;
        } else {
            return 'I don\'t see any specific decisions mentioned in the meeting transcript.';
        }
    }
    
    if (lowerMessage.includes('action') || lowerMessage.includes('todo') || lowerMessage.includes('task')) {
        if (summary.actionItems && summary.actionItems.length > 0) {
            return `Here are the action items from the meeting:\n\n• ${summary.actionItems.join('\n• ')}`;
        } else {
            return 'No specific action items were identified in the meeting.';
        }
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money')) {
        if (summary.metrics && summary.metrics.length > 0) {
            const financialMetrics = summary.metrics.filter(m => m.includes('$') || m.includes('%'));
            if (financialMetrics.length > 0) {
                return `Financial information mentioned in the meeting:\n\n• ${financialMetrics.join('\n• ')}`;
            }
        }
        return 'I don\'t see specific budget or financial information in the meeting transcript.';
    }
    
    if (lowerMessage.includes('who') || lowerMessage.includes('responsible')) {
        return 'I can help you find information about responsibilities. Could you be more specific about what you\'re looking for? For example, "Who is responsible for the marketing strategy?"';
    }
    
    if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
        if (summary.aiSummary) {
            return `Here's the AI summary of the meeting:\n\n${summary.aiSummary}`;
        } else if (transcript) {
            return 'I can see the meeting transcript, but no AI summary is available yet. Would you like me to help you find specific information from the transcript?';
        } else {
            return 'No meeting content is available to summarize. Please record a meeting first.';
        }
    }
    
    if (lowerMessage.includes('topic') || lowerMessage.includes('discuss')) {
        if (summary.keyTopics && summary.keyTopics.length > 0) {
            return `The main topics discussed in the meeting were:\n\n• ${summary.keyTopics.join('\n• ')}`;
        } else {
            return 'I can see the meeting transcript, but I need to analyze it to identify the key topics. Would you like me to help you find specific information?';
        }
    }
    
    // Default response
    return 'I understand you\'re asking about the meeting. Could you be more specific? I can help you find information about decisions, action items, budget discussions, or any other topics covered in the meeting.';
}
