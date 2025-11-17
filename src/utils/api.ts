import { projectId, publicAnonKey } from "./supabase/info";

// Allow overriding API base URL via Vite env var `VITE_API_BASE_URL` for local backend testing.
const defaultBase = `https://${projectId}.supabase.co/functions/v1/make-server-c613b596`;
const API_BASE_URL =
  (typeof window !== "undefined" && (window as any).__API_BASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  defaultBase;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Store auth token
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("healthchain_token", token);
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  if (typeof localStorage !== "undefined") {
    authToken = localStorage.getItem("healthchain_token");
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("healthchain_token");
  }
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`API Error at ${endpoint}:`, data);
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// ============================================
// AUTHENTICATION API
// ============================================

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: "admin-bpjs" | "faskes" | "peserta";
  phoneNumber?: string;
  address?: string;
  faskes?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  profile?: any;
}

export const authApi = {
  signup: async (data: SignupData) => {
    return apiCall<{ success: boolean; user: UserData; message: string }>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  login: async (data: LoginData) => {
    // Try real API first, but provide a local demo fallback when backend is unavailable
    try {
      const response = await apiCall<{
        success: boolean;
        access_token: string;
        user: UserData;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.success && (response as any).access_token) {
        setAuthToken((response as any).access_token);
      }

      return response;
    } catch (err) {
      // Fallback demo accounts (client-side) when API is down or for local demo
      const demoAccounts: Array<{
        email: string;
        password: string;
        role: string;
        name: string;
        id: string;
      }> = [
        {
          email: "admin@bpjs.go.id",
          password: "demo123",
          role: "admin-bpjs",
          name: "Admin BPJS",
          id: "demo-admin",
        },
        {
          email: "admin@rscipto.id",
          password: "demo123",
          role: "faskes",
          name: "RS Cipto",
          id: "demo-faskes",
        },
        {
          email: "peserta@email.com",
          password: "demo123",
          role: "peserta",
          name: "Peserta JKN",
          id: "demo-peserta",
        },
      ];

      const matched = demoAccounts.find(
        (acc) => acc.email === data.email && acc.password === data.password
      );
      if (matched) {
        const fakeToken = `demo-token-${matched.id}`;
        setAuthToken(fakeToken);
        return {
          success: true,
          access_token: fakeToken,
          user: {
            id: matched.id,
            email: matched.email,
            name: matched.name,
            role: matched.role,
          },
        } as any;
      }

      throw err;
    }
  },

  logout: () => {
    clearAuthToken();
  },
};

// ============================================
// CLAIMS API
// ============================================

export interface CreateClaimData {
  patientName: string;
  service: string;
  diagnosis: string;
  amount: string;
  documents?: string[];
  faskesId?: string;
}

export interface Claim {
  id: string;
  patientName: string;
  service: string;
  diagnosis: string;
  amount: string;
  status: string;
  aiScore: number;
  fraudRiskScore: number;
  createdAt: string;
  updatedAt: string;
}

export const claimsApi = {
  create: async (data: CreateClaimData) => {
    return apiCall<{ success: boolean; claim: Claim; message: string }>(
      "/claims/create",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  getById: async (claimId: string) => {
    return apiCall<{ success: boolean; claim: Claim }>(`/claims/${claimId}`);
  },

  getByUser: async (userId: string) => {
    return apiCall<{ success: boolean; claims: Claim[] }>(
      `/claims/user/${userId}`
    );
  },

  getAll: async () => {
    return apiCall<{ success: boolean; claims: Claim[]; total: number }>(
      "/claims"
    );
  },

  updateStatus: async (claimId: string, status: string, notes?: string) => {
    return apiCall<{ success: boolean; claim: Claim }>(
      `/claims/${claimId}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status, notes }),
      }
    );
  },
};

// ============================================
// AI VALIDATION API
// ============================================

export interface DocumentValidation {
  fileName: string;
  fileType: string;
  fileSize: number;
  validationScore: number;
  status: string;
  validations: {
    icdCode: boolean;
    resumeMedis: boolean;
    signature: boolean;
    tanggal: boolean;
  };
  extractedData: any;
  timestamp: string;
}

export interface FraudAnalysis {
  claimId: string;
  fraudScore: number;
  riskLevel: string;
  riskFactors: string[];
  recommendation: string;
  aiExplanation: string;
  timestamp: string;
}

export const aiApi = {
  validateDocument: async (
    fileName: string,
    fileType: string,
    fileSize: number
  ) => {
    return apiCall<{ success: boolean; validation: DocumentValidation }>(
      "/ai/validate-document",
      {
        method: "POST",
        body: JSON.stringify({ fileName, fileType, fileSize }),
      }
    );
  },

  detectFraud: async (claimId: string) => {
    return apiCall<{ success: boolean; fraudAnalysis: FraudAnalysis }>(
      "/ai/detect-fraud",
      {
        method: "POST",
        body: JSON.stringify({ claimId }),
      }
    );
  },
};

// ============================================
// IOT MONITORING API
// ============================================

export interface QueueData {
  faskesId: string;
  queues: {
    rawatJalan: number;
    igd: number;
    pendaftaran: number;
  };
  sensors: Array<{
    location: string;
    occupancy: number;
    temperature: number;
    humidity: number;
    status: string;
  }>;
  lastUpdate: string;
}

export interface MedicalDevice {
  id: string;
  name: string;
  status: string;
  usage: number;
  temperature: number;
  lastMaintenance: string;
}

export const iotApi = {
  getQueueData: async (faskesId: string) => {
    return apiCall<{ success: boolean; queueData: QueueData }>(
      `/iot/queue/${faskesId}`
    );
  },

  getDevices: async (faskesId: string) => {
    return apiCall<{ success: boolean; devices: MedicalDevice[] }>(
      `/iot/devices/${faskesId}`
    );
  },

  updateQueue: async (faskesId: string, queueType: string, count: number) => {
    return apiCall<{ success: boolean; queueData: QueueData }>(
      "/iot/update-queue",
      {
        method: "POST",
        body: JSON.stringify({ faskesId, queueType, count }),
      }
    );
  },
};

// ============================================
// ALERTS API
// ============================================

export interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  claimId?: string;
  faskesId?: string;
  timestamp: string;
  read: boolean;
}

export const alertsApi = {
  getAll: async () => {
    return apiCall<{ success: boolean; alerts: Alert[] }>("/alerts");
  },

  create: async (alertData: Partial<Alert>) => {
    return apiCall<{ success: boolean; alert: Alert }>("/alerts/create", {
      method: "POST",
      body: JSON.stringify(alertData),
    });
  },
};

// ============================================
// ANALYTICS API
// ============================================

export interface Analytics {
  totalClaims?: number;
  approvedClaims?: number;
  pendingClaims?: number;
  rejectedClaims?: number;
  fraudDetected?: number;
  totalAmount?: number;
  avgProcessingTime?: number;
  approvalRate?: string | number;
  avgAiScore?: string | number;
  currentQueue?: number;
}

export const analyticsApi = {
  getDashboard: async (role: "admin-bpjs" | "faskes" | "peserta") => {
    return apiCall<{ success: boolean; analytics: Analytics }>(
      `/analytics/dashboard/${role}`
    );
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  return apiCall<{
    status: string;
    service: string;
    timestamp: string;
    version: string;
  }>("/health");
};
