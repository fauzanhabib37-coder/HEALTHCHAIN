import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  Activity,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  Bell,
  LogOut,
  CreditCard,
  Calendar,
  Heart,
  Pill,
  Stethoscope,
  Download,
  Eye,
  MessageSquare,
  Building2,
  User,
  Shield,
  QrCode,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface DashboardPesertaProps {
  onLogout: () => void;
}

// Mock Data
const pesertaData = {
  nomorKartu: "0001234567890",
  nama: "Ahmad Wijaya",
  nik: "3175010101850001",
  tanggalLahir: "01 Januari 1985",
  jenisKelamin: "Laki-laki",
  alamat: "Jl. Sudirman No. 123, Jakarta Pusat",
  kelas: "Kelas I",
  faskes: "RS. Cipto Mangunkusumo",
  status: "Aktif",
  berlakuHingga: "31 Desember 2025",
};

const claimsHistory = [
  {
    id: "CLM-2024-8823",
    date: "2024-11-10",
    faskes: "RS. Cipto Mangunkusumo",
    service: "Rawat Inap",
    diagnosis: "Demam Berdarah Dengue",
    amount: "4.5 juta",
    status: "approved",
    doctor: "dr. Siti Nurhaliza, Sp.PD",
  },
  {
    id: "CLM-2024-8654",
    date: "2024-10-15",
    faskes: "Klinik Sehat Sentosa",
    service: "Rawat Jalan",
    diagnosis: "Hipertensi",
    amount: "250 ribu",
    status: "approved",
    doctor: "dr. Budi Santoso",
  },
  {
    id: "CLM-2024-8421",
    date: "2024-09-20",
    faskes: "RS. Hasan Sadikin",
    service: "IGD",
    diagnosis: "Gastritis Akut",
    amount: "1.8 juta",
    status: "approved",
    doctor: "dr. Dewi Lestari, Sp.PD",
  },
  {
    id: "CLM-2024-8012",
    date: "2024-08-05",
    faskes: "RS. Cipto Mangunkusumo",
    service: "Rawat Jalan",
    diagnosis: "Diabetes Melitus",
    amount: "350 ribu",
    status: "approved",
    doctor: "dr. Eko Prasetyo, Sp.PD",
  },
];

const medicalHistory = [
  { date: "2024-11", visits: 2, spending: 4750000 },
  { date: "2024-10", visits: 1, spending: 250000 },
  { date: "2024-09", visits: 1, spending: 1800000 },
  { date: "2024-08", visits: 1, spending: 350000 },
  { date: "2024-07", visits: 0, spending: 0 },
  { date: "2024-06", visits: 1, spending: 500000 },
];

const currentQueue = {
  faskes: "RS. Cipto Mangunkusumo",
  poli: "Poli Penyakit Dalam",
  nomorAntrean: "A-042",
  estimasiWaktu: "45 menit",
  sisaAntrean: 8,
  status: "waiting",
};

const prescriptions = [
  {
    date: "2024-11-10",
    doctor: "dr. Siti Nurhaliza, Sp.PD",
    medicines: [
      { name: "Paracetamol 500mg", dosage: "3x1 tablet", duration: "5 hari" },
      { name: "Vitamin C 500mg", dosage: "1x1 tablet", duration: "7 hari" },
    ],
  },
  {
    date: "2024-10-15",
    doctor: "dr. Budi Santoso",
    medicines: [
      { name: "Amlodipine 10mg", dosage: "1x1 tablet", duration: "30 hari" },
    ],
  },
];

export default function DashboardPeserta({ onLogout }: DashboardPesertaProps) {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Halo Pak Ahmad! Saya AI Assistant HealthChain. Ada yang bisa saya bantu terkait klaim atau kesehatan Anda?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);

    setTimeout(() => {
      let response = "";
      if (chatInput.toLowerCase().includes("klaim")) {
        response =
          "Klaim terakhir Anda (CLM-2024-8823) sudah disetujui. Dana akan ditransfer ke RS dalam 2-3 hari kerja.";
      } else if (chatInput.toLowerCase().includes("antrean")) {
        response =
          "Nomor antrean Anda saat ini: A-042. Estimasi waktu tunggu: 45 menit. Sisa 8 pasien di depan Anda.";
      } else {
        response = `Terkait "${chatInput}": Untuk informasi lebih detail, silakan hubungi care center BPJS di 1500400 atau chat dengan customer service kami.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
    }, 1000);

    setChatInput("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Disetujui</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700">Diproses</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">HealthChain.AI</div>
                  <div>Portal Peserta JKN</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <Users className="w-3 h-3 mr-1" />
                Peserta
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-green-100 text-green-700">
                    AW
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div>{pesertaData.nama}</div>
                  <div className="text-xs text-gray-600">
                    {pesertaData.nomorKartu}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-2">
                Selamat Datang, {pesertaData.nama}! 👋
              </h2>
              <p className="opacity-90">
                Status kepesertaan Anda: <strong>{pesertaData.status}</strong> •
                Berlaku hingga {pesertaData.berlakuHingga}
              </p>
            </div>
            <Button variant="secondary" size="lg">
              <QrCode className="w-5 h-5 mr-2" />
              Kartu Digital
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Kunjungan</p>
                  <div className="text-3xl mt-2">12</div>
                  <div className="text-sm text-gray-600 mt-1">Tahun ini</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Klaim Disetujui</p>
                  <div className="text-3xl mt-2">8.2M</div>
                  <div className="text-sm text-green-600 mt-1">
                    100% approved
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faskes Primer</p>
                  <div className="text-base mt-2">RS. Cipto</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {pesertaData.kelas}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status Kartu</p>
                  <div className="text-base mt-2">Aktif</div>
                  <div className="text-sm text-gray-600 mt-1">s/d Des 2025</div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Queue Tracking */}
        {currentQueue && (
          <Card className="border-l-4 border-l-blue-600 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle>Tracking Antrean Real-time</CardTitle>
                    <CardDescription>
                      Status antrean Anda saat ini
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 text-lg px-4 py-2">
                  {currentQueue.nomorAntrean}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Faskes</div>
                  <div>{currentQueue.faskes}</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Poliklinik</div>
                  <div>{currentQueue.poli}</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    Estimasi Waktu
                  </div>
                  <div className="text-blue-600">
                    {currentQueue.estimasiWaktu}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Sisa Antrean</div>
                  <div className="text-orange-600">
                    {currentQueue.sisaAntrean} pasien
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="text-blue-600">Menunggu...</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Digital Card */}
          <Card className="lg:col-span-1 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Kartu Digital JKN
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-xs opacity-80 mb-1">
                      BPJS Kesehatan
                    </div>
                    <div className="text-sm">Kartu Indonesia Sehat</div>
                  </div>
                  <Shield className="w-8 h-8 opacity-80" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs opacity-80 mb-1">Nomor Kartu</div>
                    <div className="text-xl tracking-wider">
                      {pesertaData.nomorKartu}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs opacity-80 mb-1">Nama Peserta</div>
                    <div>{pesertaData.nama}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs opacity-80 mb-1">Kelas</div>
                      <div>{pesertaData.kelas}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80 mb-1">Status</div>
                      <Badge className="bg-green-400 text-green-900">
                        {pesertaData.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
                  <div className="text-xs opacity-80">
                    Berlaku s/d {pesertaData.berlakuHingga}
                  </div>
                  <QrCode className="w-12 h-12 opacity-80" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">NIK:</span>
                  <span>{pesertaData.nik}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Lahir:</span>
                  <span>{pesertaData.tanggalLahir}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Faskes:</span>
                  <span>{pesertaData.faskes}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medical History Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Riwayat Kunjungan
              </CardTitle>
              <CardDescription>6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={medicalHistory}>
                  <defs>
                    <linearGradient
                      id="colorSpending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorSpending)"
                    name="Jumlah Kunjungan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Claims History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Riwayat Klaim</CardTitle>
                <CardDescription>History klaim kesehatan Anda</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimsHistory.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 bg-gray-50 rounded-lg border hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{claim.id}</Badge>
                        {getStatusBadge(claim.status)}
                        <Badge className="bg-blue-100 text-blue-700">
                          {claim.service}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Tanggal:</span>
                          <span>{claim.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Faskes:</span>
                          <span>{claim.faskes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Diagnosis:</span>
                          <span>{claim.diagnosis}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Dokter:</span>
                          <span>{claim.doctor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Total Klaim
                      </div>
                      <div className="text-xl text-blue-600">
                        {claim.amount}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              Resep Obat Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.map((prescription, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>{prescription.date}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {prescription.doctor}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resep
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine, midx) => (
                      <div
                        key={midx}
                        className="flex items-center justify-between p-3 bg-white rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Pill className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div>{medicine.name}</div>
                            <div className="text-sm text-gray-600">
                              {medicine.dosage} • {medicine.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {!aiChatOpen ? (
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            onClick={() => setAiChatOpen(true)}
          >
            <Brain className="w-6 h-6" />
          </Button>
        ) : (
          <Card className="w-96 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <CardTitle className="text-white">AI Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setAiChatOpen(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription className="text-green-100">
                Bantuan AI untuk informasi kesehatan & klaim
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tanya tentang klaim, antrean, atau kesehatan..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setChatInput("Status klaim terakhir saya?")}
                  >
                    Status klaim
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setChatInput("Berapa nomor antrean saya?")}
                  >
                    Cek antrean
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setChatInput("Riwayat berobat saya")}
                  >
                    Riwayat
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
