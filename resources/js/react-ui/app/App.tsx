import { useState, ReactNode } from "react";
import {
  LayoutDashboard, Calculator, MessageSquare, ClipboardList,
  BookOpen, User, Users, BarChart3, Database, Calendar,
  Bell, Eye, EyeOff, Search, Download, Play, FileText,
  Edit3, Trash2, Plus, Star, Activity, TrendingUp, Clock,
  LogOut, Phone, Upload, CheckCircle, Video, Filter,
  ChevronDown, ChevronRight, X, Menu, Stethoscope, Award,
  Heart, ArrowRight, Shield, Mail, Lock, MoreVertical,
  AlertCircle, Clipboard, Zap,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────
type Role = "pasien" | "ahligizi" | "admin";
type Screen =
  | "landing" | "login" | "register"
  | "p-dashboard" | "p-kalkulator" | "p-konsultasi" | "p-detail-ahli"
  | "p-riwayat" | "p-edukasi" | "p-profil"
  | "ag-dashboard" | "ag-monitoring" | "ag-detail-pasien" | "ag-rekam"
  | "ag-riwayat" | "ag-kelola" | "ag-profil"
  | "ad-dashboard" | "ad-pasien" | "ad-jadwal" | "ad-laporan"
  | "ad-master" | "ad-profil";

type NavFn = (screen: Screen) => void;

// ─── Mock Data ────────────────────────────────────────────
const weightData = [
  { month: "Jan", berat: 18.5 }, { month: "Feb", berat: 19.0 },
  { month: "Mar", berat: 19.2 }, { month: "Apr", berat: 19.8 },
  { month: "Mei", berat: 20.1 }, { month: "Jun", berat: 20.5 },
];
const heightData = [
  { month: "Jan", tinggi: 108 }, { month: "Feb", tinggi: 109 },
  { month: "Mar", tinggi: 109.5 }, { month: "Apr", tinggi: 110 },
  { month: "Mei", tinggi: 111 }, { month: "Jun", tinggi: 112 },
];
const imtData = [
  { month: "Jan", imt: 15.8 }, { month: "Feb", imt: 16.0 },
  { month: "Mar", imt: 16.1 }, { month: "Apr", imt: 16.4 },
  { month: "Mei", imt: 16.3 }, { month: "Jun", imt: 16.5 },
];
const distribusiGizi = [
  { name: "Gizi Normal", value: 68, color: "#2E7D32" },
  { name: "Gizi Kurang", value: 18, color: "#FF7043" },
  { name: "Gizi Lebih", value: 8, color: "#FFA726" },
  { name: "Gizi Buruk", value: 6, color: "#EF5350" },
];
const konsultasiBulanan = [
  { month: "Jan", konsultasi: 32 }, { month: "Feb", konsultasi: 45 },
  { month: "Mar", konsultasi: 38 }, { month: "Apr", konsultasi: 52 },
  { month: "Mei", konsultasi: 61 }, { month: "Jun", konsultasi: 48 },
  { month: "Jul", konsultasi: 55 },
];
const pertumbuhanPengguna = [
  { month: "Jan", pengguna: 89 }, { month: "Feb", pengguna: 102 },
  { month: "Mar", pengguna: 115 }, { month: "Apr", pengguna: 128 },
  { month: "Mei", pengguna: 138 }, { month: "Jun", pengguna: 145 },
];
let patients: any[] = [];
let nutritionists = [
  { id: 1, nama: "Dr. Nurul Hidayah, S.Gz.", spesialisasi: "Gizi Klinik & Tumbuh Kembang", pengalaman: "8 tahun", rating: 4.9, konsultasi: 234, foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&auto=format", available: true, hari: "Senin - Jumat", jam: "08:00 - 15:00" },
  { id: 2, nama: "Dr. Rizky Pratama, S.Gz.", spesialisasi: "Gizi Klinik & Dietetik", pengalaman: "5 tahun", rating: 4.7, konsultasi: 178, foto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format", available: true, hari: "Selasa - Sabtu", jam: "09:00 - 16:00" },
  { id: 3, nama: "Dr. Ayu Permata, M.Gz.", spesialisasi: "Gizi Berkebutuhan Khusus", pengalaman: "10 tahun", rating: 4.8, konsultasi: 312, foto: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=80&h=80&fit=crop&auto=format", available: false, hari: "Kamis - Minggu", jam: "10:00 - 14:00" },
  { id: 4, nama: "Dr. Budi Santoso, M.Gz.", spesialisasi: "Gizi Olahraga", pengalaman: "6 tahun", rating: 4.6, konsultasi: 150, foto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&h=80&fit=crop&auto=format", available: true, hari: "Senin - Rabu", jam: "08:00 - 12:00" },
  { id: 5, nama: "Dr. Rina Puspita, S.Gz.", spesialisasi: "Gizi Anak", pengalaman: "4 tahun", rating: 4.5, konsultasi: 110, foto: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=80&h=80&fit=crop&auto=format", available: false, hari: "Sabtu - Minggu", jam: "13:00 - 17:00" },
];

function checkAvailability(hariStr: string, jamStr: string): boolean {
  if (!hariStr || !jamStr) return false;
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const daysMap: Record<string, number> = {
    "minggu": 0, "senin": 1, "selasa": 2, "rabu": 3, "kamis": 4, "jumat": 5, "sabtu": 6,
    "min": 0, "sen": 1, "sel": 2, "rab": 3, "kam": 4, "jum": 5, "sab": 6
  };

  const isDayMatch = () => {
    const hari = hariStr.toLowerCase();
    if (hari.includes("-")) {
       const parts = hari.split("-").map(s => s.trim());
       if (parts.length === 2) {
         let start = daysMap[parts[0]];
         let end = daysMap[parts[1]];
         if (start !== undefined && end !== undefined) {
           if (start <= end) return currentDayIndex >= start && currentDayIndex <= end;
           return currentDayIndex >= start || currentDayIndex <= end;
         }
       }
    }
    const currentDayName = Object.keys(daysMap).find(k => daysMap[k] === currentDayIndex);
    if (currentDayName && hari.includes(currentDayName)) return true;
    
    return false;
  };

  if (!isDayMatch()) return false;

  const isTimeMatch = () => {
    const parts = jamStr.split("-").map(s => s.trim());
    if (parts.length === 2) {
      const [startH, startM] = parts[0].split(":").map(Number);
      const [endH, endM] = parts[1].split(":").map(Number);
      if (!isNaN(startH) && !isNaN(endH)) {
        const curr = currentHour * 60 + currentMinute;
        const start = startH * 60 + (startM || 0);
        const end = endH * 60 + (endM || 0);
        return curr >= start && curr <= end;
      }
    }
    return false;
  };

  return isTimeMatch();
}
const riwayatKonsultasi = [
  { id: 1, tanggal: "15 Jun 2026", ahliGizi: "Dr. Nurul Hidayah", status: "Selesai", ringkasan: "Monitoring berat badan normal, anjuran konsumsi sayuran hijau." },
  { id: 2, tanggal: "01 Jun 2026", ahliGizi: "Dr. Ayu Permata", status: "Selesai", ringkasan: "Evaluasi status gizi, rekomendasi diet tinggi protein." },
  { id: 3, tanggal: "15 Mei 2026", ahliGizi: "Dr. Nurul Hidayah", status: "Selesai", ringkasan: "Pemberian suplemen vitamin D dan kalsium." },
];
const edukasiKonten = [
  { id: 1, judul: "Nutrisi Penting untuk Usia 4–8 Tahun", kategori: "Nutrisi Umum", waktuBaca: "5 menit", thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=320&h=180&fit=crop&auto=format" },
  { id: 2, judul: "Pola Makan Sehat untuk Pasien Berkebutuhan Khusus", kategori: "Kebutuhan Khusus", waktuBaca: "7 menit", thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=320&h=180&fit=crop&auto=format" },
  { id: 3, judul: "Memahami Grafik Pertumbuhan", kategori: "Pertumbuhan", waktuBaca: "4 menit", thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=320&h=180&fit=crop&auto=format" },
  { id: 4, judul: "Jadwal Makan Ideal untuk Balita", kategori: "Pola Makan", waktuBaca: "6 menit", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=320&h=180&fit=crop&auto=format" },
  { id: 5, judul: "Makanan Kaya Zat Besi", kategori: "Nutrisi Umum", waktuBaca: "5 menit", thumbnail: "https://images.unsplash.com/photo-1547592180-85f173990554?w=320&h=180&fit=crop&auto=format" },
  { id: 6, judul: "Tanda-Tanda Malnutrisi", kategori: "Pertumbuhan", waktuBaca: "8 menit", thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=320&h=180&fit=crop&auto=format" },
];
const videoEdukasi = [
  { id: 1, judul: "Cara Membuat MPASI Bergizi Tinggi", durasi: "12:34", thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=320&h=180&fit=crop&auto=format" },
  { id: 2, judul: "Stimulasi Tumbuh Kembang 0-5 Tahun", durasi: "18:22", thumbnail: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=320&h=180&fit=crop&auto=format" },
  { id: 3, judul: "Gizi Seimbang: Isi Piringku", durasi: "8:45", thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=320&h=180&fit=crop&auto=format" },
];
let jadwalHariIni = [
  { waktu: "08:00", pasien: "Ahmad Rizky", jenis: "Konsultasi Rutin", status: "Selesai" },
  { waktu: "09:30", pasien: "Siti Fatimah", jenis: "Pemantauan Gizi", status: "Berlangsung" },
  { waktu: "11:00", pasien: "Budi Santoso", jenis: "Konsultasi Awal", status: "Menunggu" },
  { waktu: "14:00", pasien: "Dewi Lestari", jenis: "Follow-up", status: "Menunggu" },
];

let agRiwayat = [
  { tanggal: "22 Jun 2026", pasien: "Siti Fatimah", keluhan: "Berat badan tidak naik", diagnosa: "Gizi Kurang – protein deficiency", status: "Berlangsung" },
  { tanggal: "20 Jun 2026", pasien: "Ahmad Rizky", keluhan: "Monitoring rutin bulanan", diagnosa: "Status gizi normal", status: "Selesai" },
  { tanggal: "18 Jun 2026", pasien: "Budi Santoso", keluhan: "Nafsu makan menurun", diagnosa: "Gizi kurang – anemia ringan", status: "Selesai" },
];

// ─── Shared UI Components ─────────────────────────────────
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Normal: "bg-green-100 text-green-700",
    Kurang: "bg-orange-100 text-orange-700",
    Lebih: "bg-yellow-100 text-yellow-700",
    Buruk: "bg-red-100 text-red-700",
    Selesai: "bg-green-100 text-green-700",
    Berlangsung: "bg-blue-100 text-blue-700",
    Menunggu: "bg-gray-100 text-gray-600",
    Aktif: "bg-green-100 text-green-700",
    Nonaktif: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100 text-gray-600")}>
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "green" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    green: { bg: "bg-green-50", icon: "text-[#2E7D32]", border: "border-green-100" },
    blue: { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-100" },
    orange: { bg: "bg-orange-50", icon: "text-orange-500", border: "border-orange-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-500", border: "border-purple-100" },
  };
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#64748B] font-medium mb-1">{label}</p>
          <p className="text-2xl font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>{value}</p>
          {sub && <p className="text-xs text-[#64748B] mt-1">{sub}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border", c.bg, c.border)}>
          <Icon className={cn("w-5 h-5", c.icon)} />
        </div>
      </div>
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, className, type = "button", disabled }: {
  children: ReactNode; variant?: "primary" | "outline" | "ghost" | "danger";
  onClick?: () => void; className?: string; type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:opacity-50";
  const variants = {
    primary: "bg-[#2E7D32] text-white hover:bg-[#256028] shadow-sm",
    outline: "border border-[#2E7D32] text-[#2E7D32] hover:bg-green-50",
    ghost: "text-[#64748B] hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn(base, variants[variant], className)}>
      {children}
    </button>
  );
}

function InputField({ label, type = "text", placeholder, value, onChange, icon: Icon, rightEl }: {
  label: string; type?: string; placeholder?: string;
  value?: string; onChange?: (v: string) => void;
  icon?: React.ElementType; rightEl?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1A2332]">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#1A2332] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition",
            Icon && "pl-9",
            rightEl && "pr-10"
          )}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
}

function SelectField({ label, options, value, onChange }: {
  label: string; options: string[]; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1A2332]">{label}</label>
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#1A2332] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
      >
        <option value="">Pilih...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>{title}</h2>
      {sub && <p className="text-sm text-[#64748B] mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────
function DashboardLayout({ role, activeScreen, onNavigate, children, userName }: {
  role: Role; activeScreen: Screen; onNavigate: NavFn; children: ReactNode; userName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menus: { label: string; icon: React.ElementType; screen: Screen }[] =
    role === "pasien" ? [
      { label: "Dashboard", icon: LayoutDashboard, screen: "p-dashboard" },
      { label: "Kalkulator Gizi", icon: Calculator, screen: "p-kalkulator" },
      { label: "Konsultasi Online", icon: MessageSquare, screen: "p-konsultasi" },
      { label: "Riwayat Konsultasi", icon: ClipboardList, screen: "p-riwayat" },
      { label: "Edukasi", icon: BookOpen, screen: "p-edukasi" },
      { label: "Profil", icon: User, screen: "p-profil" },
    ] : role === "ahligizi" ? [
      { label: "Dashboard", icon: LayoutDashboard, screen: "ag-dashboard" },
      { label: "Monitoring Pasien", icon: Activity, screen: "ag-monitoring" },
      { label: "Rekam Konsultasi", icon: Clipboard, screen: "ag-rekam" },
      { label: "Riwayat Konsultasi", icon: ClipboardList, screen: "ag-riwayat" },
      { label: "Kelola Edukasi", icon: BookOpen, screen: "ag-kelola" },
      { label: "Profil", icon: User, screen: "ag-profil" },
    ] : [
      { label: "Dashboard", icon: LayoutDashboard, screen: "ad-dashboard" },
      { label: "Kelola Data Pasien", icon: Users, screen: "ad-pasien" },
      { label: "Manajemen Jadwal", icon: Calendar, screen: "ad-jadwal" },
      { label: "Laporan Statistik", icon: BarChart3, screen: "ad-laporan" },
      { label: "Kelola Master Data", icon: Database, screen: "ad-master" },
      { label: "Profil", icon: User, screen: "ad-profil" },
    ];

  const roleLabel = role === "pasien" ? "Pasien" : role === "ahligizi" ? "Ahli Gizi" : "Administrator";

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex-shrink-0 bg-white border-r border-[rgba(0,0,0,0.07)] flex flex-col transition-all duration-300",
        sidebarOpen ? "w-60" : "w-16"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[rgba(0,0,0,0.07)]">
          <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-700 text-[#1A2332] leading-tight" style={{ fontWeight: 700 }}>SiGizi</p>
              <p className="text-[10px] text-[#64748B]">PABA System</p>
            </div>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 bg-[#E8F5E9] rounded-xl px-3 py-2">
            <p className="text-[10px] text-[#64748B]">Logged in as</p>
            <p className="text-xs font-600 text-[#2E7D32]" style={{ fontWeight: 600 }}>{roleLabel}</p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 mt-4 space-y-0.5">
          {menus.map(({ label, icon: Icon, screen }) => {
            const active = activeScreen === screen;
            return (
              <button
                key={screen}
                onClick={() => onNavigate(screen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                    : "text-[#64748B] hover:bg-gray-50 hover:text-[#1A2332]"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-[#2E7D32]" : "text-[#94A3B8]")} />
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[rgba(0,0,0,0.07)]">
          <button
            onClick={() => onNavigate("landing")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopNav */}
        <header className="h-16 bg-white border-b border-[rgba(0,0,0,0.07)] flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#64748B] hover:text-[#1A2332] transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input placeholder="Cari..." className="w-48 bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition" />
          </div>

          {/* Notif */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-gray-100 transition">
              <Bell className="w-4 h-4 text-[#64748B]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[rgba(0,0,0,0.08)] z-50 p-4">
                <p className="font-600 text-sm text-[#1A2332] mb-3" style={{ fontWeight: 600 }}>Notifikasi</p>
                {[
                  { text: "Jadwal konsultasi besok pukul 09:00", time: "5 menit lalu", dot: "bg-blue-500" },
                  { text: "Hasil pemeriksaan sudah tersedia", time: "1 jam lalu", dot: "bg-green-500" },
                  { text: "Pengingat minum suplemen vitamin D", time: "2 jam lalu", dot: "bg-orange-500" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-0">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.dot)} />
                    <div>
                      <p className="text-xs text-[#1A2332]">{n.text}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
              <div className="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white text-xs font-600" style={{ fontWeight: 600 }}>
                {userName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-[#1A2332] hidden sm:block">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-[rgba(0,0,0,0.08)] z-50 p-2">
                <button className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                  <User className="w-4 h-4 text-[#64748B]" /><span>Profil Saya</span>
                </button>
                <button
                  onClick={() => onNavigate("landing")}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition">
                  <LogOut className="w-4 h-4" /><span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────
function LandingPage({ onNavigate }: { onNavigate: NavFn }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[rgba(0,0,0,0.07)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>SiGizi</span>
              <span className="text-[#2E7D32] font-700" style={{ fontWeight: 700 }}> PABA</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#64748B]">
            <a href="#fitur" className="hover:text-[#2E7D32] transition">Fitur</a>
            <a href="#tentang" className="hover:text-[#2E7D32] transition">Tentang</a>
            <a href="#kontak" className="hover:text-[#2E7D32] transition">Kontak</a>
          </div>
          <div className="flex items-center gap-3">
            <Btn variant="outline" onClick={() => onNavigate("login")}>Masuk</Btn>
            <Btn onClick={() => onNavigate("register")}>Daftar</Btn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#F0FBF1] via-white to-[#EBF5FF]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] text-xs font-600 px-3 py-1.5 rounded-full mb-6" style={{ fontWeight: 600 }}>
                <Zap className="w-3.5 h-3.5" />
                Platform Gizi Terpercaya #1 di Pambalang Batu
              </div>
              <h1 className="text-4xl lg:text-5xl font-800 text-[#1A2332] leading-tight mb-5" style={{ fontWeight: 800 }}>
                Pantau dan Tingkatkan<br />
                <span className="text-[#2E7D32]">Status Gizi</span><br />
                dengan Mudah
              </h1>
              <p className="text-lg text-[#64748B] leading-relaxed mb-8 max-w-md">
                Platform konsultasi, monitoring, dan edukasi gizi untuk pasien berkebutuhan khusus. Bersama ahli gizi terpercaya.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Btn onClick={() => onNavigate("register")} className="px-6 py-3 text-base">
                  Mulai Sekarang <ArrowRight className="w-4 h-4" />
                </Btn>
                <Btn variant="outline" onClick={() => onNavigate("login")} className="px-6 py-3 text-base">
                  Pelajari Lebih Lanjut
                </Btn>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[["500+", "Pengguna Aktif"], ["12", "Ahli Gizi"], ["98%", "Kepuasan"]].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-xl font-700 text-[#2E7D32]" style={{ fontWeight: 700 }}>{n}</p>
                    <p className="text-xs text-[#94A3B8]">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=560&h=420&fit=crop&auto=format"
                  alt="Dokter dan pasien"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E7D32]/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-[rgba(0,0,0,0.06)]">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Status Gizi Ahmad</p>
                  <p className="text-xs text-[#2E7D32] font-medium">Normal — IMT 16.5</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-[rgba(0,0,0,0.06)]">
                <p className="text-xs text-[#64748B]">Konsultasi Berikutnya</p>
                <p className="text-sm font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Senin, 23 Jun 09:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#2E7D32] text-sm font-600 mb-2" style={{ fontWeight: 600 }}>FITUR UNGGULAN</p>
            <h2 className="text-3xl font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>Semua yang Anda Butuhkan</h2>
            <p className="text-[#64748B] mt-2">Platform lengkap untuk pemantauan gizi</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calculator, title: "Kalkulator Status Gizi", desc: "Hitung IMT dan status gizi secara akurat sesuai standar WHO", color: "green" },
              { icon: MessageSquare, title: "Konsultasi Online", desc: "Chat langsung dengan ahli gizi berpengalaman kapan saja", color: "blue" },
              { icon: TrendingUp, title: "Monitoring Pertumbuhan", desc: "Pantau grafik tumbuh kembang secara berkala", color: "orange" },
              { icon: BookOpen, title: "Edukasi Gizi", desc: "Artikel, video, dan panduan nutrisi dari pakar gizi ternama", color: "purple" },
            ].map(({ icon: Icon, title, desc, color }) => {
              const bg: Record<string, string> = {
                green: "bg-green-50 border-green-100", blue: "bg-blue-50 border-blue-100",
                orange: "bg-orange-50 border-orange-100", purple: "bg-purple-50 border-purple-100",
              };
              const ic: Record<string, string> = {
                green: "text-[#2E7D32]", blue: "text-blue-500",
                orange: "text-orange-500", purple: "text-purple-500",
              };
              return (
                <div key={title} className="group bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border mb-4", bg[color])}>
                    <Icon className={cn("w-6 h-6", ic[color])} />
                  </div>
                  <h3 className="font-600 text-[#1A2332] mb-2 text-sm" style={{ fontWeight: 600 }}>{title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2E7D32]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-700 text-white mb-3" style={{ fontWeight: 700 }}>
            Mulai Perjalanan Gizi Sehat Hari Ini
          </h2>
          <p className="text-green-200 mb-8">Bergabung dengan ribuan pengguna yang sudah memantau status gizi bersama kami</p>
          <div className="flex items-center justify-center gap-4">
            <Btn onClick={() => onNavigate("register")} className="bg-white !text-[#2E7D32] hover:!bg-green-50 px-8 py-3 text-base shadow-lg">
              Daftar Gratis
            </Btn>
            <Btn onClick={() => onNavigate("login")} className="!bg-transparent border border-white/40 !text-white hover:!bg-white/10 px-8 py-3 text-base">
              Login
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2332] text-[#94A3B8] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2E7D32] rounded-lg flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-600" style={{ fontWeight: 600 }}>SiGizi PABA</span>
          </div>
          <p className="text-xs text-center">© 2026 Sistem Informasi Gizi Pambalang Batu. Hak cipta dilindungi.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-white transition">Privasi</a>
            <a href="#" className="hover:text-white transition">Ketentuan</a>
            <a href="#" className="hover:text-white transition">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────
function LoginPage({ onNavigate, onLogin }: { onNavigate: NavFn; onLogin: (role: Role) => void }) {
  const [activeRole, setActiveRole] = useState<Role>("pasien");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    onLogin(activeRole);
    if (activeRole === "pasien") onNavigate("p-dashboard");
    else if (activeRole === "ahligizi") onNavigate("ag-dashboard");
    else onNavigate("ad-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FBF1] to-[#EBF5FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>SiGizi PABA</h1>
          <p className="text-sm text-[#64748B]">Masuk ke akun Anda</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[rgba(0,0,0,0.06)] p-8">
          {/* Role Tabs */}
          <div className="flex bg-[#F8FAFC] rounded-xl p-1 mb-6">
            {(["pasien", "ahligizi", "admin"] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                  activeRole === r ? "bg-white shadow text-[#2E7D32] font-600" : "text-[#64748B] hover:text-[#1A2332]"
                )}
              >
                {r === "pasien" ? "Pasien" : r === "ahligizi" ? "Ahli Gizi" : "Admin"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <InputField label="Email" type="email" placeholder="nama@email.com" value={email} onChange={setEmail} icon={Mail} />
            <InputField
              label="Password" type={showPass ? "text" : "password"} placeholder="Masukkan password"
              value={password} onChange={setPassword} icon={Lock}
              rightEl={
                <button onClick={() => setShowPass(!showPass)} className="text-[#94A3B8] hover:text-[#64748B] transition">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#2E7D32]" />
                <span className="text-xs text-[#64748B]">Ingat saya</span>
              </label>
              <button className="text-xs text-[#2E7D32] hover:underline">Lupa Password?</button>
            </div>

            <Btn onClick={handleLogin} className="w-full py-3 text-base justify-center mt-2">
              Masuk
            </Btn>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Belum punya akun?{" "}
            <button onClick={() => onNavigate("register")} className="text-[#2E7D32] font-600 hover:underline" style={{ fontWeight: 600 }}>
              Daftar Sekarang
            </button>
          </p>
        </div>

        <button onClick={() => onNavigate("landing")} className="flex items-center gap-1.5 mx-auto mt-4 text-xs text-[#64748B] hover:text-[#1A2332] transition">
          <ChevronRight className="w-3 h-3 rotate-180" /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────
function RegisterPage({ onNavigate }: { onNavigate: NavFn }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FBF1] to-[#EBF5FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>Buat Akun Baru</h1>
          <p className="text-sm text-[#64748B]">Daftar sebagai orang tua / pasien</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-[rgba(0,0,0,0.06)] p-8">
          <div className="space-y-4">
            <InputField label="Nama Lengkap" placeholder="Nama lengkap Anda" icon={User} />
            <InputField label="Email" type="email" placeholder="nama@email.com" icon={Mail} />
            <InputField label="Nomor WhatsApp" placeholder="08xx-xxxx-xxxx" icon={Phone} />
            <InputField label="Password" type={showPass ? "text" : "password"} placeholder="Min. 8 karakter" icon={Lock}
              rightEl={
                <button onClick={() => setShowPass(!showPass)} className="text-[#94A3B8] hover:text-[#64748B]">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <InputField label="Konfirmasi Password" type="password" placeholder="Ulangi password" icon={Shield} />
            <Btn onClick={() => onNavigate("login")} className="w-full py-3 text-base justify-center mt-2">
              Daftar
            </Btn>
          </div>
          <p className="text-center text-sm text-[#64748B] mt-6">
            Sudah punya akun?{" "}
            <button onClick={() => onNavigate("login")} className="text-[#2E7D32] font-600 hover:underline" style={{ fontWeight: 600 }}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PASIEN: DASHBOARD ────────────────────────────────────
function PasienDashboard({ onNavigate }: { onNavigate: NavFn }) {
  return (
    <div>
      <SectionTitle title="Dashboard" sub="Selamat datang, Ahmad Rizky! Pantau status gizi ananda di sini." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Activity} label="Status Gizi Terakhir" value="Normal" sub="IMT 16.5" color="green" />
        <StatCard icon={Calendar} label="Konsultasi Berikutnya" value="23 Jun 09:00" sub="Dr. Nurul Hidayah" color="blue" />
        <StatCard icon={ClipboardList} label="Total Konsultasi" value="12" sub="3 bulan terakhir" color="orange" />
        <StatCard icon={TrendingUp} label="Progress Berat" value="+2 kg" sub="Jan – Jun 2026" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Berat Badan */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Grafik Berat Badan (kg)</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[17, 22]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="berat" stroke="#2E7D32" strokeWidth={2} fill="url(#wGrad)" dot={{ fill: "#2E7D32", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tinggi Badan */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Grafik Tinggi Badan (cm)</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={heightData}>
              <defs>
                <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#42A5F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[106, 114]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="tinggi" stroke="#42A5F5" strokeWidth={2} fill="url(#hGrad)" dot={{ fill: "#42A5F5", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* IMT */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Grafik IMT</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={imtData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[15, 17.5]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="imt" stroke="#FF7043" strokeWidth={2} dot={{ fill: "#FF7043", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
        <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Aksi Cepat</p>
        <div className="flex flex-wrap gap-3">
          <Btn onClick={() => onNavigate("p-kalkulator")}><Calculator className="w-4 h-4" /> Hitung IMT</Btn>
          <Btn onClick={() => onNavigate("p-konsultasi")} variant="outline"><MessageSquare className="w-4 h-4" /> Konsultasi Sekarang</Btn>
          <Btn onClick={() => onNavigate("p-edukasi")} variant="ghost"><BookOpen className="w-4 h-4" /> Lihat Edukasi</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── PASIEN: KALKULATOR GIZI ──────────────────────────────
function PasienKalkulator() {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [jk, setJk] = useState("");
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [result, setResult] = useState<{ imt: number; kategori: string; warna: string } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const hitung = () => {
    if (!berat || !tinggi) return;
    const b = parseFloat(berat);
    const t = parseFloat(tinggi) / 100;
    const imt = b / (t * t);
    let kategori = "", warna = "";
    if (imt < 14.0) { kategori = "Gizi Buruk"; warna = "text-red-600 bg-red-50"; }
    else if (imt < 16.0) { kategori = "Gizi Kurang"; warna = "text-orange-600 bg-orange-50"; }
    else if (imt < 18.5) { kategori = "Gizi Normal"; warna = "text-green-600 bg-green-50"; }
    else if (imt < 25.0) { kategori = "Gizi Lebih"; warna = "text-yellow-600 bg-yellow-50"; }
    else { kategori = "Gizi Lebih"; warna = "text-yellow-600 bg-yellow-50"; }
    setResult({ imt: parseFloat(imt.toFixed(1)), kategori, warna });
    setShowDetails(false);
    
    // Simpan ke array global untuk dibaca oleh AhliGiziMonitoring
    patients.unshift({
      id: Date.now(),
      nama: nama || "Pasien Anonim",
      umur: umur ? `${umur} tahun` : "-",
      statusGizi: kategori.split(" ")[1] || kategori,
      konsultasiTerakhir: "Hari Ini",
      wa: "-"
    });
  };

  const cekStatus = () => {
    if (result) setShowDetails(true);
  };

  return (
    <div>
      <SectionTitle title="Kalkulator Status Gizi" sub="Hitung IMT dan status gizi berdasarkan berat dan tinggi badan." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <h3 className="font-600 text-[#1A2332] mb-5" style={{ fontWeight: 600 }}>Data Pasien</h3>
          <div className="space-y-4">
            <InputField label="Nama Pasien" placeholder="Nama lengkap pasien" value={nama} onChange={setNama} icon={User} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Umur (tahun)" type="number" placeholder="0" value={umur} onChange={setUmur} />
              <SelectField label="Jenis Kelamin" options={["Laki-laki", "Perempuan"]} value={jk} onChange={setJk} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Berat Badan (kg)" type="number" placeholder="20.5" value={berat} onChange={setBerat} />
              <InputField label="Tinggi Badan (cm)" type="number" placeholder="112" value={tinggi} onChange={setTinggi} />
            </div>
            <div className="flex gap-3 pt-2">
              <Btn onClick={hitung} className="flex-1 justify-center"><Calculator className="w-4 h-4" /> Hitung IMT</Btn>
              <Btn variant="outline" onClick={cekStatus} className="flex-1 justify-center"><CheckCircle className="w-4 h-4" /> Cek Status Gizi</Btn>
            </div>
          </div>
        </div>

        {result ? (
          <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
            <h3 className="font-600 text-[#1A2332] mb-5" style={{ fontWeight: 600 }}>Hasil Pemeriksaan</h3>
            <div className="text-center py-6 border-b border-[rgba(0,0,0,0.06)] mb-5">
              <p className="text-5xl font-800 text-[#2E7D32]" style={{ fontWeight: 800 }}>{result.imt}</p>
              <p className="text-sm text-[#64748B] mt-1">Nilai IMT</p>
              <span className={cn("inline-flex px-4 py-1.5 rounded-full text-sm font-600 mt-3", result.warna)} style={{ fontWeight: 600 }}>
                {result.kategori}
              </span>
            </div>
            {showDetails && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Interpretasi</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Status gizi pasien termasuk dalam kategori {result.kategori.toLowerCase()}. Pertumbuhan berlangsung sesuai dengan standar WHO untuk usia ini.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#F0FBF1] rounded-xl">
                  <CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Rekomendasi Nutrisi</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Pertahankan pola makan bergizi seimbang. Konsumsi protein hewani dan sayuran hijau setiap hari. Pantau berat badan setiap bulan.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-[#2E7D32]" />
            </div>
            <p className="font-600 text-[#1A2332] mb-1" style={{ fontWeight: 600 }}>Belum Ada Hasil</p>
            <p className="text-sm text-[#64748B]">Isi data pasien dan klik "Hitung IMT" untuk melihat hasil</p>
          </div>
        )}
      </div>

      {/* Referensi */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
        <h3 className="font-600 text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Tabel Referensi Status Gizi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { range: "< 14.0", label: "Gizi Buruk", color: "bg-red-50 border-red-100 text-red-700" },
            { range: "14.0 – 15.9", label: "Gizi Kurang", color: "bg-orange-50 border-orange-100 text-orange-700" },
            { range: "16.0 – 18.4", label: "Gizi Normal", color: "bg-green-50 border-green-100 text-green-700" },
            { range: "≥ 18.5", label: "Gizi Lebih", color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
          ].map(r => (
            <div key={r.label} className={cn("rounded-xl p-3 border text-center", r.color)}>
              <p className="text-xs font-600" style={{ fontWeight: 600 }}>{r.label}</p>
              <p className="text-xs mt-0.5 opacity-80">{r.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PASIEN: KONSULTASI ONLINE ────────────────────────────
function PasienKonsultasi({ onNavigate }: { onNavigate: NavFn }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <div>
      <SectionTitle title="Konsultasi Online" sub="Pilih ahli gizi terpercaya untuk berkonsultasi." />
      <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama ahli gizi..." className="w-full bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] transition" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] transition">
            <option value="">Semua Spesialisasi</option>
            <option>Gizi Klinik</option>
            <option>Gizi Klinik</option>
            <option>Gizi Berkebutuhan Khusus</option>
          </select>
          <select className="bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] transition">
            <option value="">Rating Tertinggi</option>
            <option>4.5+</option>
            <option>4.0+</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {nutritionists
          .filter(n => n.nama.toLowerCase().includes(search.toLowerCase()))
          .filter(n => filter ? n.spesialisasi === filter : true)
          .map(n => (
          <div key={n.id} className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <img src={n.foto} alt={n.nama} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="font-600 text-[#1A2332] text-sm leading-tight" style={{ fontWeight: 600 }}>{n.nama}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{n.spesialisasi}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>{n.rating}</span>
                  <span className="text-xs text-[#94A3B8]">({n.konsultasi} konsultasi)</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#64748B] p-2.5 bg-[#F8FAFC] rounded-xl">
                <Award className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Pengalaman {n.pengalaman}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B] p-2.5 bg-[#F8FAFC] rounded-xl">
                <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>{n.hari}, {n.jam}</span>
              </div>
            </div>
            {checkAvailability(n.hari, n.jam) ? (
              <a
                href={`https://wa.me/628123456789?text=Halo%20${encodeURIComponent(n.nama)}%2C%20saya%20ingin%20konsultasi%20gizi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat Sekarang
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-[rgba(0,0,0,0.06)] text-[#94A3B8] text-sm font-medium cursor-not-allowed">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#CBD5E1] flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Di Luar Jadwal
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PASIEN: DETAIL AHLI GIZI ─────────────────────────────
function PasienDetailAhli({ onNavigate }: { onNavigate: NavFn }) {
  const n = nutritionists[0];
  return (
    <div>
      <button onClick={() => onNavigate("p-konsultasi")} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#2E7D32] mb-6 transition">
        <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Daftar
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="text-center mb-5">
            <img src={n.foto} alt={n.nama} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-3 bg-gray-100" />
            <h2 className="font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>{n.nama}</h2>
            <p className="text-sm text-[#64748B]">{n.spesialisasi}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              <span className="text-sm font-600 ml-1" style={{ fontWeight: 600 }}>{n.rating}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-[rgba(0,0,0,0.06)] pt-4">
            {[["Pengalaman", n.pengalaman], ["Total Konsultasi", `${n.konsultasi}+`], ["Tersedia", "Senin – Jumat"]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#64748B]">{k}</span>
                <span className="font-medium text-[#1A2332]">{v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-5">
            <Btn className="w-full justify-center"><Calendar className="w-4 h-4" /> Buat Janji</Btn>
            <Btn variant="outline" className="w-full justify-center"><Phone className="w-4 h-4" /> Chat WhatsApp</Btn>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
            <h3 className="font-600 text-[#1A2332] mb-3" style={{ fontWeight: 600 }}>Biografi</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Dr. Nurul Hidayah adalah ahli gizi berpengalaman yang berfokus pada gizi klinik dan pasien berkebutuhan khusus. Beliau meraih gelar Sarjana Gizi dari Universitas Hasanuddin dan Master Gizi dari Universitas Indonesia. Selama 8 tahun berkarier, beliau telah menangani lebih dari 230 kasus dengan tingkat keberhasilan penanganan malnutrisi mencapai 94%.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
            <h3 className="font-600 text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Sertifikasi</h3>
            <div className="space-y-3">
              {["Registered Dietitian – PERSAGI 2018", "Sertifikasi Gizi Klinik – IDAI 2019", "Konsultan Laktasi IBCLC 2020"].map(c => (
                <div key={c} className="flex items-center gap-3 p-3 bg-[#F0FBF1] rounded-xl">
                  <Award className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
                  <span className="text-sm text-[#1A2332]">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
            <h3 className="font-600 text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Jadwal Konsultasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ["Senin", "08:00 – 12:00"],
                ["Selasa", "13:00 – 17:00"],
                ["Rabu", "08:00 – 12:00"],
                ["Kamis", "13:00 – 17:00"],
                ["Jumat", "08:00 – 11:00"],
              ].map(([h, j]) => (
                <div key={h} className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl text-sm">
                  <span className="font-medium text-[#1A2332]">{h}</span>
                  <span className="text-[#64748B]">{j}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PASIEN: RIWAYAT KONSULTASI ───────────────────────────
function PasienRiwayat() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div>
      <SectionTitle title="Riwayat Konsultasi" sub="Daftar semua konsultasi yang pernah dilakukan." />
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input placeholder="Cari konsultasi..." className="w-full bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition" />
          </div>
          <Btn variant="outline" className="text-xs"><Filter className="w-3.5 h-3.5" /> Filter</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {["Tanggal", "Nama Ahli Gizi", "Status", "Ringkasan", "Aksi"].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-[#64748B] px-5 py-3" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riwayatKonsultasi.map(r => (
                <tr key={r.id} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA] transition">
                  <td className="px-5 py-4 text-sm text-[#1A2332] whitespace-nowrap">{r.tanggal}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#1A2332]">{r.ahliGizi}</td>
                  <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-4 text-sm text-[#64748B] max-w-xs truncate">{r.ringkasan}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Btn variant="ghost" className="text-xs px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[rgba(0,0,0,0.05)]" onClick={() => setSelected(r)}><FileText className="w-3.5 h-3.5" /> Detail</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-[rgba(0,0,0,0.08)]">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#1A2332] p-1 rounded-full hover:bg-gray-100 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center gap-3 mb-5 border-b border-[rgba(0,0,0,0.06)] pb-4">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div>
                <h3 className="font-700 text-[#1A2332] text-lg leading-none" style={{ fontWeight: 700 }}>Detail Konsultasi</h3>
                <p className="text-xs text-[#64748B] mt-1">Informasi dan diagnosa</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-600 text-[#64748B] uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>Tanggal</p>
                  <p className="font-medium text-[#1A2332] text-sm">{selected.tanggal}</p>
                </div>
                <div>
                  <p className="text-[11px] font-600 text-[#64748B] uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>Status</p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              
              <div>
                <p className="text-[11px] font-600 text-[#64748B] uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>Ahli Gizi</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-500" />
                  </div>
                  <p className="font-medium text-[#1A2332] text-sm">{selected.ahliGizi}</p>
                </div>
              </div>
              
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[rgba(0,0,0,0.06)]">
                <p className="text-[11px] font-600 text-[#64748B] uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Diagnosa & Catatan</p>
                <p className="text-sm text-[#1A2332] leading-relaxed">
                  <span className="font-medium block mb-1">{selected.ringkasan}</span>
                  Kondisi gizi terpantau stabil. Pasien dianjurkan untuk mengikuti jadwal makan teratur dan memantau perkembangan berat badan setiap bulan.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Btn className="w-full justify-center py-2.5" onClick={() => setSelected(null)}>Tutup Detail</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PASIEN: EDUKASI ──────────────────────────────────────
function PasienEdukasi() {
  const [activeKat, setActiveKat] = useState("Semua");
  const [activeTab, setActiveTab] = useState<"artikel" | "panduan" | "video">("artikel");
  const kategori = ["Semua", "Nutrisi Umum", "Pola Makan", "Pertumbuhan", "Kebutuhan Khusus"];
  const filtered = activeKat === "Semua" ? edukasiKonten : edukasiKonten.filter(e => e.kategori === activeKat);

  return (
    <div>
      <SectionTitle title="Edukasi Gizi" sub="Artikel, panduan, dan video edukasi dari ahli gizi ternama." />
      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-[rgba(0,0,0,0.06)] shadow-sm mb-6 w-fit">
        {(["artikel", "panduan", "video"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn("px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize", activeTab === t ? "bg-[#2E7D32] text-white shadow" : "text-[#64748B] hover:text-[#1A2332]")}>
            {t === "artikel" ? "Artikel" : t === "panduan" ? "Panduan" : "Video Edukasi"}
          </button>
        ))}
      </div>

      {activeTab === "artikel" && (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {kategori.map(k => (
              <button key={k} onClick={() => setActiveKat(k)}
                className={cn("px-4 py-1.5 rounded-full text-xs font-medium transition-all", activeKat === k ? "bg-[#2E7D32] text-white" : "bg-white border border-[rgba(0,0,0,0.08)] text-[#64748B] hover:border-[#2E7D32] hover:text-[#2E7D32]")}>
                {k}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(e => (
              <div key={e.id} className="bg-white rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <img src={e.thumbnail} alt={e.judul} className="w-full h-36 object-cover bg-gray-100" />
                <div className="p-4">
                  <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-600 px-2 py-0.5 rounded-full mb-2" style={{ fontWeight: 600 }}>{e.kategori}</span>
                  <p className="font-600 text-sm text-[#1A2332] leading-snug mb-2" style={{ fontWeight: 600 }}>{e.judul}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8]"><Clock className="w-3 h-3 inline mr-1" />{e.waktuBaca}</span>
                    <span className="text-xs text-[#2E7D32] font-medium">Baca →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "panduan" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { judul: "Panduan Pemberian MPASI Bayi 6 Bulan", desc: "Langkah-langkah pemberian makanan pendamping ASI yang tepat" },
            { judul: "Buku Saku Gizi Usia Sekolah", desc: "Panduan nutrisi untuk usia 6-12 tahun" },
            { judul: "Infografis Status Gizi WHO 2025", desc: "Tabel referensi berat dan tinggi badan standar WHO" },
          ].map(p => (
            <div key={p.judul} className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <p className="font-600 text-sm text-[#1A2332] mb-1" style={{ fontWeight: 600 }}>{p.judul}</p>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">{p.desc}</p>
              <Btn variant="outline" className="w-full justify-center text-xs"><Download className="w-3.5 h-3.5" /> Unduh PDF</Btn>
            </div>
          ))}
        </div>
      )}

      {activeTab === "video" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videoEdukasi.map(v => (
            <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="relative">
                <img src={v.thumbnail} alt={v.judul} className="w-full h-40 object-cover bg-gray-100" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32] ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md">{v.durasi}</span>
              </div>
              <div className="p-4">
                <p className="font-600 text-sm text-[#1A2332]" style={{ fontWeight: 600 }}>{v.judul}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Video className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span className="text-xs text-[#94A3B8]">Video Edukasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PASIEN: PROFIL ───────────────────────────────────────
function ProfilPage({ userName }: { userName: string }) {
  return (
    <div>
      <SectionTitle title="Profil Saya" sub="Kelola informasi akun dan profil." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm text-center">
          <div className="w-20 h-20 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white text-2xl font-700 mx-auto mb-4" style={{ fontWeight: 700 }}>
            {userName.charAt(0)}
          </div>
          <p className="font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>{userName}</p>
          <p className="text-sm text-[#64748B]">Orang Tua / Pasien</p>
          <StatusBadge status="Aktif" />
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <h3 className="font-600 text-[#1A2332] mb-5" style={{ fontWeight: 600 }}>Edit Profil</h3>
          <div className="space-y-4">
            <InputField label="Nama Lengkap" placeholder={userName} icon={User} />
            <InputField label="Email" type="email" placeholder="ahmad@email.com" icon={Mail} />
            <InputField label="Nomor WhatsApp" placeholder="0812-3456-7890" icon={Phone} />
            <Btn className="mt-2"><CheckCircle className="w-4 h-4" /> Simpan Perubahan</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AHLI GIZI: DASHBOARD ─────────────────────────────────
function AhliGiziDashboard({ onNavigate }: { onNavigate: NavFn }) {
  const [jadwal, setJadwal] = useState(jadwalHariIni);
  const markSelesai = (index: number) => {
    const newJadwal = [...jadwal];
    newJadwal[index].status = "Selesai";
    jadwalHariIni[index].status = "Selesai";
    setJadwal(newJadwal);
  };

  return (
    <div>
      <SectionTitle title="Dashboard Ahli Gizi" sub="Selamat pagi, Dr. Nurul Hidayah! Berikut ringkasan hari ini." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Pasien Aktif" value="42" sub="+3 bulan ini" color="green" />
        <StatCard icon={MessageSquare} label="Konsultasi Hari Ini" value="4" sub="2 selesai" color="blue" />
        <StatCard icon={Calendar} label="Jadwal Hari Ini" value="4 sesi" sub="Mulai 08:00" color="orange" />
        <StatCard icon={BookOpen} label="Materi Edukasi" value="18" sub="3 baru bulan ini" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal hari ini */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
            <h3 className="font-600 text-[#1A2332] text-sm" style={{ fontWeight: 600 }}>Jadwal Hari Ini</h3>
            <span className="text-xs text-[#64748B]">Senin, 22 Jun 2026</span>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {jadwal.map((j, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition">
                <div className="w-14 text-right">
                  <span className="text-xs font-600 text-[#2E7D32]" style={{ fontWeight: 600 }}>{j.waktu}</span>
                </div>
                <div className="w-px h-8 bg-[rgba(0,0,0,0.07)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A2332] truncate">{j.pasien}</p>
                  <p className="text-xs text-[#64748B]">{j.jenis}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={j.status} />
                  {j.status !== "Selesai" && (
                    <Btn variant="outline" className="text-[10px] px-2 py-1 h-auto min-h-0" onClick={() => markSelesai(i)}>Selesai</Btn>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas pasien terbaru */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)]">
            <h3 className="font-600 text-[#1A2332] text-sm" style={{ fontWeight: 600 }}>Aktivitas Pasien Terbaru</h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {[
              { nama: "Ahmad Rizky", aksi: "Update berat badan: 20.5 kg", waktu: "10 menit lalu", dot: "bg-green-400" },
              { nama: "Siti Fatimah", aksi: "Mengajukan jadwal konsultasi", waktu: "1 jam lalu", dot: "bg-blue-400" },
              { nama: "Budi Santoso", aksi: "Unduh panduan gizi balita", waktu: "2 jam lalu", dot: "bg-orange-400" },
              { nama: "Dewi Lestari", aksi: "Membaca artikel pola makan", waktu: "3 jam lalu", dot: "bg-purple-400" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", a.dot)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A2332]">{a.nama}</p>
                  <p className="text-xs text-[#64748B] truncate">{a.aksi}</p>
                </div>
                <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">{a.waktu}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AHLI GIZI: MONITORING PASIEN ────────────────────────
function AhliGiziMonitoring({ onNavigate }: { onNavigate: NavFn }) {
  const [search, setSearch] = useState("");
  const filtered = patients.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionTitle title="Monitoring Pasien" sub="Pantau status gizi dan perkembangan seluruh pasien." />
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama pasien..." className="w-full bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition" />
          </div>
          <Btn variant="outline" className="text-xs"><Filter className="w-3.5 h-3.5" /> Filter Status</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {["Nama Pasien", "Umur", "Status Gizi", "Konsultasi Terakhir"].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-[#64748B] px-5 py-3" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA] transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#2E7D32] text-xs font-600" style={{ fontWeight: 600 }}>
                        {p.nama.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#1A2332]">{p.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">{p.umur}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.statusGizi} /></td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">{p.konsultasiTerakhir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AHLI GIZI: DETAIL PASIEN ─────────────────────────────
function AhliGiziDetailPasien({ onNavigate }: { onNavigate: NavFn }) {
  const p = patients[0] || { nama: "Pasien Baru", umur: "-", statusGizi: "Normal", wa: "-" };
  return (
    <div>
      <button onClick={() => onNavigate("ag-monitoring")} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#2E7D32] mb-6 transition">
        <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Monitoring
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biodata */}
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center text-[#2E7D32] text-2xl font-700 mb-4" style={{ fontWeight: 700 }}>
            {p.nama.charAt(0)}
          </div>
          <h2 className="font-700 text-[#1A2332] mb-1" style={{ fontWeight: 700 }}>{p.nama}</h2>
          <p className="text-sm text-[#64748B] mb-4">{p.umur}</p>
          <div className="space-y-2.5">
            {[["Status Gizi", p.statusGizi], ["Berat Badan", "20.5 kg"], ["Tinggi Badan", "112 cm"], ["IMT", "16.5"], ["WhatsApp", p.wa]].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center text-sm">
                <span className="text-[#64748B]">{k}</span>
                <span className="font-medium text-[#1A2332]">{k === "Status Gizi" ? <StatusBadge status={v} /> : v}</span>
              </div>
            ))}
          </div>
          <Btn className="w-full justify-center mt-5 text-xs" onClick={() => onNavigate("ag-rekam")}>
            <Clipboard className="w-3.5 h-3.5" /> Rekam Konsultasi
          </Btn>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
              <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Riwayat Berat Badan</p>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                  <Area type="monotone" dataKey="berat" stroke="#2E7D32" strokeWidth={2} fill="#E8F5E9" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
              <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Grafik IMT</p>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={imtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                  <Line type="monotone" dataKey="imt" stroke="#FF7043" strokeWidth={2} dot={{ fill: "#FF7043", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Riwayat konsultasi pasien */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[rgba(0,0,0,0.06)]">
              <h3 className="font-600 text-sm text-[#1A2332]" style={{ fontWeight: 600 }}>Riwayat Konsultasi</h3>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {riwayatKonsultasi.map(r => (
                <div key={r.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1A2332]">{r.tanggal}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-[#64748B]">{r.ringkasan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AHLI GIZI: REKAM KONSULTASI ─────────────────────────
function AhliGiziRekam() {
  const [pasien, setPasien] = useState("");
  const [tgl, setTgl] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [diagnosa, setDiagnosa] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Rekam Konsultasi" sub="Catat hasil konsultasi dan diagnosis gizi pasien." />
      {saved ? (
        <div className="bg-white rounded-2xl p-12 border border-[rgba(0,0,0,0.06)] shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#2E7D32]" />
          </div>
          <h3 className="font-700 text-[#1A2332] mb-2" style={{ fontWeight: 700 }}>Rekam Konsultasi Tersimpan!</h3>
          <p className="text-sm text-[#64748B] mb-6">Data konsultasi berhasil disimpan ke sistem.</p>
          <Btn onClick={() => {
            setSaved(false);
            setPasien(""); setTgl(""); setKeluhan(""); setDiagnosa("");
          }}>Rekam Konsultasi Baru</Btn>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Nama Pasien" placeholder="Masukkan nama pasien" value={pasien} onChange={setPasien} />
              <InputField label="Tanggal Konsultasi" type="date" value={tgl} onChange={setTgl} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A2332]">Keluhan Pasien</label>
              <textarea value={keluhan} onChange={e => setKeluhan(e.target.value)} rows={3} placeholder="Deskripsikan keluhan yang disampaikan pasien..." className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition resize-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A2332]">Hasil Pemeriksaan</label>
              <textarea rows={3} placeholder="Berat badan, tinggi badan, IMT, dan temuan klinis lainnya..." className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A2332]">Diagnosa Gizi</label>
                <textarea value={diagnosa} onChange={e => setDiagnosa(e.target.value)} rows={3} placeholder="Masalah gizi yang teridentifikasi..." className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A2332]">Rekomendasi Nutrisi</label>
                <textarea rows={3} placeholder="Anjuran pola makan, suplemen, dan intervensi gizi..." className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition resize-none" />
              </div>
            </div>
            <InputField label="Jadwal Kontrol Berikutnya" type="date" />
            <div className="pt-2">
              <Btn onClick={() => {
                agRiwayat.unshift({
                  tanggal: tgl || new Date().toISOString().split('T')[0],
                  pasien: pasien || "Pasien Baru",
                  keluhan: keluhan || "-",
                  diagnosa: diagnosa || "-",
                  status: "Selesai"
                });
                setSaved(true);
              }} className="px-8">
                <CheckCircle className="w-4 h-4" /> Simpan Rekam Konsultasi
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AHLI GIZI: RIWAYAT KONSULTASI ───────────────────────
function AhliGiziRiwayat() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  return (
    <div>
      <SectionTitle title="Riwayat Konsultasi" sub="Seluruh rekam konsultasi yang pernah dilakukan." />
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pasien atau tanggal..." className="w-full bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition">
            <option value="">Semua Status</option>
            <option>Selesai</option>
            <option>Berlangsung</option>
          </select>
          <Btn variant="outline" className="text-xs"><Download className="w-3.5 h-3.5" /> Export</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {["Tanggal", "Pasien", "Keluhan", "Diagnosa Gizi", "Status", "Aksi"].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-[#64748B] px-5 py-3" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agRiwayat.map((r, i) => (
                <tr key={i} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA] transition">
                  <td className="px-5 py-4 text-sm whitespace-nowrap text-[#1A2332]">{r.tanggal}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#1A2332]">{r.pasien}</td>
                  <td className="px-5 py-4 text-sm text-[#64748B] max-w-[140px] truncate">{r.keluhan}</td>
                  <td className="px-5 py-4 text-sm text-[#64748B] max-w-[160px] truncate">{r.diagnosa}</td>
                  <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-4">
                    <Btn variant="ghost" className="text-xs px-3 py-1.5"><FileText className="w-3.5 h-3.5" /> Detail</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AHLI GIZI: KELOLA EDUKASI ────────────────────────────
function AhliGiziKelola() {
  const [activeTab, setActiveTab] = useState<"artikel" | "panduan" | "video">("artikel");
  return (
    <div>
      <SectionTitle title="Kelola Edukasi" sub="Unggah dan kelola konten edukasi untuk pasien." />
      <div className="flex flex-wrap gap-3 mb-6">
        <Btn><Upload className="w-4 h-4" /> Upload Artikel</Btn>
        <Btn variant="outline"><FileText className="w-4 h-4" /> Upload Panduan</Btn>
        <Btn variant="outline"><Video className="w-4 h-4" /> Upload Video</Btn>
      </div>
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="flex bg-[#F8FAFC] border-b border-[rgba(0,0,0,0.06)]">
          {(["artikel", "panduan", "video"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={cn("px-6 py-3.5 text-sm font-medium transition capitalize", activeTab === t ? "text-[#2E7D32] border-b-2 border-[#2E7D32] bg-white" : "text-[#64748B] hover:text-[#1A2332]")}>
              {t === "artikel" ? "Artikel" : t === "panduan" ? "Panduan PDF" : "Video"}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {["Judul", "Kategori", "Tanggal Upload", "Status", "Aksi"].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-[#64748B] px-5 py-3" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {edukasiKonten.slice(0, 4).map(e => (
                <tr key={e.id} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA] transition">
                  <td className="px-5 py-4 text-sm font-medium text-[#1A2332] max-w-xs truncate">{e.judul}</td>
                  <td className="px-5 py-4"><span className="bg-[#E8F5E9] text-[#2E7D32] text-xs px-2.5 py-0.5 rounded-full">{e.kategori}</span></td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">15 Jun 2026</td>
                  <td className="px-5 py-4"><StatusBadge status="Aktif" /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Btn variant="ghost" className="text-xs px-3 py-1.5"><Edit3 className="w-3.5 h-3.5" /> Edit</Btn>
                      <Btn variant="danger" className="text-xs px-3 py-1.5"><Trash2 className="w-3.5 h-3.5" /> Hapus</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN: DASHBOARD ─────────────────────────────────────
function AdminDashboard() {
  return (
    <div>
      <SectionTitle title="Dashboard Admin" sub="Ringkasan data dan analitik SiGizi PABA." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Pasien" value="145" sub="+12 bulan ini" color="green" />
        <StatCard icon={Stethoscope} label="Total Ahli Gizi" value="12" sub="10 aktif" color="blue" />
        <StatCard icon={ClipboardList} label="Total Konsultasi" value="387" sub="48 bulan ini" color="orange" />
        <StatCard icon={BookOpen} label="Konten Edukasi" value="48" sub="6 baru" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Status Gizi */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Distribusi Status Gizi</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={distribusiGizi} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {distribusiGizi.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {distribusiGizi.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[#64748B]">{d.name}</span>
                </div>
                <span className="font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Konsultasi Bulanan */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Konsultasi Bulanan</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={konsultasiBulanan}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="konsultasi" fill="#2E7D32" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pertumbuhan Pengguna */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Pertumbuhan Pengguna</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={pertumbuhanPengguna}>
              <defs>
                <linearGradient id="pgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#42A5F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="pengguna" stroke="#42A5F5" strokeWidth={2} fill="url(#pgGrad)" dot={{ fill: "#42A5F5", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN: KELOLA DATA PASIEN ────────────────────────────
function AdminKelolaPasien() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filtered = patients.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionTitle title="Kelola Data Pasien" sub="Manajemen data seluruh pasien terdaftar." />
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama pasien..." className="w-full bg-[#F8FAFC] border border-[rgba(0,0,0,0.08)] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition" />
          </div>
          <Btn className="text-xs" onClick={() => setShowModal(true)}><Plus className="w-3.5 h-3.5" /> Tambah Pasien</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {["Nama", "Umur", "Status Gizi", "Nomor WhatsApp", "Aksi"].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-[#64748B] px-5 py-3" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA] transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#2E7D32] text-xs font-600" style={{ fontWeight: 600 }}>
                        {p.nama.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#1A2332]">{p.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">{p.umur}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.statusGizi} /></td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">{p.wa}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <Btn variant="ghost" className="text-xs px-2.5 py-1.5"><FileText className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" className="text-xs px-2.5 py-1.5"><Edit3 className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="danger" className="text-xs px-2.5 py-1.5"><Trash2 className="w-3.5 h-3.5" /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>Tambah Pasien Baru</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <InputField label="Nama Pasien" placeholder="Nama lengkap" icon={User} />
              <InputField label="Umur" placeholder="Umur pasien (tahun)" />
              <InputField label="Nomor WhatsApp" placeholder="08xx-xxxx-xxxx" icon={Phone} />
              <SelectField label="Status Gizi" options={["Normal", "Kurang", "Lebih", "Buruk"]} />
            </div>
            <div className="flex gap-3 mt-6">
              <Btn variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Batal</Btn>
              <Btn onClick={() => setShowModal(false)} className="flex-1 justify-center"><CheckCircle className="w-4 h-4" /> Simpan</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN: MANAJEMEN JADWAL ──────────────────────────────
function AdminJadwal() {
  const [selectedDate, setSelectedDate] = useState(22);
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  // Force re-render helper if nutritionists changed
  const [, setTick] = useState(0);
  const [editingNutri, setEditingNutri] = useState<any>(null);
  const [tempJam, setTempJam] = useState("");
  const [tempHari, setTempHari] = useState("");

  const editJam = (n: any) => {
    setEditingNutri(n);
    setTempJam(n.jam);
    setTempHari(n.hari || "");
  };

  const saveJam = () => {
    if (editingNutri) {
      editingNutri.jam = tempJam;
      editingNutri.hari = tempHari;
      setTick(t => t + 1);
      setEditingNutri(null);
    }
  };

  return (
    <div>
      <SectionTitle title="Manajemen Jadwal" sub="Kelola jadwal konsultasi seluruh ahli gizi." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-sm text-[#1A2332]" style={{ fontWeight: 600 }}>Juni 2026</h3>
            <div className="flex gap-1">
              <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B] text-xs">‹</button>
              <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B] text-xs">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(d => <div key={d} className="text-center text-[10px] text-[#94A3B8] font-medium py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            <div className="text-center py-1.5 text-xs text-[#CBD5E1]"></div>
            {dates.map(d => (
              <div key={d} onClick={() => setSelectedDate(d)} className={cn("text-center py-1.5 text-xs rounded-lg cursor-pointer transition font-medium", d === selectedDate ? "bg-[#2E7D32] text-white" : "text-[#1A2332] hover:bg-[#E8F5E9]")}>
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
            <h3 className="font-600 text-sm text-[#1A2332]" style={{ fontWeight: 600 }}>Jadwal {selectedDate} Jun 2026</h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {nutritionists.map((n, i) => (
              <div key={n.id} className="flex items-center gap-5 px-5 py-4 hover:bg-[#FAFAFA] transition">
                <div className="w-24 text-right">
                  <span className="text-sm font-600 text-[#2E7D32]" style={{ fontWeight: 600 }}>{n.jam}</span>
                </div>
                <div className="w-px h-10 bg-[rgba(0,0,0,0.07)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A2332]">{n.nama}</p>
                  <p className="text-xs text-[#64748B]">{n.spesialisasi} — {n.hari}</p>
                </div>
                <div className="flex gap-1.5">
                  <Btn variant="ghost" onClick={() => editJam(n)} className="text-xs px-2.5 py-1.5" title="Ubah Jam"><Edit3 className="w-3.5 h-3.5" /></Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Edit Jam */}
      {editingNutri && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditingNutri(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>Ubah Jam Praktik</h3>
              <button onClick={() => setEditingNutri(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-[#64748B] mb-2">Edit jadwal untuk <strong>{editingNutri.nama}</strong></p>
              <InputField label="Hari Praktik" placeholder="Contoh: Senin - Jumat" value={tempHari} onChange={setTempHari} />
              <InputField label="Jam Praktik" placeholder="08:00 - 15:00" value={tempJam} onChange={setTempJam} />
            </div>
            <div className="flex gap-3 mt-6">
              <Btn variant="outline" onClick={() => setEditingNutri(null)} className="flex-1 justify-center">Batal</Btn>
              <Btn onClick={saveJam} className="flex-1 justify-center"><CheckCircle className="w-4 h-4" /> Simpan</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN: LAPORAN STATISTIK ─────────────────────────────
function AdminLaporan() {
  const [selectedMonth, setSelectedMonth] = useState("Juni 2026");

  // Dynamic dummy data based on month
  const randomFactor = selectedMonth === "Juni 2026" ? 1 : selectedMonth === "Mei 2026" ? 0.8 : 0.6;
  const dynKonsultasi = konsultasiBulanan.map(d => ({ ...d, konsultasi: Math.round(d.konsultasi * randomFactor) }));
  const dynPengguna = pertumbuhanPengguna.map(d => ({ ...d, pengguna: Math.round(d.pengguna * randomFactor) }));

  return (
    <div>
      <SectionTitle title="Laporan Statistik" sub="Analitik interaktif data gizi dan konsultasi." />
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#2E7D32] transition">
          <option>Juni 2026</option>
          <option>Mei 2026</option>
          <option>April 2026</option>
        </select>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Rata-rata IMT" value="16.3" sub="Normal" color="green" />
        <StatCard icon={Users} label="Kasus Baru" value="12" sub="Bulan ini" color="blue" />
        <StatCard icon={CheckCircle} label="Pulih Gizi Kurang" value="8" sub="Bulan ini" color="orange" />
        <StatCard icon={Activity} label="Tingkat Keberhasilan" value="94%" sub="Penanganan gizi" color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Tren Konsultasi (Jan–Jul 2026)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dynKonsultasi}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Bar dataKey="konsultasi" fill="#2E7D32" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <p className="font-600 text-sm text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Pertumbuhan Pengguna</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dynPengguna}>
              <defs>
                <linearGradient id="aGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#42A5F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Area type="monotone" dataKey="pengguna" stroke="#42A5F5" strokeWidth={2} fill="url(#aGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN: KELOLA MASTER DATA ────────────────────────────
function AdminMasterData() {
  const [activeTab, setActiveTab] = useState<"ahligizi" | "kategori" | "referensi" | "user">("ahligizi");
  const [, setTick] = useState(0);

  const tabs = [
    { key: "ahligizi" as const, label: "Ahli Gizi" },
    { key: "kategori" as const, label: "Kategori Edukasi" },
    { key: "referensi" as const, label: "Referensi Status Gizi" },
    { key: "user" as const, label: "User Management" },
  ];

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingNutri, setEditingNutri] = useState<any>(null);
  const [tempNama, setTempNama] = useState("");
  const [tempSp, setTempSp] = useState("");

  const addNutri = () => {
    setTempNama("");
    setTempSp("");
    setModalMode("add");
  };

  const editNutri = (n: any) => {
    setEditingNutri(n);
    setTempNama(n.nama);
    setTempSp(n.spesialisasi);
    setModalMode("edit");
  };

  const saveNutri = () => {
    if (modalMode === "add") {
      if (!tempNama) return;
      nutritionists.push({
        id: Date.now(),
        nama: tempNama,
        spesialisasi: tempSp || "Umum",
        pengalaman: "0 tahun", rating: 0, konsultasi: 0, foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&auto=format",
        available: true, hari: "Senin - Jumat", jam: "08:00 - 15:00", status: "Aktif"
      });
    } else if (modalMode === "edit" && editingNutri) {
      editingNutri.nama = tempNama;
      editingNutri.spesialisasi = tempSp;
    }
    setTick(t => t + 1);
    setModalMode(null);
  };

  const [deletingNutri, setDeletingNutri] = useState<any>(null);

  const deleteNutri = (n: any) => {
    setDeletingNutri(n);
  };

  const confirmDelete = () => {
    if (deletingNutri) {
      const idx = nutritionists.findIndex(x => x.id === deletingNutri.id);
      if (idx > -1) nutritionists.splice(idx, 1);
      setTick(t => t + 1);
      setDeletingNutri(null);
    }
  };

  const toggleStatus = (n: any) => {
    n.status = (n.status || "Aktif") === "Nonaktif" ? "Aktif" : "Nonaktif";
    setTick(t => t + 1);
  };

  const mockUsers = [
    { id: 'u1', nama: "Ahmad Rizky", email: "ahmad@email.com", role: "Pasien", status: "Aktif" },
    { id: 'u2', nama: "Admin PABA", email: "admin@sigizi.id", role: "Admin", status: "Aktif" },
    { id: 'u3', nama: "Siti Fatimah", email: "siti@email.com", role: "Pasien", status: "Aktif" },
  ];
  
  const allUsers = [
    ...mockUsers.map(u => ({ ...u, isNutri: false, raw: null })),
    ...nutritionists.map(n => ({ id: n.id, nama: n.nama, email: "ahli@sigizi.id", role: "Ahli Gizi", status: n.status || "Aktif", isNutri: true, raw: n }))
  ];

  return (
    <div>
      <SectionTitle title="Kelola Master Data" sub="Manajemen data referensi dan pengguna sistem." />
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[rgba(0,0,0,0.06)] bg-[#F8FAFC]">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={cn("px-6 py-3.5 text-sm font-medium whitespace-nowrap transition", activeTab === t.key ? "text-[#2E7D32] border-b-2 border-[#2E7D32] bg-white" : "text-[#64748B] hover:text-[#1A2332]")}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "ahligizi" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Daftar Ahli Gizi</p>
                <Btn onClick={addNutri} className="text-xs"><Plus className="w-3.5 h-3.5" /> Tambah Ahli Gizi</Btn>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC] rounded-xl">
                    {["Nama", "Spesialisasi", "Status", "Aksi"].map(h => <th key={h} className="text-left text-xs font-600 text-[#64748B] px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {nutritionists.map(n => (
                    <tr key={n.id} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={n.foto} alt={n.nama} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                          <span className="text-sm font-medium text-[#1A2332]">{n.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#64748B]">{n.spesialisasi}</td>
                      <td className="px-4 py-3.5 cursor-pointer" onClick={() => toggleStatus(n)}>
                        <StatusBadge status={n.status || "Aktif"} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <Btn variant="ghost" onClick={() => editNutri(n)} className="text-xs px-2.5 py-1.5"><Edit3 className="w-3.5 h-3.5" /></Btn>
                          <Btn variant="danger" onClick={() => deleteNutri(n)} className="text-xs px-2.5 py-1.5"><Trash2 className="w-3.5 h-3.5" /></Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "kategori" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Kategori Konten Edukasi</p>
                <Btn className="text-xs"><Plus className="w-3.5 h-3.5" /> Tambah Kategori</Btn>
              </div>
              <div className="space-y-2">
                {["Nutrisi Umum", "Pola Makan", "Pertumbuhan", "Kebutuhan Khusus"].map((k, i) => (
                  <div key={k} className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[#E8F5E9] rounded-md flex items-center justify-center text-[#2E7D32] text-xs font-600" style={{ fontWeight: 600 }}>{i + 1}</span>
                      <span className="text-sm font-medium text-[#1A2332]">{k}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <Btn variant="ghost" className="text-xs px-2.5 py-1.5"><Edit3 className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="danger" className="text-xs px-2.5 py-1.5"><Trash2 className="w-3.5 h-3.5" /></Btn>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "referensi" && (
            <>
              <p className="text-sm font-600 text-[#1A2332] mb-4" style={{ fontWeight: 600 }}>Referensi Kategori Status Gizi (WHO)</p>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {["Kategori", "Rentang IMT", "Keterangan", "Aksi"].map(h => <th key={h} className="text-left text-xs font-600 text-[#64748B] px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Gizi Buruk", range: "< 14.0", ket: "Severe malnutrition", color: "text-red-600" },
                    { cat: "Gizi Kurang", range: "14.0 – 15.9", ket: "Moderate malnutrition", color: "text-orange-600" },
                    { cat: "Gizi Normal", range: "16.0 – 18.4", ket: "Normal nutrition", color: "text-green-600" },
                    { cat: "Gizi Lebih", range: "≥ 18.5", ket: "Overnutrition / Overweight", color: "text-yellow-600" },
                  ].map(r => (
                    <tr key={r.cat} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA]">
                      <td className={cn("px-4 py-3.5 text-sm font-medium", r.color)}>{r.cat}</td>
                      <td className="px-4 py-3.5 text-sm text-[#64748B] font-mono">{r.range}</td>
                      <td className="px-4 py-3.5 text-sm text-[#64748B]">{r.ket}</td>
                      <td className="px-4 py-3.5">
                        <Btn variant="ghost" className="text-xs px-2.5 py-1.5"><Edit3 className="w-3.5 h-3.5" /></Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "user" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-600 text-[#1A2332]" style={{ fontWeight: 600 }}>Manajemen Pengguna</p>
                <Btn className="text-xs"><Plus className="w-3.5 h-3.5" /> Tambah User</Btn>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {["Nama", "Email", "Role", "Status", "Aksi"].map(h => <th key={h} className="text-left text-xs font-600 text-[#64748B] px-4 py-3" style={{ fontWeight: 600 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u, i) => (
                    <tr key={u.id} className="border-t border-[rgba(0,0,0,0.05)] hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#2E7D32] text-xs font-600" style={{ fontWeight: 600 }}>{u.nama.charAt(0)}</div>
                          <span className="text-sm font-medium text-[#1A2332]">{u.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#64748B]">{u.email}</td>
                      <td className="px-4 py-3.5"><span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full">{u.role}</span></td>
                      <td className="px-4 py-3.5 cursor-pointer" onClick={() => {
                        if (u.isNutri) toggleStatus(u.raw);
                      }}><StatusBadge status={u.status} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <Btn variant="ghost" onClick={() => {
                            if (u.isNutri) editNutri(u.raw);
                          }} className="text-xs px-2.5 py-1.5"><Edit3 className="w-3.5 h-3.5" /></Btn>
                          {u.isNutri && <Btn variant="danger" onClick={() => deleteNutri(u.raw)} className="text-xs px-2.5 py-1.5"><Trash2 className="w-3.5 h-3.5" /></Btn>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Modal Kelola Ahli Gizi */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModalMode(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-[#1A2332]" style={{ fontWeight: 700 }}>
                {modalMode === "add" ? "Tambah Ahli Gizi" : "Ubah Info Ahli Gizi"}
              </h3>
              <button onClick={() => setModalMode(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <InputField label="Nama Lengkap" placeholder="Contoh: Dr. Budi Santoso, S.Gz" value={tempNama} onChange={setTempNama} />
              <InputField label="Spesialisasi" placeholder="Contoh: Gizi Klinik" value={tempSp} onChange={setTempSp} />
            </div>
            <div className="flex gap-3 mt-6">
              <Btn variant="outline" onClick={() => setModalMode(null)} className="flex-1 justify-center">Batal</Btn>
              <Btn onClick={saveNutri} className="flex-1 justify-center"><CheckCircle className="w-4 h-4" /> Simpan</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Ahli Gizi */}
      {deletingNutri && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeletingNutri(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-700 text-[#1A2332] text-lg mb-2" style={{ fontWeight: 700 }}>Hapus Data</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Apakah Anda yakin ingin menghapus <strong>{deletingNutri.nama}</strong>? Data yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3 w-full">
                <Btn variant="outline" onClick={() => setDeletingNutri(null)} className="flex-1 justify-center">Batal</Btn>
                <Btn variant="danger" onClick={confirmDelete} className="flex-1 justify-center">Hapus</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [role, setRole] = useState<Role>("pasien");

  const nav: NavFn = (s: Screen) => setScreen(s);

  const handleLogin = (r: Role) => setRole(r);

  const userName = role === "pasien" ? "Ahmad Rizky" : role === "ahligizi" ? "Dr. Nurul Hidayah" : "Admin PABA";

  // Public screens
  if (screen === "landing") return <LandingPage onNavigate={nav} />;
  if (screen === "login") return <LoginPage onNavigate={nav} onLogin={handleLogin} />;
  if (screen === "register") return <RegisterPage onNavigate={nav} />;

  // Pasien screens
  const pasienScreens: Screen[] = ["p-dashboard", "p-kalkulator", "p-konsultasi", "p-detail-ahli", "p-riwayat", "p-edukasi", "p-profil"];
  if (pasienScreens.includes(screen) || (screen.startsWith("p-") && role === "pasien")) {
    return (
      <DashboardLayout role="pasien" activeScreen={screen} onNavigate={nav} userName={userName}>
        {screen === "p-dashboard" && <PasienDashboard onNavigate={nav} />}
        {screen === "p-kalkulator" && <PasienKalkulator />}
        {screen === "p-konsultasi" && <PasienKonsultasi onNavigate={nav} />}
        {screen === "p-detail-ahli" && <PasienDetailAhli onNavigate={nav} />}
        {screen === "p-riwayat" && <PasienRiwayat />}
        {screen === "p-edukasi" && <PasienEdukasi />}
        {screen === "p-profil" && <ProfilPage userName={userName} />}
      </DashboardLayout>
    );
  }

  // Ahli Gizi screens
  const agScreens: Screen[] = ["ag-dashboard", "ag-monitoring", "ag-detail-pasien", "ag-rekam", "ag-riwayat", "ag-kelola", "ag-profil"];
  if (agScreens.includes(screen)) {
    return (
      <DashboardLayout role="ahligizi" activeScreen={screen} onNavigate={nav} userName={userName}>
        {screen === "ag-dashboard" && <AhliGiziDashboard onNavigate={nav} />}
        {screen === "ag-monitoring" && <AhliGiziMonitoring onNavigate={nav} />}
        {screen === "ag-detail-pasien" && <AhliGiziDetailPasien onNavigate={nav} />}
        {screen === "ag-rekam" && <AhliGiziRekam />}
        {screen === "ag-riwayat" && <AhliGiziRiwayat />}
        {screen === "ag-kelola" && <AhliGiziKelola />}
        {screen === "ag-profil" && <ProfilPage userName={userName} />}
      </DashboardLayout>
    );
  }

  // Admin screens
  const adScreens: Screen[] = ["ad-dashboard", "ad-pasien", "ad-jadwal", "ad-laporan", "ad-master", "ad-profil"];
  if (adScreens.includes(screen)) {
    return (
      <DashboardLayout role="admin" activeScreen={screen} onNavigate={nav} userName={userName}>
        {screen === "ad-dashboard" && <AdminDashboard />}
        {screen === "ad-pasien" && <AdminKelolaPasien />}
        {screen === "ad-jadwal" && <AdminJadwal />}
        {screen === "ad-laporan" && <AdminLaporan />}
        {screen === "ad-master" && <AdminMasterData />}
        {screen === "ad-profil" && <ProfilPage userName={userName} />}
      </DashboardLayout>
    );
  }

  return <LandingPage onNavigate={nav} />;
}
