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
// Tabs imports removed (tidy): not used in this component
import {
  Activity,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Map,
  Brain,
  Bell,
  Search,
  Filter,
  Download,
  LogOut,
  MessageSquare,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";

interface DashboardBPJSProps {
  onLogout: () => void;
}

// Mock Data
const claimsTrendData = [
  { month: "Jan", total: 45000, approved: 42000, rejected: 3000, fraud: 450 },
  { month: "Feb", total: 52000, approved: 48000, rejected: 4000, fraud: 520 },
  { month: "Mar", total: 48000, approved: 45000, rejected: 3000, fraud: 480 },
  { month: "Apr", total: 61000, approved: 57000, rejected: 4000, fraud: 610 },
  { month: "May", total: 55000, approved: 52000, rejected: 3000, fraud: 550 },
  { month: "Jun", total: 67000, approved: 63000, rejected: 4000, fraud: 670 },
];

const provinceData = [
  { province: "DKI Jakarta", klaim: 45200, fraud: 892, riskScore: 85 },
  { province: "Jawa Barat", klaim: 38500, fraud: 654, riskScore: 72 },
  { province: "Jawa Timur", klaim: 41300, fraud: 721, riskScore: 78 },
  { province: "Jawa Tengah", klaim: 35800, fraud: 589, riskScore: 68 },
  { province: "Sumatera Utara", klaim: 28900, fraud: 445, riskScore: 65 },
];

const topFraudCases = [
  {
    id: "FR-2024-001",
    faskes: "RS. Permata Medika",
    amount: "245.5 juta",
    riskScore: 95,
    type: "Duplicate Claims",
    status: "investigating",
  },
  {
    id: "FR-2024-002",
    faskes: "Klinik Sehat Sentosa",
    amount: "128.3 juta",
    riskScore: 89,
    type: "Upcoding",
    status: "investigating",
  },
  {
    id: "FR-2024-003",
    faskes: "RS. Budi Asih",
    amount: "95.7 juta",
    riskScore: 82,
    type: "Phantom Billing",
    status: "confirmed",
  },
  {
    id: "FR-2024-004",
    faskes: "Klinik Wijaya",
    amount: "67.2 juta",
    riskScore: 78,
    type: "Unbundling",
    status: "reviewing",
  },
];

const faskesPerformance = [
  {
    name: "RS. Cipto Mangunkusumo",
    claims: 12500,
    approvalRate: 96,
    avgProcessTime: 2.1,
    fraudRate: 0.8,
  },
  {
    name: "RS. Hasan Sadikin",
    claims: 11200,
    approvalRate: 94,
    avgProcessTime: 2.5,
    fraudRate: 1.2,
  },
  {
    name: "RS. Sanglah",
    claims: 10800,
    approvalRate: 95,
    avgProcessTime: 2.3,
    fraudRate: 0.9,
  },
  {
    name: "RS. Dr. Soetomo",
    claims: 9500,
    approvalRate: 93,
    avgProcessTime: 2.8,
    fraudRate: 1.5,
  },
];

const realtimeAlerts = [
  {
    id: 1,
    type: "fraud",
    message: "Potensi fraud terdeteksi di RS. Permata Medika",
    time: "2 menit lalu",
    severity: "high",
  },
  {
    id: 2,
    type: "spike",
    message: "Lonjakan klaim 45% di Jawa Barat",
    time: "15 menit lalu",
    severity: "medium",
  },
  {
    id: 3,
    type: "system",
    message: "IoT Gateway RS. Sanglah offline",
    time: "23 menit lalu",
    severity: "medium",
  },
  {
    id: 4,
    type: "success",
    message: "1,250 klaim berhasil diproses",
    time: "1 jam lalu",
    severity: "low",
  },
];

export default function DashboardBPJS({ onLogout }: DashboardBPJSProps) {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Halo Admin! Saya AI Assistant HealthChain. Ada yang bisa saya bantu analisis hari ini?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Berdasarkan analisis data, terkait "${chatInput}": Saya menemukan bahwa ada peningkatan 15% pada kategori tersebut dalam 30 hari terakhir. Rekomendasi: Lakukan audit mendalam pada 5 faskes dengan volume tertinggi.`,
        },
      ]);
    }, 1000);

    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">HealthChain.AI</div>
                  <div>Dashboard Admin BPJS</div>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="hidden md:block">
                  <Input
                    placeholder="Cari klaim, faskes, atau peserta..."
                    className="pl-9 w-80"
                  />
                </div>
              </div>
              {/* compact search icon for small screens */}
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Search className="w-4 h-4 text-gray-600" />
                </Button>
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    AB
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div>Admin BPJS</div>
                  <div className="text-xs text-gray-600">admin@bpjs.go.id</div>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Total Klaim (Bulan Ini)
                  </p>
                  <div className="text-3xl mt-2">67,234</div>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Klaim Disetujui</p>
                  <div className="text-3xl mt-2">63,891</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Approval Rate: 95.0%
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
                  <p className="text-sm text-gray-600">Fraud Terdeteksi</p>
                  <div className="text-3xl mt-2">892</div>
                  {/* Finance display removed per request */}
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Processing Time</p>
                  <div className="text-3xl mt-2">2.4h</div>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>-18% faster</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Alerts */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <CardTitle>Real-time Alert System</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realtimeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === "high"
                        ? "bg-red-500"
                        : alert.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {alert.type === "fraud" && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      {alert.type === "spike" && (
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                      )}
                      {alert.type === "system" && (
                        <Activity className="w-4 h-4 text-blue-600" />
                      )}
                      {alert.type === "success" && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <div className="text-xs text-gray-600">{alert.time}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Detail
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tren Klaim Nasional (6 Bulan Terakhir)</CardTitle>
              <CardDescription>
                Analisis volume klaim dan approval rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={claimsTrendData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorApproved"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Total Klaim"
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorApproved)"
                    name="Disetujui"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Analytics</CardTitle>
              <CardDescription>
                Trend deteksi fraud dan pencegahan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={claimsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="fraud"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Fraud Terdeteksi"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Ditolak"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span>Fraud prevention progress</span>
                </div>
                <Progress value={73} className="h-2" />
                <div className="text-xs text-gray-600 mt-1">
                  73% dari target deteksi fraud tahun ini
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fraud Detection Panel */}
        <Card className="border-2 border-red-200 bg-red-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <CardTitle className="text-red-900">
                    AI Fraud Detection Panel
                  </CardTitle>
                  <CardDescription>
                    Kasus fraud dengan risk score tinggi yang memerlukan
                    investigasi
                  </CardDescription>
                </div>
              </div>
              <Button variant="destructive" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topFraudCases.map((fraud) => (
                <div
                  key={fraud.id}
                  className="bg-white p-4 rounded-lg border border-red-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive">{fraud.id}</Badge>
                        <Badge className="bg-orange-100 text-orange-700">
                          {fraud.type}
                        </Badge>
                      </div>
                      <div className="mt-1">{fraud.faskes}</div>
                      {/* Nominal removed from UI */}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">
                        Risk Score
                      </div>
                      <div className="text-2xl text-red-600">
                        {fraud.riskScore}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={fraud.riskScore} className="flex-1 h-2" />
                    <Badge
                      variant={
                        fraud.status === "investigating"
                          ? "default"
                          : fraud.status === "confirmed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {fraud.status}
                    </Badge>
                    <Button size="sm">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Explanation
                    </Button>
                    <Button size="sm" variant="outline">
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Province Heatmap & Faskes Performance */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Risk Heatmap by Province
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {provinceData.map((province) => (
                  <div key={province.province} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{province.province}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                          {province.klaim.toLocaleString()} klaim
                        </span>
                        <Badge
                          variant={
                            province.riskScore >= 80
                              ? "destructive"
                              : province.riskScore >= 70
                              ? "default"
                              : "secondary"
                          }
                        >
                          Risk: {province.riskScore}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={province.riskScore} className="h-2" />
                    <div className="text-xs text-red-600">
                      {province.fraud} fraud cases
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Top Faskes Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faskesPerformance.map((faskes, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>{faskes.name}</div>
                      <Badge>{faskes.claims.toLocaleString()} klaim</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-600">Approval Rate</div>
                        <div className="text-green-600">
                          {faskes.approvalRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Process</div>
                        <div className="text-blue-600">
                          {faskes.avgProcessTime}h
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Fraud Rate</div>
                        <div className="text-red-600">{faskes.fraudRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!aiChatOpen ? (
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setAiChatOpen(true)}
          >
            <Brain className="w-6 h-6" />
          </Button>
        ) : (
          <Card className="w-96 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
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
              <CardDescription className="text-blue-100">
                Powered by LLM - Tanya apa saja tentang data klaim
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
                    placeholder="Tanyakan tentang klaim, fraud, atau trend..."
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
                    onClick={() => setChatInput("Analisis fraud bulan ini")}
                  >
                    Analisis fraud
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setChatInput("Top faskes bermasalah")}
                  >
                    Top faskes
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setChatInput("Prediksi klaim bulan depan")}
                  >
                    Prediksi
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
