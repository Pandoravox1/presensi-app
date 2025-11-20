import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  error?: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const adminUser = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      setLocalError('Kredensial admin belum diset di env.');
      return;
    }

    if (username === adminUser && password === adminPass) {
      sessionStorage.setItem('admin_authed', 'true');
      onSuccess();
    } else {
      setLocalError('Username atau password salah.');
    }
  };

  const message = localError || error;

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-lg p-8 space-y-6 animate-fade-in">
        <div className="space-y-2 text-center">
          <div className="text-3xl font-display font-bold text-black">Login Admin</div>
          <p className="text-sm text-gray-500">Masuk untuk mengakses dashboard presensi.</p>
        </div>

        {message && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border focus:border-black focus:ring-1 focus:ring-black outline-none"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border focus:border-black focus:ring-1 focus:ring-black outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/15"
          >
            Masuk
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Set env <code>VITE_ADMIN_USERNAME</code> dan <code>VITE_ADMIN_PASSWORD</code> untuk mengatur kredensial.
        </p>
      </div>
    </div>
  );
};
