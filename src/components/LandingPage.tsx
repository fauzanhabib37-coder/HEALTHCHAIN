import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Brain,
  Shield,
  FileCheck,
  Activity,
  BarChart3,
  Bell,
  Lock,
  TrendingUp,
  Users,
  Building2,
  ChevronRight,
  CheckCircle2,
  Zap,
  Eye,
  Server,
  Workflow,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type Page =
  | "landing"
  | "login"
  | "dashboard-bpjs"
  | "dashboard-faskes"
  | "dashboard-peserta";

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for charts
const claimsTrendData = [
  { month: "Jan", klaim: 45000, disetujui: 42000 },
  { month: "Feb", klaim: 52000, disetujui: 48000 },
  { month: "Mar", klaim: 48000, disetujui: 45000 },
  { month: "Apr", klaim: 61000, disetujui: 57000 },
  { month: "May", klaim: 55000, disetujui: 52000 },
  { month: "Jun", klaim: 67000, disetujui: 63000 },
  { month: "Jul", klaim: 71000, disetujui: 67000 },
  { month: "Aug", klaim: 69000, disetujui: 65000 },
  { month: "Sep", klaim: 75000, disetujui: 71000 },
  { month: "Oct", klaim: 82000, disetujui: 77000 },
  { month: "Nov", klaim: 78000, disetujui: 74000 },
  { month: "Dec", klaim: 85000, disetujui: 80000 },
];

const topFaskesData = [
  { name: "RS. Cipto Mangunkusumo", klaim: 12500 },
  { name: "RS. Hasan Sadikin", klaim: 11200 },
  { name: "RS. Sanglah", klaim: 10800 },
  { name: "RS. Dr. Soetomo", klaim: 9500 },
  { name: "RS. Sardjito", klaim: 8900 },
];

const serviceTypeData = [
  { name: "Rawat Jalan", value: 45, color: "#3b82f6" },
  { name: "Rawat Inap", value: 35, color: "#8b5cf6" },
  { name: "IGD", value: 15, color: "#ec4899" },
  { name: "Lainnya", value: 5, color: "#f59e0b" },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">HealthChain.AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => onNavigate("landing")}>
                Tentang
              </Button>
              <Button variant="ghost">Fitur</Button>
              <Button variant="ghost">Dokumentasi</Button>
              <Button onClick={() => onNavigate("login")}>Masuk</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Zap className="w-3 h-3 mr-1" />
                Powered by AI & IoT
              </Badge>
              <h1 className="text-5xl tracking-tight">
                HealthChain.AI
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Intelligent Healthcare Claims Automation
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Platform berbasis AI & IoT untuk merevolusi pengelolaan klaim
                kesehatan, deteksi fraud, dan monitoring fasilitas kesehatan
                secara real-time.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => onNavigate("login")}>
                  Masuk / Login
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Demo
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl text-blue-600">1.2M+</div>
                  <div className="text-sm text-gray-600">Klaim Diproses</div>
                </div>
                <div>
                  <div className="text-3xl text-purple-600">98.5%</div>
                  <div className="text-sm text-gray-600">Akurasi AI</div>
                </div>
                <div>
                  <div className="text-3xl text-green-600">45%</div>
                  <div className="text-sm text-gray-600">Fraud Terdeteksi</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1560306990-18fa759c8713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVjaG5vbG9neSUyMGhvc3BpdGFsfGVufDF8fHx8MTc2MzEyNTc5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Healthcare Technology"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      Real-time Processing
                    </div>
                    <div className="text-green-600">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Tentang Platform</Badge>
            <h2 className="text-4xl mb-4">Sekilas Tentang HealthChain.AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform digital berbasis kecerdasan buatan untuk mempercepat
              proses klaim BPJS Kesehatan, mengurangi potensi fraud, dan
              meningkatkan transparansi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Apa itu HealthChain.AI?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Platform digital berbasis kecerdasan buatan untuk mempercepat
                  proses klaim BPJS Kesehatan, mengurangi potensi fraud, dan
                  meningkatkan transparansi antara BPJS, faskes, dan peserta.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Workflow className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Bagaimana Cara Kerjanya?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>AI membaca & memvalidasi berkas klaim</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Fraud detection menganalisis pola risiko</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Dashboard real-time untuk semua stakeholder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>IoT monitoring antrean & peralatan</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Siapa yang Menggunakan?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>BPJS Kesehatan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>Rumah Sakit & Klinik</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Peserta JKN</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Charts Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Analytics Dashboard Preview</Badge>
            <h2 className="text-4xl mb-4">Kemampuan Analitik Real-Time</h2>
            <p className="text-xl text-gray-600">
              Platform kami dilengkapi dengan dashboard analitik yang powerful
              untuk monitoring dan insight
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Tren Klaim Nasional (12 Bulan Terakhir)
                </CardTitle>
                <CardDescription>
                  Perbandingan klaim yang diajukan vs disetujui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={claimsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="klaim"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Klaim Diajukan"
                    />
                    <Line
                      type="monotone"
                      dataKey="disetujui"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Disetujui"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Top 5 Faskes dengan Klaim Terbanyak
                </CardTitle>
                <CardDescription>
                  Ranking berdasarkan volume klaim bulanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={topFaskesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="klaim" fill="#8b5cf6" name="Jumlah Klaim" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pink-600" />
                  Distribusi Jenis Layanan
                </CardTitle>
                <CardDescription>
                  Breakdown klaim berdasarkan tipe pelayanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Fraud Risk Overview
                </CardTitle>
                <CardDescription>
                  Deteksi dan analisis potensi fraud
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Risk Cases</span>
                    <Badge variant="destructive">127 Kasus</Badge>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: "12%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Risk Cases</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      384 Kasus
                    </Badge>
                  </div>
                  <div className="w-full bg-yellow-100 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "35%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Risk Cases</span>
                    <Badge className="bg-green-100 text-green-800">
                      1,542 Kasus
                    </Badge>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span>Total Fraud Prevented</span>
                      <span className="text-green-600">12.5 Miliar</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Fitur Unggulan</Badge>
            <h2 className="text-4xl mb-4">
              Teknologi Terdepan untuk Healthcare
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>AI Fraud Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Deteksi fraud otomatis dengan explainability AI untuk
                  transparansi keputusan
                </p>
                <Badge className="bg-blue-100 text-blue-700">
                  Accuracy 98.5%
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI Document Validator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ekstraksi dan validasi dokumen otomatis dari PDF, resume
                  medis, ICD-10
                </p>
                <Badge className="bg-purple-100 text-purple-700">
                  OCR + NLP
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Real-time IoT Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monitoring antrean pasien dan status alat medis secara
                  real-time
                </p>
                <Badge className="bg-green-100 text-green-700">
                  IoT Gateway
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Multi-Role Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Dashboard khusus untuk BPJS Admin, Faskes, dan Peserta dengan
                  data relevan
                </p>
                <Badge className="bg-pink-100 text-pink-700">3 Roles</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Real-time Alert System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Notifikasi instant untuk status klaim, fraud alert, dan update
                  penting
                </p>
                <Badge className="bg-yellow-100 text-yellow-700">
                  WebSocket
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Secure Data System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Enkripsi end-to-end dengan JWT authentication dan TLS/HTTPS
                </p>
                <Badge className="bg-indigo-100 text-indigo-700">
                  Enterprise Security
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Alur Kerja</Badge>
            <h2 className="text-4xl mb-4">Proses Klaim yang Efisien</h2>
            <p className="text-xl text-gray-600">
              Dari upload dokumen hingga keputusan klaim dalam hitungan menit
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-6 gap-4">
              {[
                {
                  icon: FileCheck,
                  title: "Upload Dokumen",
                  desc: "Faskes upload berkas klaim",
                },
                {
                  icon: Brain,
                  title: "Analisis AI",
                  desc: "AI memproses & ekstraksi data",
                },
                {
                  icon: Shield,
                  title: "Fraud Check",
                  desc: "Deteksi potensi fraud",
                },
                {
                  icon: CheckCircle2,
                  title: "Validasi",
                  desc: "Verifikasi otomatis",
                },
                {
                  icon: BarChart3,
                  title: "Monitoring",
                  desc: "Dashboard real-time",
                },
                {
                  icon: Bell,
                  title: "Keputusan",
                  desc: "Notifikasi hasil klaim",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="mb-1">{step.title}</div>
                      <p className="text-xs text-gray-600">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {index < 5 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimoni</Badge>
            <h2 className="text-4xl mb-4">Dipercaya oleh Ribuan Pengguna</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      RS. Cipto Mangunkusumo
                    </CardTitle>
                    <CardDescription>Direktur Operasional</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "HealthChain.AI mengurangi waktu proses klaim kami dari 7 hari
                  menjadi hanya 2 hari. Sistem fraud detection sangat membantu
                  dalam audit internal."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">BPJS Kesehatan</CardTitle>
                    <CardDescription>Kepala Divisi IT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Dashboard analitik memberikan insight yang sangat valuable.
                  Kami bisa monitor seluruh faskes secara real-time dan deteksi
                  anomali lebih cepat."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Peserta JKN</CardTitle>
                    <CardDescription>Jakarta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Aplikasi sangat memudahkan untuk tracking klaim saya. Tidak
                  perlu datang ke kantor BPJS untuk cek status, semua ada di
                  dashboard."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">Siap Untuk Transformasi Digital?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan faskes dan jutaan peserta yang sudah
            menggunakan HealthChain.AI
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate("login")}
            >
              Mulai Sekarang
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Server className="w-4 h-4 mr-2" />
              Dokumentasi API
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">HealthChain.AI</span>
              </div>
              <p className="text-sm">
                Platform AI untuk transformasi digital layanan kesehatan
                Indonesia
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Developer</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dokumentasi API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    SDK
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>
              &copy; 2024 HealthChain.AI. All rights reserved. Built with AI &
              ❤️ for Indonesian Healthcare
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
