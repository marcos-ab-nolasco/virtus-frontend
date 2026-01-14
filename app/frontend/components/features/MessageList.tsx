'use client';

import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

interface Message {
  id: string;
  message: string;
  role: 'user' | 'agent';
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  isAgentTyping?: boolean;
}

export default function MessageList({ messages, isAgentTyping = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <div role="list">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.message}
            role={msg.role}
            timestamp={msg.timestamp}
          />
        ))}
        {isAgentTyping && (
          <ChatBubble
            message=""
            role="agent"
            isLoading={true}
          />
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
