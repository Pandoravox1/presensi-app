import { AttendanceSummary } from "../types";

// Fitur AI Insight telah dinonaktifkan sesuai permintaan.
// File ini dipertahankan agar tidak memutus import yang mungkin tersisa (meskipun saat ini tidak digunakan).

export const generateAttendanceInsight = async (
  className: string, 
  summary: AttendanceSummary, 
  date: string
): Promise<string> => {
  return "Fitur analisis AI tidak aktif.";
};