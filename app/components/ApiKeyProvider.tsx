'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  sessionId: string;
  setApiKey: (key: string) => void;
}

// Create context
const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

// Context provider
export const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('sessionId');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('sessionId', id);
      }
      setSessionId(id);
      console.log('Initialized session ID:', id);
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, sessionId, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

// Custom hook to access context
export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
