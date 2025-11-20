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

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({ name: '', subject: '', schedule: '', studentIds: [] });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      onUpdate({ ...editingClass, ...formData });
    } else {
      onAdd({ ...formData });
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
            <input 
              type="text" 
              required
              value={formData.schedule}
              onChange={e => setFormData({...formData, schedule: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
              placeholder="Misal: Senin, 08:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 space-y-1">
              {students.map(student => (
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
                  <span className="text-xs opacity-70">{student.rollNumber}</span>
                </div>
              ))}
              {students.length === 0 && <p className="text-xs text-gray-400 p-2">Belum ada data siswa.</p>}
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
