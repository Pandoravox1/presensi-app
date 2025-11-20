import React, { useState } from 'react';
import { ClassGroup, Student } from '../types';
import { Plus, Edit2, Trash2, Users, Clock, BookOpen } from 'lucide-react';
import { Modal } from './Modal';

interface ClassManagementProps {
  classes: ClassGroup[];
  students: Student[];
  onAdd: (cls: Omit<ClassGroup, 'id'>) => void;
  onUpdate: (cls: ClassGroup) => void;
  onDelete: (id: string) => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({ classes, students, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    schedule: '',
    studentIds: [] as string[]
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [scheduleSlots, setScheduleSlots] = useState<{ day: string; start: string; end: string }[]>([
    { day: '', start: '', end: '' }
  ]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({ name: '', subject: '', schedule: '', studentIds: [] });
    setScheduleSlots([{ day: '', start: '', end: '' }]);
    setStudentSearch('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassGroup) => {
    setEditingClass(cls);
    setFormData({ 
      name: cls.name, 
      subject: cls.subject, 
      schedule: cls.schedule,
      studentIds: cls.studentIds 
    });
    const slots = cls.schedule
      .split(';')
      .map(s => s.trim())
      .filter(Boolean)
      .map(item => {
        const match = item.match(/^([^,]+),\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        return match ? { day: match[1], start: match[2], end: match[3] } : { day: '', start: '', end: '' };
      })
      .filter(slot => slot.day || slot.start || slot.end);
    setScheduleSlots(slots.length ? slots : [{ day: '', start: '', end: '' }]);
    setStudentSearch('');
    setIsModalOpen(true);
  };

  const toggleStudent = (studentId: string) => {
    setFormData(prev => {
      const ids = prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId];
      return { ...prev, studentIds: ids };
    });
  };

  const filteredStudents = students.filter((s) => {
    const term = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.homeroomClass || '').toLowerCase().includes(term)
    );
  });

  const scheduleString = scheduleSlots
    .filter(s => s.day && s.start && s.end)
    .map(s => `${s.day}, ${s.start}-${s.end}`)
    .join('; ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      onUpdate({ ...editingClass, ...formData, schedule: scheduleString });
    } else {
      onAdd({ ...formData, schedule: scheduleString });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-black">Manajemen Kelas</h2>
          <p className="text-gray-500">Atur kelas, jadwal, dan daftar siswa.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/20"
        >
          <Plus size={18} />
          <span>Buat Kelas Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="group bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleOpenEdit(cls)}
                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm(`Hapus kelas ${cls.name}?`)) onDelete(cls.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold font-display mb-1">{cls.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{cls.subject}</p>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>{cls.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={14} />
                <span>{cls.studentIds.length} Siswa Terdaftar</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClass ? "Edit Kelas" : "Buat Kelas Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
              placeholder="Misal: XII IPA 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
            <input 
              type="text" 
              required
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
              placeholder="Misal: Matematika"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
            <div className="space-y-2">
              {scheduleSlots.map((slot, idx) => (
                <div key={`${idx}-${slot.day}-${slot.start}`} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                  <select
                    value={slot.day}
                    onChange={(e) => {
                      const next = [...scheduleSlots];
                      next[idx] = { ...next[idx], day: e.target.value };
                      setScheduleSlots(next);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                  >
                    <option value="">Pilih Hari</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => {
                      const next = [...scheduleSlots];
                      next[idx] = { ...next[idx], start: e.target.value };
                      setScheduleSlots(next);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => {
                      const next = [...scheduleSlots];
                      next[idx] = { ...next[idx], end: e.target.value };
                      setScheduleSlots(next);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    {scheduleSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setScheduleSlots(scheduleSlots.filter((_, i) => i !== idx))}
                        className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setScheduleSlots([...scheduleSlots, { day: '', start: '', end: '' }])}
                  className="text-sm font-medium text-black hover:underline"
                >
                  + Tambah Jadwal
                </button>
                <span className="text-xs text-gray-400">
                  Jadwal akan disimpan sebagai: {scheduleString || 'Belum dipilih'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
            <div className="mb-2">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Cari siswa (nama/email/kelas)..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 space-y-1">
              {filteredStudents.map(student => (
                <div 
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                    formData.studentIds.includes(student.id) 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium">{student.name}</span>
                  <span className="text-xs opacity-70">{student.homeroomClass || student.email || 'Siswa'}</span>
                </div>
              ))}
              {students.length === 0 && <p className="text-xs text-gray-400 p-2">Belum ada data siswa.</p>}
              {filteredStudents.length === 0 && students.length > 0 && (
                <p className="text-xs text-gray-400 p-2">Tidak ada siswa yang cocok.</p>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{formData.studentIds.length} siswa dipilih</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
