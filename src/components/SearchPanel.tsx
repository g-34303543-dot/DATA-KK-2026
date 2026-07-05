/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, User, Briefcase, GraduationCap, School, MapPin } from 'lucide-react';
import { Student, Teacher } from '../types';

interface SearchPanelProps {
  students: Student[];
  teachers: Teacher[];
}

export default function SearchPanel({ students, teachers }: SearchPanelProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Pagi' | 'Petang'>('All');
  const [classFilter, setClassFilter] = useState('All');

  // Compute available classes for filtering
  const classesList = useMemo(() => {
    const list = students.map(s => s.kelas).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchQuery = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSession = sessionFilter === 'All' || s.sesi === sessionFilter;
      const matchClass = classFilter === 'All' || s.kelas === classFilter;
      return matchQuery && matchSession && matchClass;
    });
  }, [students, searchQuery, sessionFilter, classFilter]);

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchQuery = t.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSession = sessionFilter === 'All' || t.sesi === sessionFilter;
      return matchQuery && matchSession;
    });
  }, [teachers, searchQuery, sessionFilter]);

  return (
    <div className="bg-white border-2 border-slate-200 p-6 flex flex-col h-[600px] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <h2 className="text-lg font-black text-blue-900 uppercase tracking-tight flex items-center gap-2 font-display">
          <School className="w-5 h-5 text-blue-900" />
          Pangkalan Data Sekolah
        </h2>
        
        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 border border-slate-200 gap-1">
          <button
            onClick={() => { setActiveTab('students'); setSearchQuery(''); }}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'students' 
                ? 'bg-blue-900 text-white' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/55'
            }`}
          >
            Murid ({students.length})
          </button>
          <button
            onClick={() => { setActiveTab('teachers'); setSearchQuery(''); }}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'teachers' 
                ? 'bg-blue-900 text-white' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/55'
            }`}
          >
            Guru ({teachers.length})
          </button>
        </div>
      </div>

      {/* Filters Area - blocky elements with heavy text input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            id="search-query-input"
            type="text"
            placeholder={activeTab === 'students' ? "Cari nama atau No ID murid..." : "Cari nama guru..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-blue-900 transition-all text-slate-700 placeholder-slate-400 font-medium"
          />
        </div>

        <div>
          <select
            id="session-filter-select"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-blue-900 transition-all text-slate-700 font-bold uppercase tracking-wider text-xs h-[38px]"
          >
            <option value="All">Semua Sesi</option>
            <option value="Pagi">Sesi Pagi</option>
            <option value="Petang">Sesi Petang</option>
          </select>
        </div>

        {activeTab === 'students' && (
          <div>
            <select
              id="class-filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-blue-900 transition-all text-slate-700 font-bold uppercase tracking-wider text-xs h-[38px]"
            >
              <option value="All">Semua Kelas</option>
              {classesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Scrollable Results List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activeTab === 'students' ? (
          filteredStudents.length > 0 ? (
            filteredStudents.slice(0, 100).map((s) => (
              <div 
                key={s.id} 
                className="p-4 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5">ID: {s.id}</span>
                    <span className="text-[9px] font-black text-blue-900 bg-blue-50 border border-blue-900/10 px-2 py-0.5 uppercase tracking-wider">{s.kelas}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 border uppercase tracking-wider ${
                      s.sesi === 'Pagi' 
                        ? 'bg-yellow-400 text-blue-950 border-yellow-500/20' 
                        : 'bg-blue-900 text-white border-blue-950'
                    }`}>
                      Sesi {s.sesi}
                    </span>
                  </div>
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight font-display">{s.nama}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 md:mt-0 text-[11px] text-slate-600 w-full md:w-auto">
                  <div className="bg-slate-50 px-2 py-1 border border-slate-200 min-w-[100px]">
                    <span className="block text-[8px] text-slate-400 uppercase font-black tracking-wider">Uniform</span>
                    <span className="font-bold text-slate-700 truncate block max-w-[120px]">{s.badanBeruniform || 'Tiada'}</span>
                  </div>
                  <div className="bg-slate-50 px-2 py-1 border border-slate-200 min-w-[100px]">
                    <span className="block text-[8px] text-slate-400 uppercase font-black tracking-wider">Kelab</span>
                    <span className="font-bold text-slate-700 truncate block max-w-[120px]">{s.kelabPersatuan || 'Tiada'}</span>
                  </div>
                  <div className="bg-slate-50 px-2 py-1 border border-slate-200 min-w-[100px]">
                    <span className="block text-[8px] text-slate-400 uppercase font-black tracking-wider">Sukan</span>
                    <span className="font-bold text-slate-700 truncate block max-w-[120px]">{s.sukanPermainan || 'Tiada'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
              <GraduationCap className="w-12 h-12 text-slate-200 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tiada murid ditemui</span>
            </div>
          )
        ) : (
          filteredTeachers.length > 0 ? (
            filteredTeachers.map((t) => (
              <div 
                key={t.id} 
                className="p-4 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5">ID: {t.id}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 border uppercase tracking-wider ${
                      t.sesi === 'Pagi' 
                        ? 'bg-yellow-400 text-blue-950 border-yellow-500/20' 
                        : 'bg-blue-900 text-white border-blue-950'
                    }`}>
                      Sesi {t.sesi}
                    </span>
                  </div>
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight font-display">{t.nama}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 md:mt-0 text-[11px] text-slate-600 w-full md:w-auto">
                  <div className="bg-slate-50 px-2 py-1 border border-slate-200 min-w-[100px]">
                    <span className="block text-[8px] text-slate-400 uppercase font-black tracking-wider">Uniform</span>
                    <span className="font-bold text-slate-700 truncate block max-w-[120px]">{t.badanBeruniform || 'Tiada'}</span>
                  </div>
                  <div className="bg-slate-50 px-2 py-1 border border-slate-200 min-w-[100px]">
                    <span className="block text-[8px] text-slate-400 uppercase font-black tracking-wider">Kelab</span>
                    <span className="font-bold text-slate-700 truncate block max-w-[120px]">{t.kelabPersatuan || 'Tiada'}</span>
                  </div>
                  <div className="bg-slate-50 px-2 py-1 border border-slate-200 min-w-[100px]">
                    <span className="block text-[8px] text-slate-400 uppercase font-black tracking-wider">Sukan</span>
                    <span className="font-bold text-slate-700 truncate block max-w-[120px]">{t.sukanPermainan || 'Tiada'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
              <Briefcase className="w-12 h-12 text-slate-200 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tiada guru ditemui</span>
            </div>
          )
        )}
      </div>

      <div className="border-t border-slate-200 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
        <span>Rekod: {activeTab === 'students' ? Math.min(filteredStudents.length, 100) : filteredTeachers.length} / {activeTab === 'students' ? filteredStudents.length : filteredTeachers.length}</span>
        {activeTab === 'students' && filteredStudents.length > 100 && <span>(Had paparan 100 rekod)</span>}
      </div>
    </div>
  );
}
