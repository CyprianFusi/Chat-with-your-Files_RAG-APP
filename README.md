<div align="center">
  <img src="https://raw.githubusercontent.com/CyprianFusi/Chat-with-your-Files_RAG-APP/main/public/binati_logo.png" alt="BINATI AI Logo" width="150"/>

  # Chat with your Files

  _By **BINATI AInalytics**_
</div>

---

## 🧠 Chat with your Files – A RAG-Powered Document Assistant

**Chat with your Files** is a powerful Retrieval-Augmented Generation (RAG) app designed to let you seamlessly interact with your documents. Upload files, ask natural language questions, and receive real-time, AI-generated responses complete with clear source attributions.

---
## ✅ What You Can Do
1. **Upload** documents via the UI
2. **Ask questions** naturally
3. **Receive answers** backed by your own data

# Demo
![](public/demo_long.gif)

## 🚀 Features

### 📂 File Upload & Processing
- Supports **PDF, TXT, DOCX, CSV, XLSX**
- Auto file-type detection and parsing
- Accurate token counting using `tiktoken`
- Vector store and embedding management

### 💬 Interactive Chat Interface
- Character-by-character **streaming responses**
- **Source documents referenced** below each reply
- Reset and clean **conversation history**

### 🧠 Smart RAG Backend
- Context-aware answers via **LlamaIndex**
- **Source attribution** so you know where info comes from
- Robust **error handling** for edge cases

---

## ✨ Highlights
- ⚡ **Streaming UX**: Real-time AI typing
- 📚 **Cited Answers**: Know your sources
- 🧩 **Modular Backend**: Easy to scale and extend
- 🎨 **Modern UI**: Clean, intuitive interface

---

## 🛠 Planned Enhancements
- 🗃 File Management Dashboard
- 📁 Multi-file Chat Targeting
- 👍 Thumbs Up/Down Feedback
- 🔍 Document Previews
- 💬 Chat History Persistence

---

---

## 🧰 Tech Stack
- **Frontend**: React + Tailwind + Streaming UI
- **Backend**: Next.js + API Routes
- **LLM**: OpenAI / Custom integration
- **Indexing**: LlamaIndex for document embeddings
- **Tokenization**: `tiktoken` support

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/CyprianFusi/Chat-with-your-Files_RAG-APP
cd Chat-with-your-Files_RAG-APP

# Install dependencies
npm install

# Start development server
npm run dev
