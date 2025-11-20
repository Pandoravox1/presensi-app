import { ClassGroup, Student, AttendanceStatus, AttendanceRecord } from './types';

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Aditya Pratama', homeroomClass: 'XII IPA 1', email: 'aditya@example.com', gender: 'Laki-laki' },
  { id: 's2', name: 'Budi Santoso', homeroomClass: 'XII IPA 1', email: 'budi@example.com', gender: 'Laki-laki' },
  { id: 's3', name: 'Citra Dewi', homeroomClass: 'XI IPS 2', email: 'citra@example.com', gender: 'Perempuan' },
  { id: 's4', name: 'Dian Sastro', homeroomClass: 'XI IPS 2', email: 'dian@example.com', gender: 'Perempuan' },
  { id: 's5', name: 'Eko Purnomo', homeroomClass: 'X Bahasa', email: 'eko@example.com', gender: 'Laki-laki' },
  { id: 's6', name: 'Fanny Maharani', homeroomClass: 'X Bahasa', email: 'fanny@example.com', gender: 'Perempuan' },
  { id: 's7', name: 'Gilang Ramadhan', homeroomClass: 'XII IPA 1', email: 'gilang@example.com', gender: 'Laki-laki' },
  { id: 's8', name: 'Hana Kartika', homeroomClass: 'XI IPS 2', email: 'hana@example.com', gender: 'Perempuan' },
  { id: 's9', name: 'Indra Lesmana', homeroomClass: 'X Bahasa', email: 'indra@example.com', gender: 'Laki-laki' },
  { id: 's10', name: 'Joko Anwar', homeroomClass: 'X Bahasa', email: 'joko@example.com', gender: 'Laki-laki' },
  { id: 's11', name: 'Kartini Supratman', homeroomClass: 'XI IPS 2', email: 'kartini@example.com', gender: 'Perempuan' },
  { id: 's12', name: 'Lukman Sardi', homeroomClass: 'XII IPA 1', email: 'lukman@example.com', gender: 'Laki-laki' },
];

export const MOCK_CLASSES: ClassGroup[] = [
  { 
    id: 'c1', 
    name: 'Kelas XII IPA 1', 
    subject: 'Matematika Lanjut', 
    schedule: 'Senin & Rabu, 08:00', 
    studentIds: ['s1', 's2', 's3', 's4', 's5', 's6'] 
  },
  { 
    id: 'c2', 
    name: 'Kelas XI IPS 2', 
    subject: 'Sosiologi', 
    schedule: 'Selasa & Kamis, 10:00', 
    studentIds: ['s7', 's8', 's9', 's10', 's11', 's12'] 
  },
  { 
    id: 'c3', 
    name: 'Kelas X Bahasa', 
    subject: 'Sastra Indonesia', 
    schedule: 'Jumat, 07:30', 
    studentIds: ['s1', 's3', 's5', 's7', 's9'] 
  },
];

// Generate some past attendance data
export const generateMockHistory = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  MOCK_CLASSES.forEach(cls => {
    // Last 3 sessions
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 2); // Every 2 days
      const dateStr = date.toISOString().split('T')[0];
      
      cls.studentIds.forEach(sid => {
        const rand = Math.random();
        let status = AttendanceStatus.PRESENT;
        if (rand > 0.9) status = AttendanceStatus.ABSENT;
        else if (rand > 0.8) status = AttendanceStatus.LATE;
        else if (rand > 0.75) status = AttendanceStatus.EXCUSED;

        records.push({
          id: `${cls.id}-${sid}-${dateStr}`,
          classId: cls.id,
          studentId: sid,
          date: dateStr,
          status: status
        });
      });
    }
  });
  return records;
};
