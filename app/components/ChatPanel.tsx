
'use client';

import { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  fileNames?: string[];
}

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! How can I assist you today?', fileNames: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Add AI message placeholder
    setMessages(prev => [...prev, { sender: 'ai', text: '▍', fileNames: [] }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const { response, sources } = await res.json();
      
      // Stream response character by character
      let displayedText = '';
      for (let i = 0; i < response.length; i++) {
        displayedText += response[i];
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage.sender === 'ai') {
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              text: displayedText + '▍',
              fileNames: sources
            };
          }
          
          return newMessages;
        });
        
        // Add slight delay between characters for streaming effect
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Remove the cursor indicator when done
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage.sender === 'ai') {
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            text: displayedText,
            fileNames: sources
          };
        }
        
        return newMessages;
      });
    } catch (err: any) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage.sender === 'ai') {
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            text: `Error: ${err.message || 'Unknown error'}`
          };
        }
        
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ sender: 'ai', text: 'Hello! How can I assist you today?', fileNames: [] }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full max-w-2xl p-4 mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chat with your uploaded files</h2>
        <Button 
          onClick={handleReset} 
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Reset Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4 mb-4 overflow-y-auto bg-white border rounded-md">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 p-4 rounded-md whitespace-pre-wrap ${
              msg.sender === 'user' 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-green-50 border border-green-100'
            }`}
          >
            <div className="mb-1 font-semibold">
              {msg.sender === 'user' ? 'You' : 'AI'}
            </div>
            <div className="text-gray-800">
              {msg.text}
            </div>
            {msg.fileNames && msg.fileNames.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">References:</span>
                <ul className="mt-1">
                  {msg.fileNames.map((fileName, idx) => (
                    <li key={idx} className="truncate">
                      {fileName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something from your documents"
          className="resize-none min-h-[60px]"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            className="w-24 text-white bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="mr-2 animate-pulse">●</span> Typing...
              </span>
            ) : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}