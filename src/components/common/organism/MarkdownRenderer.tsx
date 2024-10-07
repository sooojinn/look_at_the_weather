import { TextColor, TextSize } from '@/config/types';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Text from '../atom/Text';

interface MarkdownRendererProps {
  markdownTitle: string;
  size?: TextSize;
  color: TextColor;
}

export default function MarkdownRenderer({ markdownTitle, size, color }: MarkdownRendererProps) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(`/markdown/${markdownTitle}.md`)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <Text size={size} color={color}>
      <ReactMarkdown
        components={{
          ul: ({ children }) => <ul style={{ listStyleType: 'disc' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ listStyleType: 'decimal' }}>{children}</ol>,
          li: ({ children }) => <li style={{ marginLeft: '15px' }}>{children}</li>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </Text>
  );
}
