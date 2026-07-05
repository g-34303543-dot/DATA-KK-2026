/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Student, Teacher, ChatMessage } from '../types';

interface ChatPanelProps {
  students: Student[];
  teachers: Teacher[];
  onAddMessage: (msg: ChatMessage) => void;
  messages: ChatMessage[];
  onClearHistory: () => void;
}

export default function ChatPanel({ students, teachers, onAddMessage, messages, onClearHistory }: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Berapa orang ahli Kelab Seni Tari?",
    "Siapakah guru penasihat Kelab Seni Tari?",
    "Cari guru bernama Rampini Francesca",
    "Berikan statistik Sesi Pagi vs Sesi Petang"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Create and add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    onAddMessage(userMsg);
    setInputText('');
    setIsLoading(true);

    try {
      // Format history in the format required by the API
      // Since Gemini expect role to be 'user' or 'model'
      const history = messages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          students,
          teachers
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        onAddMessage({
          id: Math.random().toString(),
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        throw new Error(data.error || 'Gagal menerima maklum balas.');
      }
    } catch (err: any) {
      console.error(err);
      onAddMessage({
        id: Math.random().toString(),
        sender: 'assistant',
        text: `Maaf, berlaku sedikit ralat teknikal: ${err.message || 'Sila cuba sebentar lagi.'}`,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage(inputText);
    }
  };

  // Safe and beautiful custom renderer for basic markdown-style response text from Gemini
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      
      // Handle bold formatting (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIdx = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        const textBefore = content.substring(lastIdx, match.index);
        const boldText = match[1];
        if (textBefore) parts.push(textBefore);
        parts.push(<strong key={match.index} className="font-bold text-slate-900">{boldText}</strong>);
        lastIdx = boldRegex.lastIndex;
      }
      
      const textAfter = content.substring(lastIdx);
      if (textAfter) parts.push(textAfter);

      // Handle Bullet points starting with * or -
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const cleanText = line.replace(/^[\s*-]+/, '');
        return (
          <li key={idx} className="ml-4 list-disc pl-1 py-0.5 text-slate-700 leading-relaxed text-sm">
            {parts.length > 0 ? parts : cleanText}
          </li>
        );
      }

      // Handle headers starting with #
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 mt-3 mb-1 uppercase tracking-wider">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }

      return (
        <p key={idx} className="text-slate-700 text-sm leading-relaxed min-h-[1rem]">
          {parts.length > 0 ? parts : content}
        </p>
      );
    });
  };

  return (
    <div className="bg-white border-2 border-slate-200 p-6 flex flex-col h-[600px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-900 text-yellow-400 flex items-center justify-center border border-blue-950">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-widest font-display">Asisten AI Kokurikulum</h2>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">SMK Muara Tuang 2026 • Bersedia Menjawab</p>
          </div>
        </div>

        <button 
          onClick={onClearHistory}
          className="text-[10px] text-rose-600 hover:text-rose-800 font-black uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
          title="Kosongkan Sesi Perbualan"
        >
          <RefreshCw className="w-3 h-3" />
          Set Semula
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1 min-h-0">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-2.5 max-w-[90%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 border-2 font-black text-xs ${
              msg.sender === 'user' 
                ? 'bg-blue-900 text-white border-blue-950' 
                : 'bg-yellow-400 text-blue-950 border-slate-900'
            }`}>
              {msg.sender === 'user' ? 'ME' : 'AI'}
            </div>
            
            <div className={`px-4 py-3 text-slate-700 shadow-sm space-y-1.5 border-2 ${
              msg.sender === 'user' 
                ? 'bg-blue-50 text-slate-900 border-blue-900/30 rounded-tr-none' 
                : 'bg-slate-50 border-slate-200 rounded-tl-none'
            }`}>
              <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none pb-0.5 border-b border-slate-200/40">
                {msg.sender === 'user' ? 'ANDA' : 'PEMBANTU AI'} • {msg.timestamp}
              </div>
              <div className="space-y-1.5 break-words">
                {renderMessageContent(msg.text)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 bg-yellow-400 text-blue-950 border-2 border-slate-900 flex items-center justify-center font-black text-xs">
              AI
            </div>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-blue-900 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sedang Menganalisis Data...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Queries / Preset questions */}
      {messages.length === 1 && !isLoading && (
        <div className="shrink-0 pb-3">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block mb-2">Soalan Lazim:</span>
          <div className="flex flex-col gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(p)}
                className="text-[10px] bg-slate-50 hover:bg-yellow-400 text-slate-700 hover:text-blue-950 hover:border-slate-800 px-3 py-1.5 rounded-none border-2 border-slate-200/80 transition-all text-left font-bold uppercase tracking-wide cursor-pointer truncate"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative shrink-0 flex items-center gap-2 pt-2 border-t border-slate-100">
        <input
          id="chat-input-text"
          type="text"
          placeholder="Tanya mengenai ahli kelab, guru penasihat, stats..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          className="flex-1 bg-slate-50 border-2 border-slate-200 pl-4 pr-11 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-900 transition-all font-medium"
        />
        <button
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          className={`absolute right-1.5 top-[14px] w-8 h-8 rounded-none flex items-center justify-center transition-all border ${
            inputText.trim() && !isLoading
              ? 'bg-blue-900 text-white border-blue-950 hover:bg-blue-800'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
