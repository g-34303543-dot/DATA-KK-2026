/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Student, Teacher } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: { students?: Student[]; teachers?: Teacher[] }) => void;
  studentCount: number;
  teacherCount: number;
  onReset: () => void;
}

export default function FileUpload({ onDataLoaded, studentCount, teacherCount, onReset }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ students: boolean; teachers: boolean }>({
    students: false,
    teachers: false
  });

  const studentInputRef = useRef<HTMLInputElement>(null);
  const teacherInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const mapStudentRow = (row: any): Student | null => {
    // Normalise keys to lowercase without spaces or punctuation
    const normalized: Record<string, any> = {};
    Object.keys(row).forEach(k => {
      const normKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      normalized[normKey] = row[k];
    });

    // Find appropriate keys
    const nama = row['Nama Murid'] || row['NAMA MURID'] || row['Nama'] || row['NAMA'] || normalized['namamurid'] || normalized['nama'] || '';
    const id = row['No ID'] || row['ID'] || row['No. ID'] || normalized['noid'] || normalized['id'] || '';
    const kelas = row['Kelas'] || row['KELAS'] || normalized['kelas'] || '';
    const sesiRaw = row['Sesi'] || row['SESI'] || normalized['sesi'] || '';
    const badanBeruniform = row['Unit Beruniform'] || row['UNIT BERUNIFORM'] || row['Badan Beruniform'] || normalized['unitberuniform'] || normalized['badanberuniform'] || '';
    const kelabPersatuan = row['Kelab/Persatuan'] || row['KELAB/PERSATUAN'] || row['Kelab Persatuan'] || normalized['kelabpersatuan'] || normalized['kelab'] || '';
    const sukanPermainan = row['Sukan/Permainan'] || row['SUKAN/PERMAINAN'] || row['Sukan Permainan'] || normalized['sukanpermainan'] || normalized['sukan'] || '';

    if (!nama) return null;

    const sesi: 'Pagi' | 'Petang' = sesiRaw.toString().toLowerCase().includes('petang') ? 'Petang' : 'Pagi';

    return {
      id: id.toString().trim() || Math.random().toString(36).substr(2, 9),
      nama: nama.toString().trim(),
      kelas: kelas.toString().trim(),
      sesi,
      badanBeruniform: badanBeruniform.toString().trim(),
      kelabPersatuan: kelabPersatuan.toString().trim(),
      sukanPermainan: sukanPermainan.toString().trim()
    };
  };

  const mapTeacherRow = (row: any): Teacher | null => {
    const normalized: Record<string, any> = {};
    Object.keys(row).forEach(k => {
      const normKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      normalized[normKey] = row[k];
    });

    const nama = row['Nama Guru'] || row['NAMA GURU'] || row['Nama'] || row['NAMA'] || normalized['namaguru'] || normalized['nama'] || '';
    const id = row['No ID'] || row['ID'] || normalized['noid'] || normalized['id'] || '';
    const sesiRaw = row['Sesi'] || row['SESI'] || normalized['sesi'] || '';
    const badanBeruniform = row['Unit Beruniform'] || row['UNIT BERUNIFORM'] || row['Badan Beruniform'] || normalized['unitberuniform'] || normalized['badanberuniform'] || '';
    const kelabPersatuan = row['Kelab/Persatuan'] || row['KELAB/PERSATUAN'] || row['Kelab Persatuan'] || normalized['kelabpersatuan'] || normalized['kelab'] || '';
    const sukanPermainan = row['Sukan/Permainan'] || row['SUKAN/PERMAINAN'] || row['Sukan Permainan'] || normalized['sukanpermainan'] || normalized['sukan'] || '';

    if (!nama) return null;

    const sesi: 'Pagi' | 'Petang' = sesiRaw.toString().toLowerCase().includes('petang') ? 'Petang' : 'Pagi';

    return {
      id: id.toString().trim() || Math.random().toString(36).substr(2, 9),
      nama: nama.toString().trim(),
      sesi,
      badanBeruniform: badanBeruniform.toString().trim(),
      kelabPersatuan: kelabPersatuan.toString().trim(),
      sukanPermainan: sukanPermainan.toString().trim()
    };
  };

  const handleFile = (file: File, type: 'students' | 'teachers') => {
    setError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          if (type === 'students') {
            const parsedStudents: Student[] = [];
            results.data.forEach((row: any) => {
              const item = mapStudentRow(row);
              if (item) parsedStudents.push(item);
            });
            if (parsedStudents.length > 0) {
              onDataLoaded({ students: parsedStudents });
              setStatus(prev => ({ ...prev, students: true }));
            } else {
              setError("Sila pastikan fail mengandungi lajur 'Nama Murid', 'Sesi', 'Kelas' dll.");
            }
          } else {
            const parsedTeachers: Teacher[] = [];
            results.data.forEach((row: any) => {
              const item = mapTeacherRow(row);
              if (item) parsedTeachers.push(item);
            });
            if (parsedTeachers.length > 0) {
              onDataLoaded({ teachers: parsedTeachers });
              setStatus(prev => ({ ...prev, teachers: true }));
            } else {
              setError("Sila pastikan fail mengandungi lajur 'Nama Guru', 'Sesi' dll.");
            }
          }
        } else {
          setError(`Gagal membaca data dari fail ${file.name}.`);
        }
      },
      error: (err) => {
        setError(`Ralat membaca fail: ${err.message}`);
      }
    });
  };

  const handleDrop = (e: React.DragEvent, type: 'students' | 'teachers') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'students' | 'teachers') => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 p-6 space-y-6 shadow-sm">
      <div>
        <h2 className="text-lg font-black uppercase text-blue-900 tracking-tight font-display">Muat Naik Fail Data (CSV)</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-tight font-semibold">
          Gantikan data simulasi SMK Muara Tuang dengan memuat naik fail rasmi anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student File Upload */}
        <div 
          className={`border-2 border-dashed p-6 text-center transition-all rounded-none cursor-pointer ${
            status.students 
              ? 'border-blue-900 bg-blue-50/50' 
              : dragActive 
                ? 'border-yellow-400 bg-yellow-400/5' 
                : 'border-slate-300 hover:border-blue-900'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={(e) => handleDrop(e, 'students')}
          onClick={() => studentInputRef.current?.click()}
        >
          <input
            id="student-upload-input"
            type="file"
            accept=".csv"
            className="hidden"
            ref={studentInputRef}
            onChange={(e) => handleChange(e, 'students')}
          />
          {status.students ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-blue-900 text-yellow-400 flex items-center justify-center border border-blue-950">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">DATA_KK_MURID.csv Berjaya</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{studentCount} murid sedia digunakan</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  studentInputRef.current?.click();
                }}
                className="text-[10px] text-blue-900 font-black uppercase tracking-widest hover:underline mt-2 cursor-pointer"
              >
                Tukar Fail
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Sila muat naik DATA_KK_MURID.csv</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Heret & Lepas fail di sini atau klik</span>
            </div>
          )}
        </div>

        {/* Teacher File Upload */}
        <div 
          className={`border-2 border-dashed p-6 text-center transition-all rounded-none cursor-pointer ${
            status.teachers 
              ? 'border-blue-900 bg-blue-50/50' 
              : dragActive 
                ? 'border-yellow-400 bg-yellow-400/5' 
                : 'border-slate-300 hover:border-blue-900'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={(e) => handleDrop(e, 'teachers')}
          onClick={() => teacherInputRef.current?.click()}
        >
          <input
            id="teacher-upload-input"
            type="file"
            accept=".csv"
            className="hidden"
            ref={teacherInputRef}
            onChange={(e) => handleChange(e, 'teachers')}
          />
          {status.teachers ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-blue-900 text-yellow-400 flex items-center justify-center border border-blue-950">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">DATA KK GURU.csv Berjaya</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{teacherCount} guru sedia digunakan</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  teacherInputRef.current?.click();
                }}
                className="text-[10px] text-blue-900 font-black uppercase tracking-widest hover:underline mt-2 cursor-pointer"
              >
                Tukar Fail
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Sila muat naik DATA KK GURU.csv</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Heret & Lepas fail di sini atau klik</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-yellow-400 border-2 border-slate-900 text-blue-950 text-xs p-3.5 font-bold uppercase tracking-wide">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2">
        <span>Status: {studentCount === 2728 && teacherCount === 133 ? 'Menggunakan data lalai SMK Muara Tuang 2026' : 'Menggunakan data muat naik custom'}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onReset();
            setStatus({ students: false, teachers: false });
            setError(null);
          }}
          className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-black uppercase tracking-widest transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Sifar & Guna Data Lalai
        </button>
      </div>
    </div>
  );
}
