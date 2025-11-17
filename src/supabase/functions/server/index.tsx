import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Supabase client
const getSupabaseClient = (serviceRole = false) => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    serviceRole 
      ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      : Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
};

// Auth Middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth error:', error);
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }

  c.set('user', user);
  c.set('userId', user.id);
  await next();
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

app.post('/make-server-c613b596/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, phoneNumber, address, faskes } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields: email, password, name, role' }, 400);
    }

    const supabase = getSupabaseClient(true); // Use service role

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role, // admin-bpjs, faskes, peserta
        phoneNumber,
        address,
        faskes
      },
      // Automatically confirm email since email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    // Store additional user data in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role,
      phoneNumber,
      address,
      faskes,
      createdAt: new Date().toISOString(),
      status: 'active'
    });

    // Generate user-specific data based on role
    if (role === 'peserta') {
      const nomorKartu = generateKartuNumber();
      await kv.set(`peserta:${userId}`, {
        userId,
        nomorKartu,
        nik: generateNIK(),
        kelas: 'Kelas I',
        status: 'Aktif',
        berlakuHingga: '31 Desember 2025',
        faskesPrimer: faskes || 'RS. Cipto Mangunkusumo'
      });
    }

    return c.json({ 
      success: true, 
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        name,
        role
      }
    });
  } catch (error) {
    console.log('Error in signup:', error);
    return c.json({ error: `Signup error: ${error.message}` }, 500);
  }
});

app.post('/make-server-c613b596/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: `Login failed: ${error.message}` }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      success: true,
      access_token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role,
        name: data.user.user_metadata.name,
        profile: userProfile
      }
    });
  } catch (error) {
    console.log('Error in login:', error);
    return c.json({ error: `Login error: ${error.message}` }, 500);
  }
});

// ============================================
// CLAIMS MANAGEMENT ROUTES
// ============================================

app.post('/make-server-c613b596/claims/create', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const { patientName, service, diagnosis, amount, documents, faskesId } = body;

    const claimId = `CLM-${new Date().getFullYear()}-${generateRandomId()}`;
    
    // AI validation score (simulated)
    const aiScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const fraudRiskScore = Math.floor(Math.random() * 100);

    const claim = {
      id: claimId,
      patientName,
      service,
      diagnosis,
      amount,
      faskesId: faskesId || userId,
      status: aiScore >= 90 ? 'approved' : aiScore >= 70 ? 'processing' : 'pending_review',
      aiScore,
      fraudRiskScore,
      documents: documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    };

    await kv.set(`claim:${claimId}`, claim);
    
    // Add to user's claims list
    const userClaimsKey = `claims:user:${userId}`;
    const userClaims = await kv.get(userClaimsKey) || [];
    userClaims.push(claimId);
    await kv.set(userClaimsKey, userClaims);

    // If fraud risk is high, create alert
    if (fraudRiskScore >= 80) {
      await createAlert({
        type: 'fraud',
        severity: 'high',
        message: `High fraud risk detected: ${claimId} - Risk Score: ${fraudRiskScore}`,
        claimId,
        faskesId: faskesId || userId
      });
    }

    return c.json({ 
      success: true, 
      claim,
      message: 'Claim created successfully'
    });
  } catch (error) {
    console.log('Error creating claim:', error);
    return c.json({ error: `Failed to create claim: ${error.message}` }, 500);
  }
});

app.get('/make-server-c613b596/claims/:claimId', requireAuth, async (c) => {
  try {
    const claimId = c.req.param('claimId');
    const claim = await kv.get(`claim:${claimId}`);

    if (!claim) {
      return c.json({ error: 'Claim not found' }, 404);
    }

    return c.json({ success: true, claim });
  } catch (error) {
    console.log('Error fetching claim:', error);
    return c.json({ error: `Failed to fetch claim: ${error.message}` }, 500);
  }
});

app.get('/make-server-c613b596/claims/user/:userId', requireAuth, async (c) => {
  try {
    const targetUserId = c.req.param('userId');
    const currentUserId = c.get('userId');
    
    // Allow access to own claims or if admin-bpjs
    const currentUser = await kv.get(`user:${currentUserId}`);
    if (currentUserId !== targetUserId && currentUser?.role !== 'admin-bpjs') {
      return c.json({ error: 'Unauthorized access' }, 403);
    }

    const claimIds = await kv.get(`claims:user:${targetUserId}`) || [];
    const claims = [];
    
    for (const claimId of claimIds) {
      const claim = await kv.get(`claim:${claimId}`);
      if (claim) claims.push(claim);
    }

    return c.json({ success: true, claims });
  } catch (error) {
    console.log('Error fetching user claims:', error);
    return c.json({ error: `Failed to fetch claims: ${error.message}` }, 500);
  }
});

app.get('/make-server-c613b596/claims', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (user?.role !== 'admin-bpjs') {
      return c.json({ error: 'Unauthorized: Admin access required' }, 403);
    }

    // Get all claims (using prefix search)
    const allClaims = await kv.getByPrefix('claim:CLM-');
    
    return c.json({ 
      success: true, 
      claims: allClaims,
      total: allClaims.length 
    });
  } catch (error) {
    console.log('Error fetching all claims:', error);
    return c.json({ error: `Failed to fetch claims: ${error.message}` }, 500);
  }
});

app.put('/make-server-c613b596/claims/:claimId/status', requireAuth, async (c) => {
  try {
    const claimId = c.req.param('claimId');
    const body = await c.req.json();
    const { status, notes } = body;

    const claim = await kv.get(`claim:${claimId}`);
    if (!claim) {
      return c.json({ error: 'Claim not found' }, 404);
    }

    claim.status = status;
    claim.notes = notes;
    claim.updatedAt = new Date().toISOString();

    await kv.set(`claim:${claimId}`, claim);

    return c.json({ success: true, claim });
  } catch (error) {
    console.log('Error updating claim status:', error);
    return c.json({ error: `Failed to update claim: ${error.message}` }, 500);
  }
});

// ============================================
// AI DOCUMENT VALIDATION ROUTES
// ============================================

app.post('/make-server-c613b596/ai/validate-document', requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { fileName, fileType, fileSize } = body;

    // Simulate AI document validation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const validationScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const validations = {
      icdCode: Math.random() > 0.1,
      resumeMedis: Math.random() > 0.15,
      signature: Math.random() > 0.05,
      tanggal: Math.random() > 0.2
    };

    const result = {
      fileName,
      fileType,
      fileSize,
      validationScore,
      status: validationScore >= 85 ? 'excellent' : validationScore >= 70 ? 'good' : 'needs_review',
      validations,
      extractedData: {
        patientName: 'Ahmad Wijaya',
        diagnosis: 'Demam Berdarah Dengue',
        icdCode: 'A91',
        doctorName: 'dr. Siti Nurhaliza, Sp.PD',
        date: new Date().toISOString().split('T')[0]
      },
      timestamp: new Date().toISOString()
    };

    return c.json({ success: true, validation: result });
  } catch (error) {
    console.log('Error validating document:', error);
    return c.json({ error: `Validation failed: ${error.message}` }, 500);
  }
});

app.post('/make-server-c613b596/ai/detect-fraud', requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { claimId } = body;

    const claim = await kv.get(`claim:${claimId}`);
    if (!claim) {
      return c.json({ error: 'Claim not found' }, 404);
    }

    // Simulate AI fraud detection
    const fraudScore = Math.floor(Math.random() * 100);
    const riskFactors = [];

    if (fraudScore > 80) {
      riskFactors.push('Duplicate claim pattern detected');
      riskFactors.push('Unusual billing amount for diagnosis');
    } else if (fraudScore > 60) {
      riskFactors.push('Moderate risk pattern identified');
    }

    const fraudAnalysis = {
      claimId,
      fraudScore,
      riskLevel: fraudScore >= 80 ? 'high' : fraudScore >= 60 ? 'medium' : 'low',
      riskFactors,
      recommendation: fraudScore >= 80 
        ? 'Immediate investigation required' 
        : fraudScore >= 60 
        ? 'Manual review recommended' 
        : 'Low risk - proceed normally',
      aiExplanation: `Based on pattern analysis of ${fraudScore >= 80 ? '15' : '8'} key indicators including billing patterns, diagnosis codes, and historical data.`,
      timestamp: new Date().toISOString()
    };

    return c.json({ success: true, fraudAnalysis });
  } catch (error) {
    console.log('Error in fraud detection:', error);
    return c.json({ error: `Fraud detection failed: ${error.message}` }, 500);
  }
});

// ============================================
// IOT MONITORING ROUTES
// ============================================

app.get('/make-server-c613b596/iot/queue/:faskesId', requireAuth, async (c) => {
  try {
    const faskesId = c.req.param('faskesId');
    
    // Get or create real-time queue data
    let queueData = await kv.get(`iot:queue:${faskesId}`);
    
    if (!queueData) {
      queueData = {
        faskesId,
        queues: {
          rawatJalan: Math.floor(Math.random() * 30) + 10,
          igd: Math.floor(Math.random() * 10) + 2,
          pendaftaran: Math.floor(Math.random() * 20) + 5
        },
        sensors: generateSensorData(),
        lastUpdate: new Date().toISOString()
      };
      await kv.set(`iot:queue:${faskesId}`, queueData);
    }

    return c.json({ success: true, queueData });
  } catch (error) {
    console.log('Error fetching queue data:', error);
    return c.json({ error: `Failed to fetch queue data: ${error.message}` }, 500);
  }
});

app.get('/make-server-c613b596/iot/devices/:faskesId', requireAuth, async (c) => {
  try {
    const faskesId = c.req.param('faskesId');
    
    let devices = await kv.get(`iot:devices:${faskesId}`);
    
    if (!devices) {
      devices = generateMedicalDevices();
      await kv.set(`iot:devices:${faskesId}`, devices);
    }

    return c.json({ success: true, devices });
  } catch (error) {
    console.log('Error fetching devices:', error);
    return c.json({ error: `Failed to fetch devices: ${error.message}` }, 500);
  }
});

app.post('/make-server-c613b596/iot/update-queue', requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { faskesId, queueType, count } = body;

    const queueKey = `iot:queue:${faskesId}`;
    let queueData = await kv.get(queueKey) || { faskesId, queues: {} };
    
    queueData.queues[queueType] = count;
    queueData.lastUpdate = new Date().toISOString();
    
    await kv.set(queueKey, queueData);

    return c.json({ success: true, queueData });
  } catch (error) {
    console.log('Error updating queue:', error);
    return c.json({ error: `Failed to update queue: ${error.message}` }, 500);
  }
});

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================

app.get('/make-server-c613b596/alerts', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    let alerts = [];
    
    if (user?.role === 'admin-bpjs') {
      // Get all alerts for admin
      alerts = await kv.getByPrefix('alert:');
    } else {
      // Get user-specific alerts
      const userAlertIds = await kv.get(`alerts:user:${userId}`) || [];
      for (const alertId of userAlertIds) {
        const alert = await kv.get(`alert:${alertId}`);
        if (alert) alerts.push(alert);
      }
    }

    // Sort by timestamp, newest first
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return c.json({ success: true, alerts });
  } catch (error) {
    console.log('Error fetching alerts:', error);
    return c.json({ error: `Failed to fetch alerts: ${error.message}` }, 500);
  }
});

app.post('/make-server-c613b596/alerts/create', requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const alert = await createAlert(body);
    return c.json({ success: true, alert });
  } catch (error) {
    console.log('Error creating alert:', error);
    return c.json({ error: `Failed to create alert: ${error.message}` }, 500);
  }
});

// ============================================
// ANALYTICS & STATISTICS
// ============================================

app.get('/make-server-c613b596/analytics/dashboard/:role', requireAuth, async (c) => {
  try {
    const role = c.req.param('role');
    const userId = c.get('userId');
    
    let analytics = {};

    if (role === 'admin-bpjs') {
      const allClaims = await kv.getByPrefix('claim:CLM-');
      
      analytics = {
        totalClaims: allClaims.length,
        approvedClaims: allClaims.filter(c => c.status === 'approved').length,
        pendingClaims: allClaims.filter(c => c.status === 'processing').length,
        rejectedClaims: allClaims.filter(c => c.status === 'rejected').length,
        fraudDetected: allClaims.filter(c => c.fraudRiskScore >= 80).length,
        totalAmount: allClaims.reduce((sum, c) => sum + (parseFloat(c.amount?.replace(/[^\d]/g, '')) || 0), 0),
        avgProcessingTime: 2.4,
        approvalRate: allClaims.length > 0 
          ? ((allClaims.filter(c => c.status === 'approved').length / allClaims.length) * 100).toFixed(1)
          : 0
      };
    } else if (role === 'faskes') {
      const userClaims = await kv.get(`claims:user:${userId}`) || [];
      const claims = [];
      for (const claimId of userClaims) {
        const claim = await kv.get(`claim:${claimId}`);
        if (claim) claims.push(claim);
      }
      
      analytics = {
        totalClaims: claims.length,
        approvedClaims: claims.filter(c => c.status === 'approved').length,
        avgAiScore: claims.length > 0
          ? (claims.reduce((sum, c) => sum + c.aiScore, 0) / claims.length).toFixed(1)
          : 0,
        currentQueue: Math.floor(Math.random() * 150) + 50
      };
    }

    return c.json({ success: true, analytics });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: `Failed to fetch analytics: ${error.message}` }, 500);
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateRandomId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateKartuNumber() {
  return '0001' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

function generateNIK() {
  return '3175' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
}

function generateSensorData() {
  return [
    {
      location: 'Ruang Tunggu Poliklinik',
      occupancy: Math.floor(Math.random() * 50) + 30,
      temperature: 24 + Math.random() * 3,
      humidity: 55 + Math.random() * 20,
      status: 'online'
    },
    {
      location: 'IGD - Triage Area',
      occupancy: Math.floor(Math.random() * 40) + 20,
      temperature: 23 + Math.random() * 3,
      humidity: 55 + Math.random() * 20,
      status: 'online'
    }
  ];
}

function generateMedicalDevices() {
  return [
    {
      id: 'DEV-001',
      name: 'Ventilator ICU-A1',
      status: 'active',
      usage: Math.floor(Math.random() * 30) + 60,
      temperature: 23 + Math.random() * 2,
      lastMaintenance: '2024-10-15'
    },
    {
      id: 'DEV-002',
      name: 'MRI Scanner',
      status: 'active',
      usage: Math.floor(Math.random() * 40) + 40,
      temperature: 23 + Math.random() * 2,
      lastMaintenance: '2024-10-20'
    }
  ];
}

async function createAlert(alertData: any) {
  const alertId = `ALERT-${Date.now()}-${generateRandomId()}`;
  const alert = {
    id: alertId,
    type: alertData.type,
    severity: alertData.severity,
    message: alertData.message,
    claimId: alertData.claimId,
    faskesId: alertData.faskesId,
    timestamp: new Date().toISOString(),
    read: false
  };

  await kv.set(`alert:${alertId}`, alert);
  return alert;
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/make-server-c613b596/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    service: 'HealthChain.AI API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/make-server-c613b596/', (c) => {
  return c.json({ 
    message: 'HealthChain.AI API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/auth/signup, /auth/login',
      claims: '/claims, /claims/:id, /claims/user/:userId',
      ai: '/ai/validate-document, /ai/detect-fraud',
      iot: '/iot/queue/:faskesId, /iot/devices/:faskesId',
      alerts: '/alerts',
      analytics: '/analytics/dashboard/:role'
    }
  });
});

Deno.serve(app.fetch);
