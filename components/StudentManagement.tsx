import React, { useState } from 'react';
import { Student } from '../types';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { Modal } from './Modal';

interface StudentManagementProps {
  students: Student[];
  onAdd: (student: Student) => void;
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const [formData, setFormData] = useState({ name: '', rollNumber: '' });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({ name: '', rollNumber: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, rollNumber: student.rollNumber });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdate({ ...editingStudent, ...formData });
    } else {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-black">Data Siswa</h2>
          <p className="text-gray-500">Kelola data master siswa sekolah.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/20"
        >
          <Plus size={18} />
          <span>Tambah Siswa</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari siswa berdasarkan nama atau nomor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
        />
      </div>

      {/* Student List */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50/50 border-b border-border text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">
          <div className="col-span-2 md:col-span-2">ID / NIS</div>
          <div className="col-span-7 md:col-span-8">Nama Lengkap</div>
          <div className="col-span-3 md:col-span-2 text-right">Aksi</div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.id} className="grid grid-cols-12 items-center py-4 px-6 hover:bg-gray-50 transition-colors group">
                <div className="col-span-2 md:col-span-2 font-mono text-xs text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded">
                  {student.rollNumber}
                </div>
                <div className="col-span-7 md:col-span-8 font-medium text-black flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={14} />
                  </div>
                  {student.name}
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEdit(student)}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Yakin ingin menghapus siswa ini?')) onDelete(student.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">Tidak ada data siswa ditemukan.</div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStudent ? "Edit Siswa" : "Tambah Siswa Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Induk / Absen</label>
            <input 
              type="text" 
              required
              value={formData.rollNumber}
              onChange={e => setFormData({...formData, rollNumber: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Contoh: A001"
            />
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