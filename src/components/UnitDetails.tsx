/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Users, User, ArrowUpDown, Search } from 'lucide-react';
import { Student, Teacher } from '../types';

interface UnitDetailsProps {
  unitName: string;
  category: 'uniform' | 'club' | 'sport';
  students: Student[];
  teachers: Teacher[];
  onBack: () => void;
}

export default function UnitDetails({ unitName, category, students, teachers, onBack }: UnitDetailsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Pagi' | 'Petang'>('All');

  // Filter students belonging to this unit
  const unitStudents = useMemo(() => {
    return students.filter(s => {
      const matchUnit = 
        (category === 'uniform' && s.badanBeruniform === unitName) ||
        (category === 'club' && s.kelabPersatuan === unitName) ||
        (category === 'sport' && s.sukanPermainan === unitName);
      return matchUnit;
    });
  }, [students, unitName, category]);

  // Filter teachers belonging to this unit
  const unitTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchUnit = 
        (category === 'uniform' && t.badanBeruniform === unitName) ||
        (category === 'club' && t.kelabPersatuan === unitName) ||
        (category === 'sport' && t.sukanPermainan === unitName);
      return matchUnit;
    });
  }, [teachers, unitName, category]);

  // Group teachers by session
  const pagiTeachers = useMemo(() => unitTeachers.filter(t => t.sesi === 'Pagi'), [unitTeachers]);
  const petangTeachers = useMemo(() => unitTeachers.filter(t => t.sesi === 'Petang'), [unitTeachers]);

  // Apply search query and session filters on the roster
  const filteredStudents = useMemo(() => {
    return unitStudents.filter(s => {
      const matchQuery = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSession = sessionFilter === 'All' || s.sesi === sessionFilter;
      return matchQuery && matchSession;
    });
  }, [unitStudents, searchQuery, sessionFilter]);

  return (
    <div className="bg-white border-2 border-slate-200 p-6 space-y-6 shadow-sm">
      {/* Header with Back button */}
      <div className="flex items-center gap-4 border-b-2 border-slate-200 pb-4">
        <button 
          onClick={onBack}
          className="p-2 border-2 border-slate-200 text-blue-900 hover:bg-slate-100 transition-all font-bold cursor-pointer rounded-none flex items-center justify-center shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-white bg-blue-900 px-3 py-1 border border-blue-950">
            {category === 'uniform' ? 'Unit Beruniform' : category === 'club' ? 'Kelab & Persatuan' : 'Sukan & Permainan'}
          </span>
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight font-display mt-2">{unitName}</h2>
        </div>
      </div>

      {/* Advisors Section */}
      <div className="space-y-3 bg-slate-50 p-5 border-2 border-slate-200">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
          <User className="w-4 h-4 text-blue-900" />
          Guru Penasihat ({unitTeachers.length} Orang)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Morning Advisors */}
          <div className="bg-white p-4 border-2 border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-blue-950 bg-yellow-400 border border-yellow-500 px-2.5 py-0.5 block w-fit mb-3">Sesi Pagi ({pagiTeachers.length})</span>
            {pagiTeachers.length > 0 ? (
              <ul className="space-y-1.5">
                {pagiTeachers.map(t => (
                  <li key={t.id} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 shrink-0"></span>
                    <span>{t.nama}</span> 
                    <span className="text-[9px] font-mono font-medium text-slate-400">(ID: {t.id})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-xs text-slate-400 italic block">Tiada guru penasihat sesi pagi</span>
            )}
          </div>

          {/* Evening Advisors */}
          <div className="bg-white p-4 border-2 border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-blue-900 border border-blue-950 px-2.5 py-0.5 block w-fit mb-3">Sesi Petang ({petangTeachers.length})</span>
            {petangTeachers.length > 0 ? (
              <ul className="space-y-1.5">
                {petangTeachers.map(t => (
                  <li key={t.id} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 shrink-0"></span>
                    <span>{t.nama}</span> 
                    <span className="text-[9px] font-mono font-medium text-slate-400">(ID: {t.id})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-xs text-slate-400 italic block">Tiada guru penasihat sesi petang</span>
            )}
          </div>
        </div>
      </div>

      {/* Roster Section */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-display">
              <Users className="w-4 h-4 text-blue-900" />
              Senarai Ahli Murid ({unitStudents.length} Orang)
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight font-medium mt-0.5">Roster penuh ahli murid bagi unit ini</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                id="roster-search-input"
                type="text"
                placeholder="Cari murid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-blue-900 text-slate-700 font-semibold rounded-none h-[36px]"
              />
            </div>

            {/* Session dropdown */}
            <select
              id="roster-session-select"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value as any)}
              className="px-2 py-1.5 text-xs bg-slate-50 border-2 border-slate-200 text-slate-700 focus:outline-none font-bold uppercase tracking-wide h-[36px]"
            >
              <option value="All">Semua Sesi</option>
              <option value="Pagi">Sesi Pagi</option>
              <option value="Petang">Sesi Petang</option>
            </select>
          </div>
        </div>

        {/* Scrollable Table - Thick layout with heavy header */}
        <div className="border-2 border-slate-200 overflow-hidden max-h-[300px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-blue-900 text-white font-black uppercase tracking-widest text-[9px] select-none border-b-2 border-blue-950">
                <th className="p-3">No ID</th>
                <th className="p-3">Nama Ahli</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Sesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 border-b border-slate-100">
                    <td className="p-3 font-mono font-semibold text-slate-500">{s.id}</td>
                    <td className="p-3 font-black text-slate-800 uppercase font-display tracking-tight">{s.nama}</td>
                    <td className="p-3">
                      <span className="bg-slate-200 px-2 py-0.5 text-slate-800 font-black text-[9px] border border-slate-300">
                        {s.kelas}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                        s.sesi === 'Pagi' 
                          ? 'bg-yellow-400 text-blue-950 border-yellow-500' 
                          : 'bg-blue-900 text-white border-blue-950'
                      }`}>
                        Sesi {s.sesi}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                    Tiada ahli murid dijumpai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
