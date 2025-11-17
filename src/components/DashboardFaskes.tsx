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
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { aiApi, claimsApi } from "../utils/api";
import { toast } from "sonner";
import {
  Activity,
  Building2,
  Users,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Brain,
  Bell,
  Search,
  LogOut,
  TrendingUp,
  Monitor,
  Wifi,
  Thermometer,
  Download,
  Eye,
  MessageSquare,
  FileCheck,
  Stethoscope,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardFaskesProps {
  onLogout: () => void;
}

// Mock Data
const queueData = [
  { time: "08:00", rawatJalan: 12, igd: 3, pendaftaran: 8 },
  { time: "09:00", rawatJalan: 18, igd: 5, pendaftaran: 12 },
  { time: "10:00", rawatJalan: 24, igd: 4, pendaftaran: 15 },
  { time: "11:00", rawatJalan: 20, igd: 6, pendaftaran: 10 },
  { time: "12:00", rawatJalan: 15, igd: 8, pendaftaran: 8 },
  { time: "13:00", rawatJalan: 22, igd: 7, pendaftaran: 14 },
];

const claimsData = [
  {
    id: "CLM-2024-1523",
    patient: "Ahmad Wijaya",
    service: "Rawat Inap",
    amount: "4.5 juta",
    status: "approved",
    date: "2024-11-10",
    aiScore: 98,
  },
  {
    id: "CLM-2024-1524",
    patient: "Siti Nurhaliza",
    service: "Rawat Jalan",
    amount: "850 ribu",
    status: "processing",
    date: "2024-11-12",
    aiScore: 95,
  },
  {
    id: "CLM-2024-1525",
    patient: "Budi Santoso",
    service: "IGD",
    amount: "2.3 juta",
    status: "pending_review",
    date: "2024-11-13",
    aiScore: 72,
  },
  {
    id: "CLM-2024-1526",
    patient: "Dewi Lestari",
    service: "Rawat Inap",
    amount: "6.2 juta",
    status: "rejected",
    date: "2024-11-13",
    aiScore: 45,
  },
  {
    id: "CLM-2024-1527",
    patient: "Eko Prasetyo",
    service: "Rawat Jalan",
    amount: "650 ribu",
    status: "approved",
    date: "2024-11-14",
    aiScore: 96,
  },
];

const medicalDevices = [
  {
    id: "DEV-001",
    name: "Ventilator ICU-A1",
    status: "active",
    usage: 85,
    temperature: 24.5,
    lastMaintenance: "2024-10-15",
  },
  {
    id: "DEV-002",
    name: "MRI Scanner",
    status: "active",
    usage: 62,
    temperature: 23.8,
    lastMaintenance: "2024-10-20",
  },
  {
    id: "DEV-003",
    name: "X-Ray Machine",
    status: "maintenance",
    usage: 0,
    temperature: 22.1,
    lastMaintenance: "2024-11-10",
  },
  {
    id: "DEV-004",
    name: "CT Scan Unit",
    status: "active",
    usage: 78,
    temperature: 24.2,
    lastMaintenance: "2024-10-25",
  },
  {
    id: "DEV-005",
    name: "Ultrasound Device",
    status: "offline",
    usage: 0,
    temperature: 21.5,
    lastMaintenance: "2024-11-01",
  },
];

const iotSensors = [
  {
    location: "Ruang Tunggu Poliklinik",
    occupancy: 78,
    temperature: 25.2,
    humidity: 65,
    status: "online",
  },
  {
    location: "IGD - Triage Area",
    occupancy: 45,
    temperature: 24.8,
    humidity: 62,
    status: "online",
  },
  {
    location: "Ruang Rawat Inap Lt.3",
    occupancy: 92,
    temperature: 23.5,
    humidity: 58,
    status: "online",
  },
  {
    location: "Pendaftaran Lantai 1",
    occupancy: 34,
    temperature: 25.8,
    humidity: 70,
    status: "warning",
  },
];

export default function DashboardFaskes({ onLogout }: DashboardFaskesProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [validationResult, setValidationResult] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // After upload completes, call AI validation API
          (async () => {
            try {
              setValidationResult(null);
              const res = await aiApi.validateDocument(
                file.name,
                file.type || "application/octet-stream",
                file.size
              );
              if (res && (res as any).validation) {
                setValidationResult((res as any).validation);
              } else {
                toast.error("Validasi dokumen gagal: respons tidak sesuai");
              }
            } catch (err: any) {
              console.error("AI validation error:", err);
              toast.error(err?.message || "Validasi dokumen gagal (server)");
            }
          })();
        }
      }, 200);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Disetujui</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700">Diproses</Badge>;
      case "pending_review":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            Menunggu Review
          </Badge>
        );
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">HealthChain.AI</div>
                  <div>RS. Cipto Mangunkusumo</div>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                <Building2 className="w-3 h-3 mr-1" />
                Faskes
              </Badge>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="hidden md:block">
                  <Input
                    placeholder="Cari klaim atau pasien..."
                    className="pl-9 w-80"
                  />
                </div>
              </div>

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
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    RC
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div>Admin RS Cipto</div>
                  <div className="text-xs text-gray-600">admin@rscipto.id</div>
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
                  <p className="text-sm text-gray-600">Antrean Saat Ini</p>
                  <div className="text-3xl mt-2">127</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pasien menunggu
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Klaim Bulan Ini</p>
                  <div className="text-3xl mt-2">1,245</div>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Approval: 94.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Perangkat Aktif</p>
                  <div className="text-3xl mt-2">47/52</div>
                  <div className="text-sm text-gray-600 mt-1">IoT Devices</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. AI Score</p>
                  <div className="text-3xl mt-2">92.8</div>
                  <div className="text-sm text-green-600 mt-1">
                    Validasi Dokumen
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IoT Real-time Queue Monitoring */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle>Real-time IoT Queue Monitoring</CardTitle>
                  <CardDescription>
                    Live data dari IoT sensors & gateway
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={queueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rawatJalan"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Rawat Jalan"
                  />
                  <Line
                    type="monotone"
                    dataKey="igd"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="IGD"
                  />
                  <Line
                    type="monotone"
                    dataKey="pendaftaran"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Pendaftaran"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {iotSensors.map((sensor, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm">{sensor.location}</div>
                    {sensor.status === "online" ? (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Warning
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Occupancy</span>
                      <span>{sensor.occupancy}%</span>
                    </div>
                    <Progress value={sensor.occupancy} className="h-1" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-600" />
                        <span>{sensor.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-600" />
                        <span>{sensor.humidity}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload & AI Validation */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <div>
                  <CardTitle>AI Document Validator</CardTitle>
                  <CardDescription>
                    Upload berkas klaim untuk validasi otomatis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <div className="mb-2">Drag & drop atau klik untuk upload</div>
                  <div className="text-sm text-gray-600">
                    PDF, JPG, PNG (Max 10MB)
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div className="flex-1">
                      <div>{selectedFile.name}</div>
                      <div className="text-sm text-gray-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <Progress value={uploadProgress} className="mb-2" />
                  <div className="text-sm text-gray-600 mb-4">
                    {uploadProgress < 100
                      ? `Uploading... ${uploadProgress}%`
                      : "Upload complete!"}
                  </div>

                  {uploadProgress === 100 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">AI Validation Score</span>
                          <Badge
                            className={`${
                              validationResult?.validationScore >= 85
                                ? "bg-green-100 text-green-700"
                                : validationResult?.validationScore >= 70
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {validationResult?.status || "-"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={validationResult?.validationScore || 0}
                            className="flex-1"
                          />
                          <span
                            className={`text-2xl ${
                              validationResult?.validationScore >= 85
                                ? "text-green-600"
                                : validationResult?.validationScore >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {validationResult?.validationScore ?? "-"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          {validationResult?.validations?.icdCode ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span>
                            ICD-10 Code:{" "}
                            {validationResult?.validations?.icdCode
                              ? "Valid"
                              : "Perlu cek"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationResult?.validations?.resumeMedis ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span>
                            Resume Medis:{" "}
                            {validationResult?.validations?.resumeMedis
                              ? "Lengkap"
                              : "Kurang"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationResult?.validations?.signature ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span>
                            Tanda Tangan:{" "}
                            {validationResult?.validations?.signature
                              ? "Tervalidasi"
                              : "Perlu verifikasi"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationResult?.validations?.tanggal ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span>
                            Tanggal:{" "}
                            {validationResult?.validations?.tanggal
                              ? "OK"
                              : "Perlu konfirmasi"}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={async () => {
                          try {
                            const extracted =
                              validationResult?.extractedData || {};
                            const payload = {
                              patientName: extracted.patientName || "Unknown",
                              service: extracted.service || "Rawat Inap",
                              diagnosis:
                                extracted.diagnosis || extracted.icdCode || "-",
                              amount: extracted.estimatedAmount || "0",
                              documents: [selectedFile?.name || "uploaded_doc"],
                            };
                            const res = await claimsApi.create(payload as any);
                            if (res && (res as any).success) {
                              toast.success("Klaim berhasil dibuat (mock)");
                              setValidationResult(null);
                              setSelectedFile(null);
                              setUploadProgress(0);
                            } else {
                              toast.error(
                                "Gagal membuat klaim: respons tidak sesuai"
                              );
                            }
                          } catch (err: any) {
                            console.error("Create claim error:", err);
                            toast.error(
                              err?.message || "Gagal membuat klaim (server)"
                            );
                          }
                        }}
                      >
                        <FileCheck className="w-4 h-4 mr-2" />
                        Submit Klaim
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="mb-1">AI Validator akan otomatis:</div>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Extract data dari PDF</li>
                      <li>Validasi ICD-10 codes</li>
                      <li>Verifikasi resume medis</li>
                      <li>Deteksi potensi fraud</li>
                      <li>Calculate risk score</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Devices IoT */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle>Medical Devices Monitoring</CardTitle>
                    <CardDescription>
                      Status perangkat medis real-time
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicalDevices.map((device) => (
                  <div
                    key={device.id}
                    className="p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Monitor className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{device.name}</span>
                        </div>
                        <div className="text-xs text-gray-600">{device.id}</div>
                      </div>
                      {device.status === "active" ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          Active
                        </Badge>
                      ) : device.status === "maintenance" ? (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                          Maintenance
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          Offline
                        </Badge>
                      )}
                    </div>

                    {device.status === "active" && (
                      <>
                        <div className="text-xs text-gray-600 mb-1">
                          Usage: {device.usage}%
                        </div>
                        <Progress value={device.usage} className="h-1 mb-2" />
                      </>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        <span>{device.temperature}°C</span>
                      </div>
                      <div>Last: {device.lastMaintenance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claims Status Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Status Klaim Terbaru</CardTitle>
                <CardDescription>
                  Tracking status klaim dengan AI validation
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Baru
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimsData.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 bg-gray-50 rounded-lg border hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{claim.id}</Badge>
                        {getStatusBadge(claim.status)}
                      </div>
                      <div className="mt-2">{claim.patient}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {claim.service} • {claim.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">AI Score</div>
                      <div
                        className={`text-2xl ${
                          claim.aiScore >= 90
                            ? "text-green-600"
                            : claim.aiScore >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {claim.aiScore}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Amount display removed per request */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      {claim.status === "pending_review" && (
                        <Button size="sm">
                          <Brain className="w-4 h-4 mr-2" />
                          AI Insight
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Floating */}
      {aiChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="w-96 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
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
              <CardDescription className="text-purple-100">
                Bantuan AI untuk klaim & operasional
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-80 overflow-y-auto mb-4 space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm">
                    Halo! Ada yang bisa saya bantu terkait klaim atau
                    operasional RS hari ini?
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Tanya sesuatu..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!aiChatOpen && (
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 z-50"
          onClick={() => setAiChatOpen(true)}
        >
          <Brain className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
