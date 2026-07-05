/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Teacher, DashboardStats } from '../types';

export function getStats(students: Student[], teachers: Teacher[]): DashboardStats {
  const pagiStudents = students.filter(s => s.sesi === 'Pagi').length;
  const petangStudents = students.filter(s => s.sesi === 'Petang').length;
  const pagiTeachers = teachers.filter(t => t.sesi === 'Pagi').length;
  const petangTeachers = teachers.filter(t => t.sesi === 'Petang').length;

  // Calculate Uniform stats
  const uniformMap: Record<string, number> = {};
  students.forEach(s => {
    if (s.badanBeruniform) {
      uniformMap[s.badanBeruniform] = (uniformMap[s.badanBeruniform] || 0) + 1;
    }
  });
  const uniformStats = Object.entries(uniformMap).map(([name, value]) => ({ name, value }));

  // Calculate Club stats
  const clubMap: Record<string, number> = {};
  students.forEach(s => {
    if (s.kelabPersatuan) {
      clubMap[s.kelabPersatuan] = (clubMap[s.kelabPersatuan] || 0) + 1;
    }
  });
  const clubStats = Object.entries(clubMap).map(([name, value]) => ({ name, value }));

  // Calculate Sport stats
  const sportMap: Record<string, number> = {};
  students.forEach(s => {
    if (s.sukanPermainan) {
      sportMap[s.sukanPermainan] = (sportMap[s.sukanPermainan] || 0) + 1;
    }
  });
  const sportStats = Object.entries(sportMap).map(([name, value]) => ({ name, value }));

  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    pagiStudents,
    petangStudents,
    pagiTeachers,
    petangTeachers,
    uniformStats,
    clubStats,
    sportStats
  };
}

export function compileContextSummary(students: Student[], teachers: Teacher[]): string {
  const stats = getStats(students, teachers);
  
  // Get list of unique units
  const uniforms = Array.from(new Set(students.map(s => s.badanBeruniform).filter(Boolean)));
  const clubs = Array.from(new Set(students.map(s => s.kelabPersatuan).filter(Boolean)));
  const sports = Array.from(new Set(students.map(s => s.sukanPermainan).filter(Boolean)));

  let summary = `STATISTIK RINGKAS SMK MUARA TUANG 2026:\n`;
  summary += `- Jumlah Murid: ${stats.totalStudents} orang (Sesi Pagi: ${stats.pagiStudents}, Sesi Petang: ${stats.petangStudents})\n`;
  summary += `- Jumlah Guru: ${stats.totalTeachers} orang (Sesi Pagi: ${stats.pagiTeachers}, Sesi Petang: ${stats.petangTeachers})\n\n`;

  summary += `PERINCIAN UNIT BERUNIFORM:\n`;
  uniforms.forEach(u => {
    const totalU = students.filter(s => s.badanBeruniform === u).length;
    const pagiU = students.filter(s => s.badanBeruniform === u && s.sesi === 'Pagi').length;
    const petangU = students.filter(s => s.badanBeruniform === u && s.sesi === 'Petang').length;
    const advisors = teachers.filter(t => t.badanBeruniform === u).map(t => `${t.nama} (${t.sesi})`);
    summary += `- ${u}:\n`;
    summary += `  * Ahli Murid: ${totalU} (Pagi: ${pagiU}, Petang: ${petangU})\n`;
    summary += `  * Guru Penasihat: ${advisors.length} orang [${advisors.join(', ')}]\n`;
  });

  summary += `\nPERINCIAN KELAB & PERSATUAN:\n`;
  clubs.forEach(c => {
    const totalC = students.filter(s => s.kelabPersatuan === c).length;
    const pagiC = students.filter(s => s.kelabPersatuan === c && s.sesi === 'Pagi').length;
    const petangC = students.filter(s => s.kelabPersatuan === c && s.sesi === 'Petang').length;
    const advisors = teachers.filter(t => t.kelabPersatuan === c).map(t => `${t.nama} (${t.sesi})`);
    summary += `- ${c}:\n`;
    summary += `  * Ahli Murid: ${totalC} (Pagi: ${pagiC}, Petang: ${petangC})\n`;
    summary += `  * Guru Penasihat: ${advisors.length} orang [${advisors.join(', ')}]\n`;
  });

  summary += `\nPERINCIAN SUKAN & PERMAINAN:\n`;
  sports.forEach(sport => {
    const totalS = students.filter(s => s.sukanPermainan === sport).length;
    const pagiS = students.filter(s => s.sukanPermainan === sport && s.sesi === 'Pagi').length;
    const petangS = students.filter(s => s.sukanPermainan === sport && s.sesi === 'Petang').length;
    const advisors = teachers.filter(t => t.sukanPermainan === sport).map(t => `${t.nama} (${t.sesi})`);
    summary += `- ${sport}:\n`;
    summary += `  * Ahli Murid: ${totalS} (Pagi: ${pagiS}, Petang: ${petangS})\n`;
    summary += `  * Guru Penasihat: ${advisors.length} orang [${advisors.join(', ')}]\n`;
  });

  return summary;
}

export function searchContext(query: string, students: Student[], teachers: Teacher[]): string {
  const q = query.toLowerCase();
  
  // Search for teachers
  const matchedTeachers = teachers.filter(t => 
    t.nama.toLowerCase().includes(q) || 
    t.id.toLowerCase().includes(q)
  );

  // Search for students (limit to first 15 matches to avoid blowing up context size)
  const matchedStudents = students.filter(s => 
    s.nama.toLowerCase().includes(s.nama.toLowerCase().includes(q) ? q : '') || 
    s.id.toLowerCase().includes(q) ||
    s.kelas.toLowerCase().includes(q)
  ).slice(0, 15);

  let result = "";
  if (matchedTeachers.length > 0) {
    result += `\nGURU DIJUMPAI (${matchedTeachers.length} orang):\n`;
    matchedTeachers.forEach(t => {
      result += `- ${t.nama} (ID: ${t.id}, Sesi: ${t.sesi}) -> Uniform: ${t.badanBeruniform}, Kelab: ${t.kelabPersatuan}, Sukan: ${t.sukanPermainan}\n`;
    });
  }

  if (matchedStudents.length > 0) {
    result += `\nMURID DIJUMPAI (${matchedStudents.length} orang, dipaparkan max 15):\n`;
    matchedStudents.forEach(s => {
      result += `- ${s.nama} (ID: ${s.id}, Kelas: ${s.kelas}, Sesi: ${s.sesi}) -> Uniform: ${s.badanBeruniform}, Kelab: ${s.kelabPersatuan}, Sukan: ${s.sukanPermainan}\n`;
    });
  }

  return result;
}
