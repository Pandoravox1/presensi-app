import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { AttendanceSheet } from './components/AttendanceSheet';
import { MOCK_CLASSES, MOCK_STUDENTS, generateMockHistory } from './constants';
import { AttendanceRecord, ViewState } from './types';
import { Users, CheckCircle2, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(generateMockHistory());
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  // Derived state
  const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId);
  
  const totalStudents = MOCK_CLASSES.reduce((acc, c) => acc + c.studentIds.length, 0);
  
  const todayRecords = attendanceHistory.filter(r => r.date === currentDate);
  const todayPresence = todayRecords.filter(r => r.status === 'Hadir').length;
  const todayRate = totalStudents > 0 ? Math.round((todayPresence / totalStudents) * 100) : 0;

  // Prepare Chart Data
  const chartData = MOCK_CLASSES.map(cls => {
    const classRecords = attendanceHistory.filter(r => r.classId === cls.id);
    const presentCount = classRecords.filter(r => r.status === 'Hadir').length;
    const totalPossible = classRecords.length; 
    const rate = totalPossible > 0 ? Math.round((presentCount / totalPossible) * 100) : 0;
    return {
      name: cls.name.replace('Kelas ', ''),
      rate: rate,
      full: cls.name
    };
  });

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setActiveView('CLASS_DETAIL');
  };

  const handleSaveAttendance = (newRecords: AttendanceRecord[]) => {
    const filteredHistory = attendanceHistory.filter(r => 
      !(r.classId === newRecords[0].classId && r.date === newRecords[0].date)
    );
    setAttendanceHistory([...filteredHistory, ...newRecords]);
    // Could add toast notification here
    setActiveView('DASHBOARD');
    setSelectedClassId(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white text-xs p-2 rounded-lg shadow-xl">
          <p className="font-bold mb-1">{payload[0].payload.full}</p>
          <p>Kehadiran: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-offwhite flex font-sans">
      <Sidebar activeView={activeView === 'CLASS_DETAIL' ? 'DASHBOARD' : activeView} setActiveView={(v) => { setActiveView(v); setSelectedClassId(null); }} />
      
      <main className="ml-20 lg:ml-64 flex-1 p-6 lg:p-10 max-w-screen-2xl mx-auto transition-all duration-300">
        
        {/* DASHBOARD VIEW */}
        {activeView === 'DASHBOARD' && (
          <div className="space-y-8 animate-slide-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-black tracking-tight mb-2">
                  Dashboard Guru
                </h2>
                <p className="text-gray-500 font-medium">
                  Ringkasan aktivitas pembelajaran hari ini.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-black">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </header>

            {/* Stats Grid - Modern Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Total Siswa" 
                value={totalStudents} 
                icon={Users} 
              />
              <StatCard 
                title="Tingkat Kehadiran" 
                value={`${todayRate}%`} 
                description="Hari ini"
                icon={CheckCircle2}
                highlight={true}
              />
              <StatCard 
                title="Butuh Perhatian" 
                value="3" 
                description="Siswa Alpha > 3"
                icon={AlertTriangle} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Class List - Card Style */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold tracking-tight">Jadwal Kelas</h3>
                </div>
                
                <div className="grid gap-4">
                  {MOCK_CLASSES.map((cls, idx) => (
                    <div 
                      key={cls.id} 
                      onClick={() => handleClassSelect(cls.id)}
                      className="group bg-white border border-border p-6 rounded-2xl flex justify-between items-center hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">{cls.subject}</span>
                        <h4 className="font-display text-xl font-bold text-black group-hover:translate-x-1 transition-transform">{cls.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {cls.schedule}
                        </p>
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </div>

                      {/* Hover Effect Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Card */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold tracking-tight">Statistik Mingguan</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border h-[300px] shadow-sm flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF' }}
                        dy={10}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#F3F4F6', radius: 8}} />
                      <Bar dataKey="rate" radius={[6, 6, 6, 6]} barSize={40}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#111111' : '#525252'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-4">
                     <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Persentase per Kelas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLASS ATTENDANCE VIEW */}
        {activeView === 'CLASS_DETAIL' && selectedClass && (
          <AttendanceSheet 
            classId={selectedClass.id}
            className={selectedClass.name}
            date={currentDate}
            students={MOCK_STUDENTS.filter(s => selectedClass.studentIds.includes(s.id))}
            existingRecords={attendanceHistory}
            onSave={handleSaveAttendance}
            onBack={() => {
              setActiveView('DASHBOARD');
              setSelectedClassId(null);
            }}
          />
        )}

        {/* PLACEHOLDER FOR OTHER VIEWS */}
        {(activeView === 'HISTORY' || activeView === 'STUDENTS' || activeView === 'ANALYTICS') && (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center animate-fade-in">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-gray-400" size={24} />
             </div>
             <h3 className="text-lg font-bold text-black mb-2">Dalam Pengembangan</h3>
             <p className="text-gray-500 max-w-md">Fitur ini sedang disiapkan oleh tim teknis kami untuk update berikutnya.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;