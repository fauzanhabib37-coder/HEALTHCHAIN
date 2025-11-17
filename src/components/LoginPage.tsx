import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Activity, Shield, Building2, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { authApi } from '../utils/api';
import { toast } from 'sonner';

type UserRole = 'admin-bpjs' | 'faskes' | 'peserta' | null;

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error('Pilih role terlebih dahulu');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        toast.success(`Login berhasil! Selamat datang, ${response.user.name}`);
        // Store user data
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('healthchain_user', JSON.stringify(response.user));
        }
        onLogin(response.user.role as UserRole);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials untuk quick access
  const demoAccounts = [
    { role: 'admin-bpjs' as UserRole, email: 'admin@bpjs.go.id', password: 'demo123', name: 'Admin BPJS' },
    { role: 'faskes' as UserRole, email: 'admin@rscipto.id', password: 'demo123', name: 'RS Cipto' },
    { role: 'peserta' as UserRole, email: 'peserta@email.com', password: 'demo123', name: 'Peserta JKN' },
  ];

  const fillDemoCredentials = (role: UserRole) => {
    const demo = demoAccounts.find(acc => acc.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
      setSelectedRole(role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl">HealthChain.AI</span>
              </div>
              <CardTitle>Masuk ke Akun Anda</CardTitle>
              <CardDescription>
                Pilih role dan masukkan kredensial untuk melanjutkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Pilih Role</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={selectedRole === 'admin-bpjs' ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col gap-1"
                      onClick={() => setSelectedRole('admin-bpjs')}
                    >
                      <Shield className="w-5 h-5" />
                      <span className="text-xs">Admin BPJS</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === 'faskes' ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col gap-1"
                      onClick={() => setSelectedRole('faskes')}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="text-xs">Faskes</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === 'peserta' ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col gap-1"
                      onClick={() => setSelectedRole('peserta')}
                    >
                      <Users className="w-5 h-5" />
                      <span className="text-xs">Peserta</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Ingat saya</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">
                    Lupa password?
                  </a>
                </div>

                <Button type="submit" className="w-full" disabled={!selectedRole || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Daftar sekarang
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Access Demo */}
          <div className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base">🚀 Demo Quick Access</CardTitle>
                <CardDescription>
                  Klik tombol di bawah untuk login dengan akun demo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.role}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4 bg-white"
                    onClick={() => fillDemoCredentials(account.role)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {account.role === 'admin-bpjs' && <Shield className="w-5 h-5 text-white" />}
                      {account.role === 'faskes' && <Building2 className="w-5 h-5 text-white" />}
                      {account.role === 'peserta' && <Users className="w-5 h-5 text-white" />}
                    </div>
                    <div className="text-left flex-1">
                      <div>{account.name}</div>
                      <div className="text-xs text-gray-600">{account.email}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">Demo</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">ℹ️ Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Admin BPJS:</strong> Akses dashboard nasional, fraud detection, monitoring faskes
                </p>
                <p>
                  <strong>Faskes/RS:</strong> Upload klaim, monitoring antrean IoT, validasi dokumen AI
                </p>
                <p>
                  <strong>Peserta JKN:</strong> Tracking klaim, kartu digital, riwayat medis, AI assistant
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl">🔒</div>
                  <div className="text-sm">
                    Platform ini dilindungi dengan enkripsi end-to-end, JWT authentication, dan TLS/HTTPS
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}