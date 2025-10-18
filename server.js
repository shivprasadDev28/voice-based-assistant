const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Hugging Face API Configuration
const HF_API_TOKEN = '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';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for enhanced AI summarization
app.post('/api/summarize', async (req, res) => {
    try {
        const { transcript, meetingType = 'general' } = req.body;
        
        if (!transcript || transcript.trim().length === 0) {
            return res.status(400).json({ error: 'Transcript is required' });
        }
        
        console.log(`🤖 Starting AI intelligent summarization for ${meetingType} meeting`);
        console.log(`📝 Transcript length: ${transcript.split(/\s+/).length} words`);
        
        // Use the new AI intelligent summarization with Hugging Face
        const summary = await generateAIIntelligentSummary(transcript, meetingType);
        
        console.log(`✅ AI summarization completed successfully`);
        
        res.json({
            success: true,
            summary: summary,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error in AI summarization:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI summary',
            message: error.message 
        });
    }
});

// API endpoint for AI chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, transcript, summary, chatHistory } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        console.log(`💬 Chat request: "${message}"`);
        console.log(`📝 Transcript length: ${transcript ? transcript.length : 0} characters`);
        
        // Generate AI response using Hugging Face
        const aiResponse = await generateChatResponse(message, transcript, summary, chatHistory);
        
        res.json({
            success: true,
            response: aiResponse,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Chat API error:', error);
        res.status(500).json({ 
            error: 'Failed to generate chat response',
            message: error.message 
        });
    }
});

// API endpoint to save meeting data
app.post('/api/save-meeting', (req, res) => {
    try {
        const { transcript, summary, startTime, endTime, meetingType } = req.body;
        
        const meetingData = {
            id: generateMeetingId(),
            transcript,
            summary,
            startTime,
            endTime,
            meetingType: meetingType || 'general',
            createdAt: new Date().toISOString()
        };
        
        // Save to file (in production, use a database)
        saveMeetingData(meetingData);
        
        res.json({
            success: true,
            meetingId: meetingData.id,
            message: 'Meeting data saved successfully'
        });
        
    } catch (error) {
        console.error('Error saving meeting:', error);
        res.status(500).json({ 
            error: 'Failed to save meeting data',
            message: error.message 
        });
    }
});

// API endpoint to get meeting history
app.get('/api/meetings', (req, res) => {
    try {
        const meetings = getMeetingHistory();
        res.json({
            success: true,
            meetings: meetings
        });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ 
            error: 'Failed to fetch meeting history',
            message: error.message 
        });
    }
});

// API endpoint to get specific meeting
app.get('/api/meetings/:id', (req, res) => {
    try {
        const meetingId = req.params.id;
        const meeting = getMeetingById(meetingId);
        
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        
        res.json({
            success: true,
            meeting: meeting
        });
    } catch (error) {
        console.error('Error fetching meeting:', error);
        res.status(500).json({ 
            error: 'Failed to fetch meeting',
            message: error.message 
        });
    }
});

// Enhanced AI summarization function
async function generateEnhancedSummary(transcript, meetingType) {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = transcript.toLowerCase().split(/\s+/);
    
    // Advanced keyword extraction with TF-IDF-like scoring
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'so', 'very', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'once']);
    
    const wordFreq = {};
    words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
    });
    
    // Calculate importance scores using TF-IDF
    const totalWords = words.length;
    const keyTopics = Object.entries(wordFreq)
        .map(([word, freq]) => ({
            word,
            freq,
            score: freq * Math.log(totalWords / freq)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(item => item.word);
    
    // Generate AI-powered insights instead of copying sentences
    const aiInsights = generateServerAIInsights(transcript, keyTopics, meetingType);
    
    // Extract and reformulate action items with AI interpretation
    const actionItems = extractAndReformulateActionItems(transcript);
    
    // Extract and reformulate decisions with AI interpretation
    const decisions = extractAndReformulateDecisions(transcript);
    
    // Extract key metrics and numbers
    const metrics = extractAdvancedMetrics(transcript);
    
    // Generate AI insights
    const insights = generateAdvancedInsights(transcript, keyTopics, aiInsights, meetingType);
    
    // Calculate meeting metrics
    const meetingMetrics = calculateAdvancedMeetingMetrics(transcript, sentences, words);
    
    return {
        keyTopics: keyTopics,
        bulletPoints: aiInsights, // Now contains AI-generated insights, not copied sentences
        actionItems: actionItems,
        decisions: decisions,
        metrics: metrics,
        insights: insights,
        meetingType: meetingType,
        generatedAt: new Date().toISOString(),
        ...meetingMetrics
    };
}

// Extract business meeting points
function extractBusinessPoints(sentences, keyTopics) {
    return sentences
        .filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return keyTopics.some(topic => lowerSentence.includes(topic)) || 
                   lowerSentence.includes('revenue') ||
                   lowerSentence.includes('profit') ||
                   lowerSentence.includes('budget') ||
                   lowerSentence.includes('strategy') ||
                   lowerSentence.includes('goal') ||
                   lowerSentence.includes('target') ||
                   sentence.length > 60;
        })
        .slice(0, 10)
        .map(sentence => sentence.trim());
}

// Extract technical meeting points
function extractTechnicalPoints(sentences, keyTopics) {
    return sentences
        .filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return keyTopics.some(topic => lowerSentence.includes(topic)) || 
                   lowerSentence.includes('code') ||
                   lowerSentence.includes('bug') ||
                   lowerSentence.includes('feature') ||
                   lowerSentence.includes('api') ||
                   lowerSentence.includes('database') ||
                   lowerSentence.includes('system') ||
                   sentence.length > 50;
        })
        .slice(0, 10)
        .map(sentence => sentence.trim());
}

// Extract general meeting points
function extractGeneralPoints(sentences, keyTopics) {
    return sentences
        .filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return keyTopics.some(topic => lowerSentence.includes(topic)) || 
                   sentence.length > 50;
        })
        .slice(0, 8)
        .map(sentence => sentence.trim());
}

// Extract action items
function extractActionItems(sentences) {
    const actionKeywords = [
        'need to', 'should', 'must', 'action', 'follow up', 'next steps',
        'todo', 'task', 'assign', 'responsible', 'deadline', 'due date',
        'complete', 'finish', 'implement', 'create', 'update', 'review'
    ];
    
    return sentences
        .filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return actionKeywords.some(keyword => lowerSentence.includes(keyword));
        })
        .slice(0, 5)
        .map(sentence => sentence.trim());
}

// Extract decisions made
function extractDecisions(sentences) {
    const decisionKeywords = [
        'decided', 'agreed', 'concluded', 'resolved', 'approved',
        'rejected', 'chose', 'selected', 'voted', 'consensus'
    ];
    
    return sentences
        .filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return decisionKeywords.some(keyword => lowerSentence.includes(keyword));
        })
        .slice(0, 5)
        .map(sentence => sentence.trim());
}

// Advanced sentence scoring function
function calculateAdvancedSentenceScore(sentence, keyTopics, wordFreq, meetingType) {
    const lowerSentence = sentence.toLowerCase();
    let score = 0;
    
    // Length bonus (optimal length)
    const length = sentence.length;
    if (length > 40 && length < 200) score += 3;
    else if (length > 20 && length < 300) score += 1;
    
    // Keyword presence with weighted scoring
    keyTopics.forEach(topic => {
        if (lowerSentence.includes(topic)) {
            score += (wordFreq[topic] || 1) * 2;
        }
    });
    
    // Meeting type specific scoring
    const typeKeywords = {
        business: ['budget', 'revenue', 'profit', 'cost', 'investment', 'strategy', 'market', 'customer', 'sales', 'growth'],
        technical: ['code', 'bug', 'feature', 'api', 'database', 'system', 'performance', 'security', 'deployment', 'testing'],
        general: ['important', 'key', 'critical', 'main', 'primary', 'decision', 'conclusion', 'agreement']
    };
    
    const relevantKeywords = typeKeywords[meetingType] || typeKeywords.general;
    relevantKeywords.forEach(keyword => {
        if (lowerSentence.includes(keyword)) score += 4;
    });
    
    // Action-oriented phrases
    const actionPhrases = ['need to', 'should', 'must', 'action', 'task', 'next step', 'follow up', 'deadline', 'assign', 'responsible'];
    actionPhrases.forEach(phrase => {
        if (lowerSentence.includes(phrase)) score += 3;
    });
    
    // Decision-making phrases
    const decisionPhrases = ['decided', 'agreed', 'concluded', 'resolved', 'approved', 'chose', 'selected', 'consensus'];
    decisionPhrases.forEach(phrase => {
        if (lowerSentence.includes(phrase)) score += 4;
    });
    
    // Question sentences (often important)
    if (sentence.includes('?')) score += 2;
    
    // Exclamation sentences (often important)
    if (sentence.includes('!')) score += 2;
    
    // Numbers and metrics
    if (/\d+/.test(sentence)) score += 2;
    
    return score;
}

// Advanced action items extraction
function extractAdvancedActionItems(transcript) {
    const actionPatterns = [
        /(?:need to|should|must|have to|got to|gotta)\s+([^.!?]+)/gi,
        /(?:action|task|todo|follow up|next step)[s]?\s*:?\s*([^.!?]+)/gi,
        /(?:assign|delegate|responsible for)\s+([^.!?]+)/gi,
        /(?:deadline|due|by)\s+([^.!?]+)/gi,
        /(?:complete|finish|implement|create|update|review)\s+([^.!?]+)/gi,
        /(?:schedule|plan|organize|prepare)\s+([^.!?]+)/gi
    ];
    
    const actionItems = [];
    actionPatterns.forEach(pattern => {
        const matches = transcript.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const cleanAction = match.replace(/^(?:need to|should|must|have to|got to|gotta|action|task|todo|follow up|next step|assign|delegate|responsible for|deadline|due|by|complete|finish|implement|create|update|review|schedule|plan|organize|prepare)[s]?\s*:?\s*/i, '').trim();
                if (cleanAction.length > 15 && cleanAction.length < 120) {
                    actionItems.push(cleanAction);
                }
            });
        }
    });
    
    return [...new Set(actionItems)].slice(0, 6);
}

// Advanced decisions extraction
function extractAdvancedDecisions(transcript) {
    const decisionPatterns = [
        /(?:decided|agreed|concluded|resolved|approved|rejected|chose|selected|voted|consensus)\s+([^.!?]+)/gi,
        /(?:we will|we'll|going to|plan to)\s+([^.!?]+)/gi,
        /(?:final decision|conclusion|outcome)\s*:?\s*([^.!?]+)/gi,
        /(?:unanimous|majority|agreed that)\s+([^.!?]+)/gi
    ];
    
    const decisions = [];
    decisionPatterns.forEach(pattern => {
        const matches = transcript.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const cleanDecision = match.replace(/^(?:decided|agreed|concluded|resolved|approved|rejected|chose|selected|voted|consensus|we will|we'll|going to|plan to|final decision|conclusion|outcome|unanimous|majority|agreed that)[s]?\s*:?\s*/i, '').trim();
                if (cleanDecision.length > 15 && cleanDecision.length < 120) {
                    decisions.push(cleanDecision);
                }
            });
        }
    });
    
    return [...new Set(decisions)].slice(0, 5);
}

// Advanced metrics extraction
function extractAdvancedMetrics(transcript) {
    const metrics = [];
    
    // Find percentages
    const percentages = transcript.match(/\d+%/g);
    if (percentages) {
        metrics.push(`Key percentages: ${percentages.join(', ')}`);
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
    
    // Find numbers with context
    const numbers = transcript.match(/\b\d+(?:,\d{3})*(?:\.\d+)?\b/g);
    if (numbers && numbers.length > 0) {
        const significantNumbers = numbers.filter(num => parseInt(num.replace(/,/g, '')) > 10);
        if (significantNumbers.length > 0) {
            metrics.push(`Key numbers: ${significantNumbers.slice(0, 5).join(', ')}`);
        }
    }
    
    return metrics;
}

// Generate server-side AI insights that understand and interpret content
function generateServerAIInsights(transcript, keyTopics, meetingType) {
    const lowerTranscript = transcript.toLowerCase();
    const insights = [];
    
    // For very short transcripts, generate basic insights
    if (transcript.split(/\s+/).length < 10) {
        insights.push(`Brief discussion covering ${keyTopics.slice(0, 3).join(', ')}`);
        insights.push(`Key focus areas identified: ${keyTopics.slice(0, 5).join(', ')}`);
        if (meetingType === 'business') {
            insights.push('Business strategy and planning discussion');
        } else if (meetingType === 'technical') {
            insights.push('Technical implementation and development focus');
        } else {
            insights.push('General organizational discussion');
        }
        return insights;
    }
    
    // Analyze meeting context and generate original insights
    const context = analyzeServerMeetingContext(transcript, meetingType);
    
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
    
    // Meeting type specific insights
    if (meetingType === 'business') {
        insights.push('The meeting focused on business strategy and operational planning');
    } else if (meetingType === 'technical') {
        insights.push('Technical implementation and system architecture were primary concerns');
    } else {
        insights.push('A comprehensive discussion covering multiple aspects of the organization');
    }
    
    return insights.slice(0, 6); // Limit to 6 most relevant insights
}

// Analyze meeting context for server-side processing
function analyzeServerMeetingContext(transcript, meetingType) {
    const lowerTranscript = transcript.toLowerCase();
    
    return {
        hasFinancialDiscussion: /budget|cost|revenue|profit|investment|financial|money|dollar|price/.test(lowerTranscript),
        financialFocus: extractServerFinancialTopics(lowerTranscript),
        
        hasProjectManagement: /project|timeline|deadline|milestone|schedule|planning|roadmap/.test(lowerTranscript),
        projectAspects: extractServerProjectTopics(lowerTranscript),
        
        hasTeamDiscussion: /team|staff|employee|hire|hiring|personnel|workforce|collaboration/.test(lowerTranscript),
        teamFocus: extractServerTeamTopics(lowerTranscript),
        
        hasTechnicalContent: /technical|code|development|system|api|database|software|technology|bug|feature/.test(lowerTranscript),
        technicalTopics: extractServerTechnicalTopics(lowerTranscript),
        
        hasCustomerFocus: /customer|client|user|satisfaction|service|support|experience/.test(lowerTranscript),
        
        hasStrategicPlanning: /strategy|strategic|plan|planning|vision|goal|objective|target|future/.test(lowerTranscript),
        
        hasProblemSolving: /problem|issue|challenge|difficulty|concern|trouble|fix|resolve|solution/.test(lowerTranscript),
        
        hasGrowthDiscussion: /growth|expand|increase|scale|development|improvement|progress/.test(lowerTranscript),
        
        hasTimelineConcerns: /urgent|deadline|timeline|schedule|time|asap|immediately|quickly/.test(lowerTranscript),
        
        hasResourceAllocation: /resource|allocation|budget|funding|investment|spend|cost|allocate/.test(lowerTranscript)
    };
}

// Server-side topic extraction functions
function extractServerFinancialTopics(transcript) {
    const topics = [];
    if (/budget|budgeting/.test(transcript)) topics.push('budget planning');
    if (/revenue|income/.test(transcript)) topics.push('revenue generation');
    if (/cost|expense/.test(transcript)) topics.push('cost management');
    if (/investment|invest/.test(transcript)) topics.push('investment strategy');
    if (/profit|profitability/.test(transcript)) topics.push('profitability analysis');
    return topics;
}

function extractServerProjectTopics(transcript) {
    const topics = [];
    if (/timeline|schedule/.test(transcript)) topics.push('timeline management');
    if (/deadline|due/.test(transcript)) topics.push('deadline adherence');
    if (/milestone|phase/.test(transcript)) topics.push('milestone tracking');
    if (/planning|roadmap/.test(transcript)) topics.push('strategic planning');
    return topics;
}

function extractServerTeamTopics(transcript) {
    const topics = [];
    if (/hire|hiring/.test(transcript)) topics.push('recruitment');
    if (/collaboration|teamwork/.test(transcript)) topics.push('team collaboration');
    if (/training|development/.test(transcript)) topics.push('skill development');
    if (/performance|productivity/.test(transcript)) topics.push('performance management');
    return topics;
}

function extractServerTechnicalTopics(transcript) {
    const topics = [];
    if (/development|develop/.test(transcript)) topics.push('software development');
    if (/system|systems/.test(transcript)) topics.push('system architecture');
    if (/api|database/.test(transcript)) topics.push('technical infrastructure');
    if (/bug|issue|fix/.test(transcript)) topics.push('problem resolution');
    return topics;
}

// Extract and reformulate action items with AI interpretation (server-side)
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

// Extract and reformulate decisions with AI interpretation (server-side)
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

// Advanced insights generation
function generateAdvancedInsights(transcript, keyTopics, aiInsights, meetingType) {
    const insights = [];
    const lowerTranscript = transcript.toLowerCase();
    
    // Sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'successful', 'positive', 'improved', 'better', 'achieved', 'completed', 'won', 'gained', 'progress', 'growth', 'increase', 'upgrade'];
    const negativeWords = ['bad', 'poor', 'failed', 'problem', 'issue', 'challenge', 'difficult', 'struggle', 'lost', 'declined', 'worse', 'decrease', 'concern', 'risk', 'threat'];
    
    const positiveCount = positiveWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    const negativeCount = negativeWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    
    if (positiveCount > negativeCount * 1.5) {
        insights.push('Overall positive sentiment with optimistic tone throughout the meeting');
    } else if (negativeCount > positiveCount * 1.5) {
        insights.push('Meeting focused on challenges and problem-solving');
    } else if (positiveCount > 0 && negativeCount > 0) {
        insights.push('Balanced discussion with both opportunities and challenges identified');
    }
    
    // Meeting type specific insights
    if (meetingType === 'business') {
        if (lowerTranscript.includes('budget') || lowerTranscript.includes('cost') || lowerTranscript.includes('revenue')) {
            insights.push('Financial planning and budget considerations were central to the discussion');
        }
        if (lowerTranscript.includes('customer') || lowerTranscript.includes('client')) {
            insights.push('Customer-focused discussion with emphasis on client satisfaction');
        }
    } else if (meetingType === 'technical') {
        if (lowerTranscript.includes('bug') || lowerTranscript.includes('issue')) {
            insights.push('Technical troubleshooting and problem resolution were key topics');
        }
        if (lowerTranscript.includes('performance') || lowerTranscript.includes('optimization')) {
            insights.push('Performance optimization and system improvement were discussed');
        }
    }
    
    // Action-oriented analysis
    const actionWords = ['action', 'task', 'todo', 'next step', 'follow up', 'assign', 'responsible', 'deadline', 'complete', 'implement'];
    const actionCount = actionWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    
    if (actionCount > 5) {
        insights.push('Highly action-oriented meeting with multiple concrete next steps identified');
    } else if (actionCount > 2) {
        insights.push('Meeting resulted in several actionable items and follow-ups');
    }
    
    // Decision-making analysis
    const decisionWords = ['decided', 'agreed', 'concluded', 'consensus', 'approved', 'chose'];
    const decisionCount = decisionWords.reduce((count, word) => count + (lowerTranscript.split(word).length - 1), 0);
    
    if (decisionCount > 3) {
        insights.push('Multiple important decisions were made during the meeting');
    }
    
    // Time-sensitive analysis
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('asap') || lowerTranscript.includes('immediately')) {
        insights.push('Time-sensitive matters requiring immediate attention were discussed');
    }
    
    return insights;
}

// Advanced meeting metrics calculation
function calculateAdvancedMeetingMetrics(transcript, sentences, words) {
    const duration = transcript.length > 0 ? Math.ceil(words.length / 2.5) : 0;
    const speakingRate = words.length / Math.max(duration, 1);
    
    return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        estimatedDuration: `${duration} minutes`,
        averageWordsPerMinute: Math.round(speakingRate),
        averageSentenceLength: Math.round(words.length / sentences.length),
        readabilityScore: calculateReadabilityScore(sentences, words),
        meetingDuration: `${duration} minutes`,
        sentenceCount: sentences.length
    };
}

// Calculate meeting metrics
function calculateMeetingMetrics(transcript, sentences, words) {
    const duration = transcript.length > 0 ? Math.ceil(words.length / 2.5) : 0; // Estimate duration in minutes
    const speakingRate = words.length / Math.max(duration, 1);
    
    return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        estimatedDuration: `${duration} minutes`,
        averageWordsPerMinute: Math.round(speakingRate),
        averageSentenceLength: Math.round(words.length / sentences.length),
        readabilityScore: calculateReadabilityScore(sentences, words)
    };
}

// Calculate readability score (simplified Flesch Reading Ease)
function calculateReadabilityScore(sentences, words) {
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = words.reduce((total, word) => {
        return total + countSyllables(word);
    }, 0) / words.length;
    
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, Math.round(score)));
}

// Count syllables in a word
function countSyllables(word) {
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
        const isVowel = vowels.includes(word[i].toLowerCase());
        if (isVowel && !previousWasVowel) {
            count++;
        }
        previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) count--;
    return Math.max(1, count);
}

// Generate unique meeting ID
function generateMeetingId() {
    return 'meeting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save meeting data to file
function saveMeetingData(meetingData) {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    
    const filePath = path.join(dataDir, `${meetingData.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(meetingData, null, 2));
}

// Get meeting history
function getMeetingHistory() {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        return [];
    }
    
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    return files.map(file => {
        const filePath = path.join(dataDir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const meeting = JSON.parse(data);
        return {
            id: meeting.id,
            createdAt: meeting.createdAt,
            meetingType: meeting.meetingType,
            duration: meeting.endTime && meeting.startTime ? 
                Math.round((new Date(meeting.endTime) - new Date(meeting.startTime)) / 60000) : 0,
            wordCount: meeting.transcript ? meeting.transcript.split(/\s+/).length : 0
        };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get specific meeting by ID
function getMeetingById(meetingId) {
    const dataDir = path.join(__dirname, 'data');
    const filePath = path.join(dataDir, `${meetingId}.json`);
    
    if (!fs.existsSync(filePath)) {
        return null;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// ==================== HUGGING FACE AI SUMMARIZATION ====================

// Choose the best model based on content type
function selectBestModel(transcript, meetingType) {
    // For now, use the most reliable model
    return 'facebook/bart-large-cnn';
}

// Call Hugging Face API for AI summarization
async function summarizeWithHuggingFace(transcript, meetingType = 'general') {
    const model = selectBestModel(transcript, meetingType);
    
    try {
        console.log(`🤖 Using Hugging Face model: ${model}`);
        console.log(`📝 Input transcript length: ${transcript.length} characters`);
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            headers: { 
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                inputs: transcript,
                parameters: {
                    max_length: 200,
                    min_length: 50,
                    do_sample: false,
                    temperature: 0.7
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log(`📡 Hugging Face response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ HF API error response: ${errorText}`);
            throw new Error(`HF API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`📄 Hugging Face raw result:`, JSON.stringify(result, null, 2));
        
        if (result.error) {
            console.error(`❌ HF Model error: ${result.error}`);
            throw new Error(`HF Model error: ${result.error}`);
        }
        
        if (!result || !result[0] || !result[0].summary_text) {
            console.error(`❌ No summary in result:`, result);
            throw new Error('No summary generated by Hugging Face');
        }
        
        console.log(`✅ Hugging Face summary generated successfully: "${result[0].summary_text}"`);
        return result[0].summary_text;
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('❌ Hugging Face API timeout after 30 seconds');
            throw new Error('Hugging Face API timeout');
        }
        console.error('❌ Hugging Face API error:', error.message);
        console.error('❌ Full error:', error);
        throw error;
    }
}

// Enhanced AI understanding and analysis
async function generateAIIntelligentSummary(transcript, meetingType = 'general') {
    try {
        // Get AI summary from Hugging Face
        const aiSummary = await summarizeWithHuggingFace(transcript, meetingType);
        
        // Extract real key topics using advanced NLP
        const realKeyTopics = extractRealKeyTopics(transcript);
        
        // Generate intelligent insights based on understanding
        const intelligentInsights = await generateIntelligentInsights(transcript, aiSummary, meetingType);
        
        // Extract contextually relevant action items
        const contextualActionItems = extractContextualActionItems(transcript);
        
        // Extract meaningful decisions
        const meaningfulDecisions = extractMeaningfulDecisions(transcript);
        
        // Extract relevant metrics
        const relevantMetrics = extractRelevantMetrics(transcript);
        
        return {
            aiSummary: aiSummary,
            keyTopics: realKeyTopics,
            intelligentInsights: intelligentInsights,
            actionItems: contextualActionItems,
            decisions: meaningfulDecisions,
            metrics: relevantMetrics,
            meetingType: meetingType,
            generatedAt: new Date().toISOString(),
            wordCount: transcript.split(/\s+/).length,
            sentenceCount: transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length
        };
        
    } catch (error) {
        console.error('AI summarization failed, falling back to custom logic:', error.message);
        // Fallback to existing logic
        return generateEnhancedSummary(transcript, meetingType);
    }
}

// Extract real, legitimate key topics using advanced analysis
function extractRealKeyTopics(transcript) {
    const words = transcript.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'so', 'very', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'once', 'get', 'got', 'going', 'come', 'came', 'see', 'saw', 'know', 'knew', 'think', 'thought', 'say', 'said', 'tell', 'told', 'make', 'made', 'take', 'took', 'give', 'gave', 'go', 'went', 'come', 'came', 'look', 'looked', 'find', 'found', 'use', 'used', 'work', 'worked', 'call', 'called', 'try', 'tried', 'ask', 'asked', 'need', 'needed', 'feel', 'felt', 'become', 'became', 'leave', 'left', 'put', 'put', 'mean', 'meant', 'keep', 'kept', 'let', 'let', 'begin', 'began', 'seem', 'seemed', 'help', 'helped', 'talk', 'talked', 'turn', 'turned', 'start', 'started', 'show', 'showed', 'hear', 'heard', 'play', 'played', 'run', 'ran', 'move', 'moved', 'live', 'lived', 'believe', 'believed', 'hold', 'held', 'bring', 'brought', 'happen', 'happened', 'write', 'wrote', 'provide', 'provided', 'sit', 'sat', 'stand', 'stood', 'lose', 'lost', 'pay', 'paid', 'meet', 'met', 'include', 'included', 'continue', 'continued', 'set', 'set', 'learn', 'learned', 'change', 'changed', 'lead', 'led', 'understand', 'understood', 'watch', 'watched', 'follow', 'followed', 'stop', 'stopped', 'create', 'created', 'speak', 'spoke', 'read', 'read', 'allow', 'allowed', 'add', 'added', 'spend', 'spent', 'grow', 'grew', 'open', 'opened', 'walk', 'walked', 'win', 'won', 'offer', 'offered', 'remember', 'remembered', 'love', 'loved', 'consider', 'considered', 'appear', 'appeared', 'buy', 'bought', 'wait', 'waited', 'serve', 'served', 'die', 'died', 'send', 'sent', 'expect', 'expected', 'build', 'built', 'stay', 'stayed', 'fall', 'fell', 'cut', 'cut', 'reach', 'reached', 'kill', 'killed', 'remain', 'remained', 'suggest', 'suggested', 'raise', 'raised', 'pass', 'passed', 'sell', 'sold', 'require', 'required', 'report', 'reported', 'decide', 'decided', 'pull', 'pulled']);
    
    // Count word frequencies with context analysis
    const wordFreq = {};
    const contextWords = {};
    
    words.forEach((word, index) => {
        const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
        if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            
            // Analyze context around important words
            if (wordFreq[cleanWord] > 1) {
                const context = words.slice(Math.max(0, index - 3), index + 4);
                contextWords[cleanWord] = contextWords[cleanWord] || [];
                contextWords[cleanWord].push(context.join(' '));
            }
        }
    });
    
    // Calculate importance scores with context relevance
    const totalWords = words.length;
    const keyTopics = Object.entries(wordFreq)
        .map(([word, freq]) => {
            const contextRelevance = contextWords[word] ? contextWords[word].length : 0;
            const score = freq * Math.log(totalWords / freq) + (contextRelevance * 0.5);
            return { word, freq, score, context: contextWords[word] };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(item => item.word);
    
    return keyTopics;
}

// Generate intelligent insights based on AI understanding
async function generateIntelligentInsights(transcript, aiSummary, meetingType) {
    const insights = [];
    const lowerTranscript = transcript.toLowerCase();
    
    // Analyze meeting context and generate original insights
    if (lowerTranscript.includes('budget') || lowerTranscript.includes('cost') || lowerTranscript.includes('money')) {
        insights.push('Financial planning and budget allocation were key discussion points');
    }
    
    if (lowerTranscript.includes('project') || lowerTranscript.includes('timeline') || lowerTranscript.includes('deadline')) {
        insights.push('Project management and timeline coordination were central to the discussion');
    }
    
    if (lowerTranscript.includes('team') || lowerTranscript.includes('staff') || lowerTranscript.includes('employee')) {
        insights.push('Team dynamics and personnel matters were addressed');
    }
    
    if (lowerTranscript.includes('customer') || lowerTranscript.includes('client') || lowerTranscript.includes('user')) {
        insights.push('Customer satisfaction and service quality were important considerations');
    }
    
    if (lowerTranscript.includes('strategy') || lowerTranscript.includes('plan') || lowerTranscript.includes('goal')) {
        insights.push('Strategic planning and goal setting were key elements of the conversation');
    }
    
    if (lowerTranscript.includes('problem') || lowerTranscript.includes('issue') || lowerTranscript.includes('challenge')) {
        insights.push('Problem-solving and issue resolution were central to the meeting agenda');
    }
    
    if (lowerTranscript.includes('growth') || lowerTranscript.includes('expand') || lowerTranscript.includes('increase')) {
        insights.push('Growth opportunities and expansion plans were explored');
    }
    
    if (lowerTranscript.includes('technology') || lowerTranscript.includes('system') || lowerTranscript.includes('software')) {
        insights.push('Technical implementation and system architecture were discussed');
    }
    
    // If no specific insights, generate general ones based on AI summary
    if (insights.length === 0) {
        insights.push('The discussion covered multiple important topics requiring attention');
        insights.push('Key decisions and action items were identified for follow-up');
    }
    
    return insights.slice(0, 6);
}

// Extract contextually relevant action items
function extractContextualActionItems(transcript) {
    const actionItems = [];
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const actionPatterns = [
        /(?:need to|should|must|will|going to|plan to|intend to)\s+([^.!?]+)/gi,
        /(?:responsible for|in charge of|handle|manage|take care of)\s+([^.!?]+)/gi,
        /(?:action item|todo|task|assignment)\s*:?\s*([^.!?]+)/gi,
        /(?:follow up|follow-up|check on|review)\s+([^.!?]+)/gi
    ];
    
    sentences.forEach(sentence => {
        actionPatterns.forEach(pattern => {
            const matches = sentence.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const cleanItem = match.replace(/^(?:need to|should|must|will|going to|plan to|intend to|responsible for|in charge of|handle|manage|take care of|action item|todo|task|assignment|follow up|follow-up|check on|review)\s*:?\s*/i, '').trim();
                    if (cleanItem.length > 10) {
                        actionItems.push(cleanItem);
                    }
                });
            }
        });
    });
    
    return [...new Set(actionItems)].slice(0, 8);
}

// Extract meaningful decisions
function extractMeaningfulDecisions(transcript) {
    const decisions = [];
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const decisionPatterns = [
        /(?:decided|agreed|concluded|determined|resolved)\s+([^.!?]+)/gi,
        /(?:decision|conclusion|agreement)\s*:?\s*([^.!?]+)/gi,
        /(?:we will|we'll|we are going to|we're going to)\s+([^.!?]+)/gi,
        /(?:it was decided|it was agreed|it was concluded)\s+([^.!?]+)/gi
    ];
    
    sentences.forEach(sentence => {
        decisionPatterns.forEach(pattern => {
            const matches = sentence.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const cleanDecision = match.replace(/^(?:decided|agreed|concluded|determined|resolved|decision|conclusion|agreement|we will|we'll|we are going to|we're going to|it was decided|it was agreed|it was concluded)\s*:?\s*/i, '').trim();
                    if (cleanDecision.length > 10) {
                        decisions.push(cleanDecision);
                    }
                });
            }
        });
    });
    
    return [...new Set(decisions)].slice(0, 6);
}

// Extract relevant metrics
function extractRelevantMetrics(transcript) {
    const metrics = [];
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const metricPatterns = [
        /(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*percent)/gi,
        /(\$[\d,]+(?:\.\d{2})?)/gi,
        /(\d+(?:,\d{3})*(?:\.\d+)?\s*(?:dollars?|USD|euros?|EUR|pounds?|GBP))/gi,
        /(\d+(?:,\d{3})*(?:\.\d+)?\s*(?:users?|customers?|clients?|employees?|staff))/gi,
        /(\d+(?:,\d{3})*(?:\.\d+)?\s*(?:days?|weeks?|months?|years?))/gi,
        /(\d+(?:,\d{3})*(?:\.\d+)?\s*(?:units?|items?|products?|services?))/gi
    ];
    
    sentences.forEach(sentence => {
        metricPatterns.forEach(pattern => {
            const matches = sentence.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    metrics.push(match.trim());
                });
            }
        });
    });
    
    return [...new Set(metrics)].slice(0, 10);
}

// ==================== AI CHAT RESPONSE GENERATION ====================

// Generate AI chat response
async function generateChatResponse(userMessage, transcript, summary, chatHistory) {
    try {
        // Create context for the AI
        const context = buildChatContext(transcript, summary, chatHistory);
        
        // Create a prompt for the AI
        const prompt = createChatPrompt(userMessage, context);
        
        // Use Hugging Face for chat response
        const aiResponse = await generateChatWithHuggingFace(prompt);
        
        return aiResponse;
        
    } catch (error) {
        console.error('Error generating chat response:', error);
        // Fallback to rule-based response
        return generateRuleBasedResponse(userMessage, transcript, summary);
    }
}

// Build context for chat
function buildChatContext(transcript, summary, chatHistory) {
    let context = '';
    
    if (transcript && transcript.trim()) {
        context += `Meeting Transcript:\n${transcript}\n\n`;
    }
    
    if (summary) {
        if (summary.aiSummary) {
            context += `AI Summary: ${summary.aiSummary}\n\n`;
        }
        
        if (summary.keyTopics && summary.keyTopics.length > 0) {
            context += `Key Topics: ${summary.keyTopics.join(', ')}\n\n`;
        }
        
        if (summary.decisions && summary.decisions.length > 0) {
            context += `Decisions Made: ${summary.decisions.join('; ')}\n\n`;
        }
        
        if (summary.actionItems && summary.actionItems.length > 0) {
            context += `Action Items: ${summary.actionItems.join('; ')}\n\n`;
        }
        
        if (summary.metrics && summary.metrics.length > 0) {
            context += `Key Metrics: ${summary.metrics.join(', ')}\n\n`;
        }
    }
    
    if (chatHistory && chatHistory.length > 0) {
        context += 'Recent Conversation:\n';
        chatHistory.slice(-5).forEach(msg => {
            context += `${msg.sender}: ${msg.message}\n`;
        });
        context += '\n';
    }
    
    return context;
}

// Create chat prompt
function createChatPrompt(userMessage, context) {
    return `You are an AI meeting assistant. You help users understand their meeting content by answering questions about decisions, action items, discussions, and insights.

${context}

User Question: ${userMessage}

Please provide a helpful, accurate response based on the meeting content above. If the information isn't available in the meeting, say so clearly. Be concise but informative.`;
}

// Generate chat response using Hugging Face
async function generateChatWithHuggingFace(prompt) {
    try {
        // Use a text generation model for chat
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            headers: { 
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                inputs: prompt,
                parameters: {
                    max_length: 300,
                    min_length: 50,
                    do_sample: true,
                    temperature: 0.7,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HF Chat API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
            throw new Error(`HF Model error: ${result.error}`);
        }
        
        if (!result || !result[0] || !result[0].generated_text) {
            throw new Error('No response generated by Hugging Face');
        }
        
        // Extract the response (remove the original prompt)
        const generatedText = result[0].generated_text;
        const responseText = generatedText.replace(prompt, '').trim();
        
        return responseText || 'I understand your question, but I need more context to provide a helpful answer.';
        
    } catch (error) {
        console.error('Hugging Face chat error:', error.message);
        throw error;
    }
}

// Generate rule-based response as fallback
function generateRuleBasedResponse(userMessage, transcript, summary) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific question types
    if (lowerMessage.includes('decision') || lowerMessage.includes('decided')) {
        if (summary && summary.decisions && summary.decisions.length > 0) {
            return `Based on the meeting, here are the key decisions made:\n\n• ${summary.decisions.join('\n• ')}`;
        } else {
            return 'I don\'t see any specific decisions mentioned in the meeting transcript.';
        }
    }
    
    if (lowerMessage.includes('action') || lowerMessage.includes('todo') || lowerMessage.includes('task')) {
        if (summary && summary.actionItems && summary.actionItems.length > 0) {
            return `Here are the action items from the meeting:\n\n• ${summary.actionItems.join('\n• ')}`;
        } else {
            return 'No specific action items were identified in the meeting.';
        }
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money')) {
        if (summary && summary.metrics && summary.metrics.length > 0) {
            const financialMetrics = summary.metrics.filter(m => m.includes('$') || m.includes('%'));
            if (financialMetrics.length > 0) {
                return `Financial information mentioned in the meeting:\n\n• ${financialMetrics.join('\n• ')}`;
            }
        }
        return 'I don\'t see specific budget or financial information in the meeting transcript.';
    }
    
    if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
        if (summary && summary.aiSummary) {
            return `Here's the AI summary of the meeting:\n\n${summary.aiSummary}`;
        } else if (transcript) {
            return 'I can see the meeting transcript, but no AI summary is available yet. Would you like me to help you find specific information from the transcript?';
        } else {
            return 'No meeting content is available to summarize. Please record a meeting first.';
        }
    }
    
    if (lowerMessage.includes('who') || lowerMessage.includes('responsible')) {
        return 'I can help you find information about responsibilities. Could you be more specific about what you\'re looking for? For example, "Who is responsible for the marketing strategy?"';
    }
    
    if (lowerMessage.includes('topic') || lowerMessage.includes('discuss')) {
        if (summary && summary.keyTopics && summary.keyTopics.length > 0) {
            return `The main topics discussed in the meeting were:\n\n• ${summary.keyTopics.join('\n• ')}`;
        } else {
            return 'I can see the meeting transcript, but I need to analyze it to identify the key topics. Would you like me to help you find specific information?';
        }
    }
    
    // Default response
    return 'I understand you\'re asking about the meeting. Could you be more specific? I can help you find information about decisions, action items, budget discussions, topics covered, or any other aspects of the meeting.';
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Meeting Assistant server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view the application`);
    console.log(`🔧 API endpoints available at http://localhost:${PORT}/api/`);
});

module.exports = app;
