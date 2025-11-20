import { ClassGroup, Student, AttendanceStatus, AttendanceRecord } from './types';

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Aditya Pratama', rollNumber: 'A001' },
  { id: 's2', name: 'Budi Santoso', rollNumber: 'A002' },
  { id: 's3', name: 'Citra Dewi', rollNumber: 'A003' },
  { id: 's4', name: 'Dian Sastro', rollNumber: 'A004' },
  { id: 's5', name: 'Eko Purnomo', rollNumber: 'A005' },
  { id: 's6', name: 'Fanny Maharani', rollNumber: 'A006' },
  { id: 's7', name: 'Gilang Ramadhan', rollNumber: 'A007' },
  { id: 's8', name: 'Hana Kartika', rollNumber: 'A008' },
  { id: 's9', name: 'Indra Lesmana', rollNumber: 'A009' },
  { id: 's10', name: 'Joko Anwar', rollNumber: 'A010' },
  { id: 's11', name: 'Kartini Supratman', rollNumber: 'A011' },
  { id: 's12', name: 'Lukman Sardi', rollNumber: 'A012' },
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