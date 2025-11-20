import React, { useState, useEffect } from 'react';
import { Student, AttendanceStatus, AttendanceRecord } from '../types';
import { Check, X, Clock, AlertCircle, Save, ArrowLeft, Loader2 } from 'lucide-react';

interface AttendanceSheetProps {
  classId: string;
  className: string;
  students: Student[];
  date: string;
  existingRecords: AttendanceRecord[];
  onSave: (records: AttendanceRecord[]) => void;
  onBack: () => void;
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  classId,
  className,
  students,
  date,
  existingRecords,
  onSave,
  onBack,
}) => {
  const [records, setRecords] = useState<Map<string, AttendanceStatus>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const newRecords = new Map<string, AttendanceStatus>();
    students.forEach(s => {
      const existing = existingRecords.find(r => r.studentId === s.id && r.date === date);
      newRecords.set(s.id, existing ? existing.status : AttendanceStatus.PRESENT);
    });
    setRecords(newRecords);
  }, [students, existingRecords, date]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const newRecords = new Map(records);
    newRecords.set(studentId, status);
    setRecords(newRecords);
  };

  const calculateStats = () => {
    let present = 0, absent = 0, late = 0, excused = 0;
    records.forEach(status => {
      if (status === AttendanceStatus.PRESENT) present++;
      if (status === AttendanceStatus.ABSENT) absent++;
      if (status === AttendanceStatus.LATE) late++;
      if (status === AttendanceStatus.EXCUSED) excused++;
    });
    return { total: students.length, present, absent, late, excused, rate: (present / students.length) * 100 };
  };

  const handleSave = () => {
    setIsSubmitting(true);
    const recordsToSave: AttendanceRecord[] = [];
    records.forEach((status, studentId) => {
      recordsToSave.push({
        id: `${classId}-${studentId}-${date}`,
        classId,
        studentId,
        date,
        status
      });
    });
    
    setTimeout(() => {
      onSave(recordsToSave);
      setIsSubmitting(false);
    }, 800);
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-offwhite/80 backdrop-blur-md z-40 py-4 -mx-6 px-6 border-b border-transparent transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2 rounded-full bg-white border border-border hover:bg-gray-50 text-gray-500 hover:text-black transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-black tracking-tight">{className}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-semibold text-gray-600">{date}</span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs">{students.length} Siswa</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-black text-white hover:bg-gray-800 rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-black/20"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span className="font-medium text-sm">{isSubmitting ? 'Saving...' : 'Simpan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview - Mini Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Hadir', value: stats.present, color: 'text-black' },
          { label: 'Terlambat', value: stats.late, color: 'text-gray-600' },
          { label: 'Izin', value: stats.excused, color: 'text-gray-500' },
          { label: 'Absen', value: stats.absent, color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</span>
            <span className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Modern List View */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50/50 border-b border-border text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">
          <div className="col-span-5 md:col-span-4">Siswa</div>
          <div className="col-span-7 md:col-span-8 text-right md:text-left">Status Presensi</div>
        </div>

        <div className="divide-y divide-gray-100">
          {students.map((student) => {
            const currentStatus = records.get(student.id);
            return (
              <div key={student.id} className="grid grid-cols-12 items-center py-4 px-6 hover:bg-gray-50/80 transition-colors group">
                <div className="col-span-12 md:col-span-4 flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200 group-hover:border-gray-300 transition-colors">
                    {student.rollNumber}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-400 hidden md:block">ID: {student.id}</p>
                  </div>
                </div>
                
                <div className="col-span-12 md:col-span-8 flex flex-wrap justify-end md:justify-start gap-2">
                  {[
                    { type: AttendanceStatus.PRESENT, icon: Check, label: 'Hadir', activeClass: 'bg-black text-white shadow-md shadow-black/10 ring-1 ring-black' },
                    { type: AttendanceStatus.LATE, icon: Clock, label: 'Telat', activeClass: 'bg-white text-gray-800 ring-1 ring-gray-300 shadow-sm' },
                    { type: AttendanceStatus.EXCUSED, icon: AlertCircle, label: 'Izin', activeClass: 'bg-white text-gray-600 ring-1 ring-gray-300 shadow-sm' },
                    { type: AttendanceStatus.ABSENT, icon: X, label: 'Absen', activeClass: 'bg-white text-red-500 ring-1 ring-red-200 shadow-sm' },
                  ].map((opt) => {
                    const isSelected = currentStatus === opt.type;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.type}
                        onClick={() => handleStatusChange(student.id, opt.type)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
                          ${isSelected 
                            ? opt.activeClass 
                            : 'bg-transparent text-gray-400 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Icon size={14} strokeWidth={2.5} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};