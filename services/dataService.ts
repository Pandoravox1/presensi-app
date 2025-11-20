import { supabase } from './supabaseClient';
import { AttendanceRecord, AttendanceStatus, ClassGroup, Student } from '../types';

const ensureClient = () => {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah di-set.');
  }
  return supabase;
};

const mapStudent = (row: any): Student => ({
  id: row.id,
  name: row.name,
  email: row.email || undefined,
  homeroomClass: row.homeroom_class || undefined,
  gender: row.gender || undefined,
  rollNumber: row.roll_number || undefined,
  avatarUrl: row.avatar_url || undefined,
});

export const fetchStudents = async (): Promise<Student[]> => {
  const client = ensureClient();
  const { data, error } = await client
    .from('students')
    .select('id,name,email,homeroom_class,gender,roll_number,avatar_url')
    .order('name', { ascending: true });
  if (error) throw error;
  return data?.map(mapStudent) ?? [];
};

export const createStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  const client = ensureClient();
  const { data, error } = await client
    .from('students')
    .insert([{
      name: student.name,
      email: student.email ?? null,
      homeroom_class: student.homeroomClass ?? null,
      gender: student.gender ?? null,
      roll_number: student.rollNumber ?? null,
      avatar_url: student.avatarUrl ?? null
    }])
    .select('id,name,email,homeroom_class,gender,roll_number,avatar_url')
    .single();
  if (error) throw error;
  return mapStudent(data);
};

export const updateStudent = async (student: Student): Promise<Student> => {
  const client = ensureClient();
  const { data, error } = await client
    .from('students')
    .update({
      name: student.name,
      email: student.email ?? null,
      homeroom_class: student.homeroomClass ?? null,
      gender: student.gender ?? null,
      roll_number: student.rollNumber ?? null,
      avatar_url: student.avatarUrl ?? null
    })
    .eq('id', student.id)
    .select('id,name,email,homeroom_class,gender,roll_number,avatar_url')
    .single();
  if (error) throw error;
  return mapStudent(data);
};

export const deleteStudent = async (id: string): Promise<void> => {
  const client = ensureClient();
  // Clean up related data if FKs are not cascading
  await client.from('class_students').delete().eq('student_id', id);
  await client.from('attendance').delete().eq('student_id', id);
  const { error } = await client.from('students').delete().eq('id', id);
  if (error) throw error;
};

const mapClass = (row: any, studentIds: string[]): ClassGroup => ({
  id: row.id,
  name: row.name,
  subject: row.subject,
  schedule: row.schedule,
  studentIds,
});

export const fetchClasses = async (): Promise<ClassGroup[]> => {
  const client = ensureClient();
  const [{ data: classes, error: classError }, { data: links, error: linkError }] = await Promise.all([
    client.from('classes').select('id,name,subject,schedule').order('name', { ascending: true }),
    client.from('class_students').select('class_id,student_id'),
  ]);
  if (classError) throw classError;
  if (linkError) throw linkError;

  return (
    classes?.map((cls) => {
      const classLinks = links?.filter((l) => l.class_id === cls.id) ?? [];
      const studentIds = classLinks.map((l) => l.student_id);
      return mapClass(cls, studentIds);
    }) ?? []
  );
};

const replaceClassStudents = async (classId: string, studentIds: string[]) => {
  const client = ensureClient();
  await client.from('class_students').delete().eq('class_id', classId);
  if (studentIds.length > 0) {
    const payload = studentIds.map((sid) => ({ class_id: classId, student_id: sid }));
    const { error } = await client.from('class_students').insert(payload);
    if (error) throw error;
  }
};

export const createClass = async (cls: Omit<ClassGroup, 'id'>): Promise<ClassGroup> => {
  const client = ensureClient();
  const { data, error } = await client
    .from('classes')
    .insert([{ name: cls.name, subject: cls.subject, schedule: cls.schedule }])
    .select('id,name,subject,schedule')
    .single();
  if (error) throw error;

  await replaceClassStudents(data.id, cls.studentIds);
  return mapClass(data, cls.studentIds);
};

export const updateClass = async (cls: ClassGroup): Promise<ClassGroup> => {
  const client = ensureClient();
  const { data, error } = await client
    .from('classes')
    .update({ name: cls.name, subject: cls.subject, schedule: cls.schedule })
    .eq('id', cls.id)
    .select('id,name,subject,schedule')
    .single();
  if (error) throw error;

  await replaceClassStudents(cls.id, cls.studentIds);
  return mapClass(data, cls.studentIds);
};

export const deleteClass = async (id: string): Promise<void> => {
  const client = ensureClient();
  await client.from('class_students').delete().eq('class_id', id);
  await client.from('attendance').delete().eq('class_id', id);
  const { error } = await client.from('classes').delete().eq('id', id);
  if (error) throw error;
};

const mapAttendance = (row: any): AttendanceRecord => ({
  id: row.id,
  classId: row.class_id,
  studentId: row.student_id,
  date: row.date,
  status: row.status as AttendanceStatus,
  notes: row.notes || undefined,
});

export const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  const client = ensureClient();
  const { data, error } = await client
    .from('attendance')
    .select('id,class_id,student_id,date,status,notes')
    .order('date', { ascending: false });
  if (error) throw error;
  return data?.map(mapAttendance) ?? [];
};

export const saveAttendanceRecords = async (records: AttendanceRecord[]): Promise<void> => {
  const client = ensureClient();
  if (records.length === 0) return;
  const payload = records.map((r) => ({
    class_id: r.classId,
    student_id: r.studentId,
    date: r.date,
    status: r.status,
    notes: r.notes ?? null,
  }));
  const { error } = await client
    .from('attendance')
    .upsert(payload, { onConflict: 'class_id,student_id,date' });
  if (error) throw error;
};
