import React from 'react';
import { LayoutGrid, History, Users, Settings, LogOut, PieChart, School } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Overview', icon: LayoutGrid },
    { id: 'CLASSES', label: 'Kelas', icon: School },
    { id: 'STUDENTS', label: 'Siswa', icon: Users },
    { id: 'HISTORY', label: 'Riwayat', icon: History },
    { id: 'ANALYTICS', label: 'Analitik', icon: PieChart },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-white h-screen fixed left-0 top-0 flex flex-col border-r border-border z-50 transition-all duration-300">
      <div className="p-6 lg:p-8 flex items-center justify-center lg:justify-start">
        <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center mr-0 lg:mr-3 shadow-lg shadow-black/20">
           <span className="text-white font-bold text-lg">P</span>
        </div>
        <h1 className="font-display text-xl font-bold tracking-tight hidden lg:block">Presensi.</h1>
      </div>

      <nav className="flex-1 py-6 px-3 lg:px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 hidden lg:block">Menu Utama</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewState)}
              className={`w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-3 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-black'} />
              <span className="hidden lg:block">{item.label}</span>
              {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white hidden lg:block"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-border">
        <button className="w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-3 lg:px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-black transition-all">
          <Settings size={20} />
          <span className="hidden lg:block">Pengaturan</span>
        </button>
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-3 lg:px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="hidden lg:block">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
