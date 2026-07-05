/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  nama: string;
  kelas: string;
  sesi: 'Pagi' | 'Petang';
  badanBeruniform: string;
  kelabPersatuan: string;
  sukanPermainan: string;
}

export interface Teacher {
  id: string;
  nama: string;
  sesi: 'Pagi' | 'Petang';
  badanBeruniform: string;
  kelabPersatuan: string;
  sukanPermainan: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  pagiStudents: number;
  petangStudents: number;
  pagiTeachers: number;
  petangTeachers: number;
  uniformStats: { name: string; value: number }[];
  clubStats: { name: string; value: number }[];
  sportStats: { name: string; value: number }[];
}
