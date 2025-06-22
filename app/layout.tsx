import './globals.css';

export const metadata = {
  title: 'LlamaIndex RAG App',
  description: 'Upload a file and chat with it using LlamaIndex + OpenAI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}

