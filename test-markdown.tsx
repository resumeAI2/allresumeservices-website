import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Test component
const TestMarkdown = () => {
  const markdown = `
| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
  `;
  
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;
};

export default TestMarkdown;
