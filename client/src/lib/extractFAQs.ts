/**
 * Extract FAQ questions and answers from markdown content
 * Looks for patterns like:
 * - **Question:** or **Q:** followed by the question
 * - **Answer:** or **A:** followed by the answer
 * - Heading followed by content (H2 or H3 as question, next paragraph as answer)
 */
export function extractFAQsFromMarkdown(content: string): Array<{ question: string; answer: string }> {
  if (!content) return [];
  
  const faqs: Array<{ question: string; answer: string }> = [];
  
  // Pattern 1: **Question:** ... **Answer:** ...
  const qaPattern = /\*\*(?:Question|Q):\*\*\s*([^\n]+)\s*\*\*(?:Answer|A):\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/gi;
  let match;
  
  while ((match = qaPattern.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n/g, ' ');
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  
  // Pattern 2: Headings as questions (only if no Q&A pattern found)
  if (faqs.length === 0) {
    const lines = content.split('\n');
    let currentQuestion = '';
    let currentAnswer = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line is a heading (## or ###)
      const headingMatch = line.match(/^##\s+(.+)$/);
      
      if (headingMatch) {
        // Save previous Q&A if exists
        if (currentQuestion && currentAnswer) {
          faqs.push({ 
            question: currentQuestion, 
            answer: currentAnswer.trim().replace(/\n/g, ' ') 
          });
        }
        
        // Start new question
        currentQuestion = headingMatch[1].trim().replace(/\*/g, '');
        currentAnswer = '';
      } else if (currentQuestion && line && !line.startsWith('#')) {
        // Accumulate answer content
        currentAnswer += (currentAnswer ? ' ' : '') + line;
      }
    }
    
    // Add last Q&A if exists
    if (currentQuestion && currentAnswer) {
      faqs.push({ 
        question: currentQuestion, 
        answer: currentAnswer.trim().replace(/\n/g, ' ') 
      });
    }
  }
  
  // Limit to first 5 FAQs for schema (Google recommends 3-5)
  return faqs.slice(0, 5);
}
