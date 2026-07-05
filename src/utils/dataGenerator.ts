/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Teacher } from '../types';

// Simple LCG (Linear Congruential Generator) for seedable deterministic random
function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const FIRST_NAMES_MALAY_M = ["Ahmad", "Muhammad", "Mohamad", "Amirul", "Firdaus", "Farhan", "Haziq", "Syamil", "Aiman", "Luqman", "Zulhelmi", "Khairul", "Zaim", "Syazwan", "Irfan", "Danial"];
const FIRST_NAMES_MALAY_F = ["Siti", "Nur", "Nurul", "Farah", "Aishah", "Amira", "Balqis", "Hidayah", "Syaza", "Adlina", "Fatin", "Nabilah", "Anis", "Syazwani", "Suhaila", "Izzati"];
const LAST_NAMES_MALAY_M = ["Rosli", "Ismail", "Ramli", "Hassan", "Ibrahim", "Osman", "Yusof", "Halim", "Salleh", "Zainal", "Rahman", "Ghazali", "Zulkifli", "Ariffin", "Hamid"];
const LAST_NAMES_MALAY_F = ["Ismail", "Ramli", "Hassan", "Osman", "Yusof", "Halim", "Salleh", "Zainal", "Rahman", "Ghazali", "Zulkifli", "Ariffin", "Hamid"];

const SURNAMES_CHINESE = ["Tan", "Lim", "Lee", "Wong", "Chan", "Chong", "Goh", "Teo", "Yong", "Chia", "Ng", "Tiong", "Sim", "Kueh", "Lau", "Hii"];
const FIRST_NAMES_CHINESE_M = ["Wei Meng", "Jun Jie", "Kah Seng", "Zhi Hao", "Seng Kong", "Jia Hao", "Wei Jian", "Yee Cheng", "Kok Wai", "Ming Jie"];
const FIRST_NAMES_CHINESE_F = ["Siew Ling", "Zi Xuan", "Yee Wen", "Mei Xin", "Pui Yee", "Shu Qi", "Ying Ying", "Hui Min", "Jia Yi", "Li Ting"];

const FIRST_NAMES_NATIVE = ["Lona", "Edwina", "Rampini", "Evelyn", "Sunny", "Alin", "Alvin", "Douglas", "Florence", "Jacqueline", "Patricia", "Jimbai", "Nicholas", "Garith", "Eileen", "Clara"];
const LAST_NAMES_NATIVE = ["Benjamin", "Dennis", "John", "Stewart", "Richard", "Peter", "Abang", "Suhaili", "Francesca", "Nyelang", "Rega", "Sengalang", "Ridu", "Bujang"];

const UNIFORM_UNITS = [
  "Kadet Remaja Sekolah (KRS)",
  "Kadet Polis",
  "Kadet Bomba",
  "Pengakap",
  "Pandu Puteri",
  "Bulan Sabit Merah Malaysia (BSMM)",
  "Pergerakan Puteri Islam Malaysia (PPIM)",
  "St. John Ambulans Malaysia (SJAM)"
];

const CLUBS = [
  "Kelab Seni Tari",
  "Persatuan Bahasa Melayu",
  "Persatuan Bahasa Inggeris",
  "Kelab Sains & Matematik",
  "Kelab Komputer",
  "Kelab Rukun Negara",
  "Kelab Kebudayaan & Kesenian",
  "Persatuan Agama Islam"
];

const SPORTS = [
  "Bola Sepak",
  "Badminton",
  "Ping Pong",
  "Bola Jaring",
  "Bola Tampar",
  "Olahraga",
  "Catur",
  "Sepak Takraw"
];

const KELAS_PAGI = ["3 Amanah", "3 Bestari", "3 Cerdas", "3 Dinamik", "4 Amanah", "4 Bestari", "4 Cerdas", "4 Dinamik", "5 Amanah", "5 Bestari", "5 Cerdas", "5 Dinamik"];
const KELAS_PETANG = ["1 Amanah", "1 Bestari", "1 Cerdas", "1 Dinamik", "2 Amanah", "2 Bestari", "2 Cerdas", "2 Dinamik"];

export function generateSMKData(): { students: Student[]; teachers: Teacher[] } {
  // Let's use seed 2026 so that it generates consistent results
  const rand = createRandom(2026);
  
  // Create 6 specific teachers for Kelab Seni Tari
  const specificSeniTariTeachers: Teacher[] = [
    {
      id: "G001",
      nama: "Evelyn Alin Lim Ai Ling",
      sesi: "Pagi",
      badanBeruniform: "Bulan Sabit Merah Malaysia (BSMM)",
      kelabPersatuan: "Kelab Seni Tari",
      sukanPermainan: "Badminton"
    },
    {
      id: "G002",
      nama: "Lona Anak Benjamin",
      sesi: "Pagi",
      badanBeruniform: "Kadet Remaja Sekolah (KRS)",
      kelabPersatuan: "Kelab Seni Tari",
      sukanPermainan: "Catur"
    },
    {
      id: "G003",
      nama: "Nurul Hamiezatul Yasmin Bt Abdullah",
      sesi: "Pagi",
      badanBeruniform: "Pergerakan Puteri Islam Malaysia (PPIM)",
      kelabPersatuan: "Kelab Seni Tari",
      sukanPermainan: "Bola Tampar"
    },
    {
      id: "G004",
      nama: "Dayang Noraslina Binti Abang Suhaili",
      sesi: "Petang",
      badanBeruniform: "Pandu Puteri",
      kelabPersatuan: "Kelab Seni Tari",
      sukanPermainan: "Bola Jaring"
    },
    {
      id: "G005",
      nama: "Edwina Sunny Anak Dennis",
      sesi: "Petang",
      badanBeruniform: "Pengakap",
      kelabPersatuan: "Kelab Seni Tari",
      sukanPermainan: "Ping Pong"
    },
    {
      id: "G006",
      nama: "Rampini Francesca",
      sesi: "Petang",
      badanBeruniform: "Kadet Polis",
      kelabPersatuan: "Kelab Seni Tari",
      sukanPermainan: "Olahraga"
    }
  ];

  // Generate other 127 teachers to get exactly 133
  const teachers: Teacher[] = [...specificSeniTariTeachers];
  const teacherIdSet = new Set<string>(teachers.map(t => t.id));

  while (teachers.length < 133) {
    const tIdNum = teachers.length + 1;
    const id = `G${String(tIdNum).padStart(3, '0')}`;
    const sesi = rand() > 0.55 ? "Pagi" : "Petang";
    
    // Choose uniform unit (PPIM only for females, etc, but simple is fine)
    const uniIdx = Math.floor(rand() * UNIFORM_UNITS.length);
    const uniform = UNIFORM_UNITS[uniIdx];
    
    // Choose club (avoid Kelab Seni Tari to keep it exactly 6 advisors)
    let club = "";
    do {
      const clubIdx = Math.floor(rand() * CLUBS.length);
      club = CLUBS[clubIdx];
    } while (club === "Kelab Seni Tari");
    
    // Choose sport
    const sportIdx = Math.floor(rand() * SPORTS.length);
    const sport = SPORTS[sportIdx];

    // Generate a beautiful name
    let nama = "";
    const nameType = rand();
    if (nameType < 0.4) {
      // Malay Male or Female
      const isMale = rand() > 0.5;
      const fn = isMale ? FIRST_NAMES_MALAY_M[Math.floor(rand() * FIRST_NAMES_MALAY_M.length)] : FIRST_NAMES_MALAY_F[Math.floor(rand() * FIRST_NAMES_MALAY_F.length)];
      const ln = isMale ? LAST_NAMES_MALAY_M[Math.floor(rand() * LAST_NAMES_MALAY_M.length)] : LAST_NAMES_MALAY_F[Math.floor(rand() * LAST_NAMES_MALAY_F.length)];
      const connector = isMale ? "bin" : "binti";
      nama = `${fn} ${connector} ${ln}`;
    } else if (nameType < 0.7) {
      // Chinese
      const isMale = rand() > 0.5;
      const sn = SURNAMES_CHINESE[Math.floor(rand() * SURNAMES_CHINESE.length)];
      const fn = isMale ? FIRST_NAMES_CHINESE_M[Math.floor(rand() * FIRST_NAMES_CHINESE_M.length)] : FIRST_NAMES_CHINESE_F[Math.floor(rand() * FIRST_NAMES_CHINESE_F.length)];
      nama = `${sn} ${fn}`;
    } else {
      // Sarawakian / Sabahan native
      const fn = FIRST_NAMES_NATIVE[Math.floor(rand() * FIRST_NAMES_NATIVE.length)];
      const ln = LAST_NAMES_NATIVE[Math.floor(rand() * LAST_NAMES_NATIVE.length)];
      nama = `${fn} anak ${ln}`;
    }

    // Ensure no duplicates in names
    if (!teachers.some(t => t.nama === nama)) {
      teachers.push({
        id,
        nama,
        sesi,
        badanBeruniform: uniform,
        kelabPersatuan: club,
        sukanPermainan: sport
      });
    }
  }

  // Generate 2,728 students
  const students: Student[] = [];
  
  // We need exactly 47 pagi students and 92 petang students for Kelab Seni Tari
  let seniTariPagiCount = 0;
  let seniTariPetangCount = 0;

  // Generate all 2,728 students
  for (let i = 0; i < 2728; i++) {
    const sIdNum = i + 1001;
    const id = String(sIdNum);
    
    // Choose Sesi based on quotas for Kelab Seni Tari or standard distribution
    // Let's split students ~55% Morning (Forms 3,4,5) and 45% Evening (Forms 1,2)
    // To ensure exact Seni Tari counts, we can control clubs selection
    let sesi: 'Pagi' | 'Petang' = 'Pagi';
    let club = "";

    // Force Seni Tari students
    if (seniTariPagiCount < 47) {
      sesi = 'Pagi';
      club = "Kelab Seni Tari";
      seniTariPagiCount++;
    } else if (seniTariPetangCount < 92) {
      sesi = 'Petang';
      club = "Kelab Seni Tari";
      seniTariPetangCount++;
    } else {
      // Standard distribution
      sesi = rand() > 0.45 ? 'Pagi' : 'Petang';
      // Pick club except Kelab Seni Tari
      let clubIdx = 0;
      do {
        clubIdx = Math.floor(rand() * CLUBS.length);
        club = CLUBS[clubIdx];
      } while (club === "Kelab Seni Tari");
    }

    // Choose class based on session
    let kelas = "";
    if (sesi === 'Pagi') {
      const kIdx = Math.floor(rand() * KELAS_PAGI.length);
      kelas = KELAS_PAGI[kIdx];
    } else {
      const kIdx = Math.floor(rand() * KELAS_PETANG.length);
      kelas = KELAS_PETANG[kIdx];
    }

    // Choose uniform unit
    const uniIdx = Math.floor(rand() * UNIFORM_UNITS.length);
    const uniform = UNIFORM_UNITS[uniIdx];

    // Choose sport
    const sportIdx = Math.floor(rand() * SPORTS.length);
    const sport = SPORTS[sportIdx];

    // Generate a beautiful name
    let nama = "";
    const nameType = rand();
    if (nameType < 0.45) {
      // Malay
      const isMale = rand() > 0.5;
      const fn = isMale ? FIRST_NAMES_MALAY_M[Math.floor(rand() * FIRST_NAMES_MALAY_M.length)] : FIRST_NAMES_MALAY_F[Math.floor(rand() * FIRST_NAMES_MALAY_F.length)];
      const ln = isMale ? LAST_NAMES_MALAY_M[Math.floor(rand() * LAST_NAMES_MALAY_M.length)] : LAST_NAMES_MALAY_F[Math.floor(rand() * LAST_NAMES_MALAY_F.length)];
      const connector = isMale ? "bin" : "binti";
      nama = `${fn} ${connector} ${ln}`;
    } else if (nameType < 0.75) {
      // Chinese
      const isMale = rand() > 0.5;
      const sn = SURNAMES_CHINESE[Math.floor(rand() * SURNAMES_CHINESE.length)];
      const fn = isMale ? FIRST_NAMES_CHINESE_M[Math.floor(rand() * FIRST_NAMES_CHINESE_M.length)] : FIRST_NAMES_CHINESE_F[Math.floor(rand() * FIRST_NAMES_CHINESE_F.length)];
      nama = `${sn} ${fn}`;
    } else {
      // Sarawakian / Sabahan native
      const fn = FIRST_NAMES_NATIVE[Math.floor(rand() * FIRST_NAMES_NATIVE.length)];
      const ln = LAST_NAMES_NATIVE[Math.floor(rand() * LAST_NAMES_NATIVE.length)];
      nama = `${fn} anak ${ln}`;
    }

    students.push({
      id,
      nama,
      kelas,
      sesi,
      badanBeruniform: uniform,
      kelabPersatuan: club,
      sukanPermainan: sport
    });
  }

  return { students, teachers };
}
