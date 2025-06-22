
'use client';


// app/page.tsx
import FileUploader from './components/FileUploader';
import ChatPanel from './components/ChatPanel';
import ClientOnly from './components/ClientOnly';

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <ClientOnly>
        <FileUploader />
      </ClientOnly>
      
      <div className="mt-8">
        <ClientOnly>
          <ChatPanel />
        </ClientOnly>
      </div>
    </main>
  );
}
