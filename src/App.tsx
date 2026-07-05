/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { generateSMKData } from './utils/dataGenerator';
import { Student, Teacher, ChatMessage } from './types';
import Dashboard from './components/Dashboard';
import SearchPanel from './components/SearchPanel';
import FileUpload from './components/FileUpload';
import ChatPanel from './components/ChatPanel';
import UnitDetails from './components/UnitDetails';
import { Sparkles, BarChart3, Database, Upload, Award } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'upload'>('dashboard');
  const [selectedUnit, setSelectedUnit] = useState<{ name: string; category: 'uniform' | 'club' | 'sport' } | null>(null);

  // Initial welcome messages for the AI chatbot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Initialize dataset on mount
  useEffect(() => {
    const data = generateSMKData();
    setStudents(data.students);
    setTeachers(data.teachers);

    // Initial greeting message from Assistant
    setChatMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Selamat sejahtera! Saya adalah **Pembantu AI Kokurikulum SMK Muara Tuang 2026**.\n\nSaya sedia membantu anda mencari rekod pelajar, mengesahkan agihan guru penasihat, melihat pecahan ahli bagi mana-mana kelab, serta memberikan statistik unit mengikut sesi.\n\nContoh soalan lazim yang boleh anda tanya saya:\n* **"Berapa orang ahli Kelab Seni Tari?"**\n* **"Siapakah guru penasihat Kelab Seni Tari?"**\n* **"Senaraikan statistik ahli Sesi Pagi vs Sesi Petang"**\n\nBagaimanakah saya boleh membantu anda hari ini?`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  const handleDataLoaded = (uploaded: { students?: Student[]; teachers?: Teacher[] }) => {
    if (uploaded.students) {
      setStudents(uploaded.students);
    }
    if (uploaded.teachers) {
      setTeachers(uploaded.teachers);
    }
    // Clear any active unit view to refresh dashboard stats
    setSelectedUnit(null);
  };

  const handleReset = () => {
    const original = generateSMKData();
    setStudents(original.students);
    setTeachers(original.teachers);
    setSelectedUnit(null);
  };

  const handleAddChatMessage = (newMsg: ChatMessage) => {
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleClearHistory = () => {
    setChatMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Sesi perbualan telah set semula. Saya sedia membantu anda menyemak sebarang data kokurikulum SMK Muara Tuang 2026 semula!`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleSelectUnitFromDashboard = (unitName: string, category: 'uniform' | 'club' | 'sport') => {
    setSelectedUnit({ name: unitName, category });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Header Banner with Bold Typography Theme */}
      <header className="bg-blue-900 text-white shrink-0 px-6 py-6 border-b-4 border-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-200 mb-1.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-yellow-400 animate-pulse"></span>
              SISTEM MAKLUMAT KOKURIKULUM
            </p>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight uppercase leading-none">
              SMK Muara Tuang <span className="text-yellow-400">2026</span>
            </h1>
          </div>

          {/* Quick Tab Selectors - Solid, blocky, styled in Neo-Brutalist fashion */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedUnit(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                activeTab === 'dashboard' && !selectedUnit
                  ? 'bg-yellow-400 text-blue-950 border-blue-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-blue-950/60 text-blue-100 border-blue-800 hover:bg-blue-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Statistik Ringkas
            </button>
            <button
              onClick={() => { setActiveTab('search'); setSelectedUnit(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                activeTab === 'search' && !selectedUnit
                  ? 'bg-yellow-400 text-blue-950 border-blue-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-blue-950/60 text-blue-100 border-blue-800 hover:bg-blue-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Carian Rekod
            </button>
            <button
              onClick={() => { setActiveTab('upload'); setSelectedUnit(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                activeTab === 'upload' && !selectedUnit
                  ? 'bg-yellow-400 text-blue-950 border-blue-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-blue-950/60 text-blue-100 border-blue-800 hover:bg-blue-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Muat Naik CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace split panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Left Interactive Panel (Dashboard/Search/Uploader/Unit Details) */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {selectedUnit ? (
            <UnitDetails
              unitName={selectedUnit.name}
              category={selectedUnit.category}
              students={students}
              teachers={teachers}
              onBack={() => setSelectedUnit(null)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  students={students}
                  teachers={teachers}
                  onSelectUnit={handleSelectUnitFromDashboard}
                />
              )}
              {activeTab === 'search' && (
                <SearchPanel
                  students={students}
                  teachers={teachers}
                />
              )}
              {activeTab === 'upload' && (
                <FileUpload
                  onDataLoaded={handleDataLoaded}
                  studentCount={students.length}
                  teacherCount={teachers.length}
                  onReset={handleReset}
                />
              )}
            </>
          )}
        </div>

        {/* Right Chat AI Panel (Persistent chatbot) */}
        <div className="lg:col-span-2">
          <ChatPanel
            students={students}
            teachers={teachers}
            messages={chatMessages}
            onAddMessage={handleAddChatMessage}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="bg-slate-200 p-3.5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 border-t border-slate-300 gap-2">
        <span>SMKMT 2026 AI Assistant V1.0</span>
        <span>Data Terkini: Jan 2026 • {students.length > 0 ? (students.length + teachers.length).toLocaleString() : '2,728'} Rekod Teranalisis</span>
      </footer>
    </div>
  );
}
