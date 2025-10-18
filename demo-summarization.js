// Demo script to test enhanced AI summarization
const sampleTranscripts = {
    business: `Today we discussed the quarterly budget review. We need to increase our marketing budget by 25% to reach our target of $2M revenue this quarter. John will be responsible for updating the marketing strategy by next Friday. We also decided to hire two new developers for the mobile app project. The deadline for the app launch is March 15th. Sarah mentioned that customer satisfaction has improved by 15% this month. We agreed to implement the new customer feedback system by the end of February. The main challenge is finding qualified developers quickly. We should also consider outsourcing some development work. Overall, the team is optimistic about meeting our goals this quarter.`,

    technical: `We had a technical review meeting about the new API implementation. The main issue is that the authentication system is causing 15% performance degradation. We need to optimize the database queries to reduce response time from 2.5 seconds to under 1 second. Mike will investigate the caching mechanism and implement Redis by next week. We also discovered a critical security vulnerability in the payment processing module that needs immediate attention. The team agreed to implement two-factor authentication for all admin accounts. We decided to postpone the mobile app release until we fix these issues. The code review process needs improvement - we should implement automated testing for all new features.`,

    general: `This was our weekly team standup meeting. Everyone reported good progress on their current projects. The main topic was the upcoming company retreat scheduled for next month. We need to finalize the venue and send out invitations by Friday. The budget for the retreat is $5,000 and we have 25 people attending. Sarah will handle the catering arrangements. We also discussed the new remote work policy - employees can work from home up to 3 days per week. The IT department will provide laptops for all remote workers. We agreed to have monthly team building activities to improve collaboration. The next meeting is scheduled for next Tuesday at 2 PM.`
};

async function testSummarization(meetingType) {
    const transcript = sampleTranscripts[meetingType];
    
    console.log(`\n=== Testing ${meetingType.toUpperCase()} Meeting Summarization ===`);
    console.log(`Original transcript (${transcript.length} characters):`);
    console.log(transcript);
    console.log('\n' + '='.repeat(80));
    
    try {
        const response = await fetch('http://localhost:3000/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcript: transcript,
                meetingType: meetingType
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const summary = data.summary;
        
        console.log('\n🤖 AI-GENERATED SUMMARY:');
        console.log('='.repeat(50));
        
        // Key Topics
        if (summary.keyTopics && summary.keyTopics.length > 0) {
            console.log('\n🏷️  Key Topics:');
            summary.keyTopics.forEach(topic => console.log(`   • ${topic}`));
        }
        
        // AI Insights
        if (summary.insights && summary.insights.length > 0) {
            console.log('\n💡 AI Insights:');
            summary.insights.forEach(insight => console.log(`   • ${insight}`));
        }
        
        // Key Discussion Points
        if (summary.bulletPoints && summary.bulletPoints.length > 0) {
            console.log('\n📝 Key Discussion Points:');
            summary.bulletPoints.forEach(point => console.log(`   • ${point}`));
        }
        
        // Decisions Made
        if (summary.decisions && summary.decisions.length > 0) {
            console.log('\n⚖️  Decisions Made:');
            summary.decisions.forEach(decision => console.log(`   • ${decision}`));
        }
        
        // Action Items
        if (summary.actionItems && summary.actionItems.length > 0) {
            console.log('\n✅ Action Items:');
            summary.actionItems.forEach(item => console.log(`   • ${item}`));
        }
        
        // Key Metrics
        if (summary.metrics && summary.metrics.length > 0) {
            console.log('\n📊 Key Metrics:');
            summary.metrics.forEach(metric => console.log(`   • ${metric}`));
        }
        
        // Meeting Statistics
        console.log('\n📈 Meeting Statistics:');
        console.log(`   • Duration: ${summary.meetingDuration || 'Unknown'}`);
        console.log(`   • Words: ${summary.wordCount || 0}`);
        console.log(`   • Sentences: ${summary.sentenceCount || 0}`);
        console.log(`   • Readability Score: ${summary.readabilityScore || 'N/A'}`);
        
    } catch (error) {
        console.error('Error testing summarization:', error);
    }
}

// Run tests for all meeting types
async function runAllTests() {
    console.log('🚀 AI Meeting Assistant - Enhanced Summarization Demo');
    console.log('='.repeat(60));
    
    for (const meetingType of Object.keys(sampleTranscripts)) {
        await testSummarization(meetingType);
        console.log('\n' + '='.repeat(80));
    }
    
    console.log('\n✅ All tests completed!');
    console.log('\nKey improvements in the enhanced summarization:');
    console.log('• Advanced TF-IDF keyword extraction');
    console.log('• Intelligent sentence scoring based on importance');
    console.log('• Pattern-based action item extraction');
    console.log('• Decision-making phrase detection');
    console.log('• Sentiment analysis and insights generation');
    console.log('• Metrics and number extraction');
    console.log('• Meeting type-specific analysis');
}

// Run the demo
runAllTests().catch(console.error);
