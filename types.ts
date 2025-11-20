export enum AttendanceStatus {
  PRESENT = 'Hadir',
  ABSENT = 'Absen',
  LATE = 'Terlambat',
  EXCUSED = 'Izin'
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  homeroomClass?: string; // kelas asal/wali kelas
  gender?: 'Laki-laki' | 'Perempuan';
  rollNumber?: string; // legacy fallback
  avatarUrl?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  studentIds: string[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // ISO string YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

export type ViewState = 'DASHBOARD' | 'CLASS_DETAIL' | 'HISTORY' | 'STUDENTS' | 'ANALYTICS' | 'CLASSES';
