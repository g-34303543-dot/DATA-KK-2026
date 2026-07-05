/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from 'recharts';
import { Users, GraduationCap, Award, BarChart3, TrendingUp, Info } from 'lucide-react';
import { Student, Teacher } from '../types';
import { getStats } from '../utils/dataAnalysis';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  onSelectUnit: (unitName: string, category: 'uniform' | 'club' | 'sport') => void;
}

export default function Dashboard({ students, teachers, onSelectUnit }: DashboardProps) {
  const stats = useMemo(() => getStats(students, teachers), [students, teachers]);

  // Premium corporate high-contrast colors
  const COLORS = ['#1e3a8a', '#d97706', '#0284c7', '#7c3aed', '#db2777', '#059669', '#ea580c', '#475569'];

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 text-white px-3 py-2 text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
          <p className="font-bold text-yellow-400">{payload[0].name}</p>
          <p className="text-white mt-0.5">{payload[0].value} Ahli Murid</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards - Bold Typography & Heavy Border styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white border-2 border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Jumlah Keseluruhan Murid</span>
            <span className="text-5xl font-black text-blue-900 leading-none tabular-nums tracking-tight">
              {stats.totalStudents.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Pagi: {stats.pagiStudents} | Petang: {stats.petangStudents}
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white border-2 border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Jumlah Guru Penasihat</span>
            <span className="text-5xl font-black text-blue-900 leading-none tabular-nums tracking-tight">
              {stats.totalTeachers}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Pagi: {stats.pagiTeachers} | Petang: {stats.petangTeachers}
          </div>
        </div>

        {/* Highlight Box - Deep Blue & Vivid Yellow accent block */}
        <div className="bg-blue-900 text-white p-6 border-2 border-blue-950 col-span-1 md:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 select-none pointer-events-none">
            <Award className="w-36 h-36 text-yellow-400" />
          </div>
          
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5">Tumpuan Khas</span>
              <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Kelab Seni Tari</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">
              139 Ahli • 6 Guru Penasihat
            </h3>
            <p className="text-xs text-blue-200 mt-1.5 max-w-md leading-relaxed font-medium">
              Sesi Pagi (47 murid) diketuai oleh Evelyn Alin. Sesi Petang (92 murid) dikerahkan aktif di bawah pimpinan Dayang Noraslina.
            </p>
          </div>

          <div className="z-10 mt-4 text-[10px] font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            Unit Teramai Sesi Petang
          </div>
        </div>
      </div>

      {/* Visual Charts Grid - Solid containers, sharp headers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Uniform Chart */}
        <div className="bg-white border-2 border-slate-200 p-5 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4 shrink-0 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">Unit Beruniform</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Pasukan & Pengagihan Murid</p>
            </div>
            <span className="text-[9px] font-black bg-blue-900 text-white px-2 py-1 uppercase tracking-widest">8 Unit</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.uniformStats} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" fontSize={10} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" fontSize={9} width={90} stroke="#475569" tickFormatter={(v) => v.split(' (')[0].substring(0, 15)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#1e3a8a" radius={[0, 0, 0, 0]}>
                  {stats.uniformStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} onClick={() => onSelectUnit(entry.name, 'uniform')} className="cursor-pointer hover:opacity-85" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Club Chart */}
        <div className="bg-white border-2 border-slate-200 p-5 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4 shrink-0 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">Kelab & Persatuan</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Akademik & Minat Pelajar</p>
            </div>
            <span className="text-[9px] font-black bg-blue-900 text-white px-2 py-1 uppercase tracking-widest">8 Kelab</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.clubStats} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" fontSize={10} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" fontSize={9} width={90} stroke="#475569" tickFormatter={(v) => v.substring(0, 15)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#d97706" radius={[0, 0, 0, 0]}>
                  {stats.clubStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} onClick={() => onSelectUnit(entry.name, 'club')} className="cursor-pointer hover:opacity-85" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sport Chart */}
        <div className="bg-white border-2 border-slate-200 p-5 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4 shrink-0 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">Sukan & Permainan</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Kesihatan & Kebolehpasaran Sukan</p>
            </div>
            <span className="text-[9px] font-black bg-blue-900 text-white px-2 py-1 uppercase tracking-widest">8 Sukan</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.sportStats} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" fontSize={10} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" fontSize={9} width={90} stroke="#475569" tickFormatter={(v) => v.substring(0, 15)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0284c7" radius={[0, 0, 0, 0]}>
                  {stats.sportStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} onClick={() => onSelectUnit(entry.name, 'sport')} className="cursor-pointer hover:opacity-85" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Guide Note - Yellow Accent box with deep-blue branding */}
      <div className="bg-yellow-400 p-6 border-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-blue-900 font-black text-lg uppercase tracking-tighter">Saranan Penggunaan Pintar</p>
          <p className="text-blue-800 text-xs font-semibold leading-relaxed max-w-2xl">
            Sila klik mana-mana unit dalam bar warna di atas untuk meneliti **Senarai Ahli Murid** dan **Guru Penasihat** secara langsung bagi unit kokurikulum tersebut!
          </p>
        </div>
      </div>
    </div>
  );
}
