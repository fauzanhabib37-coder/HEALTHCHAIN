// Seed Demo Data for HealthChain.AI
// Run this to populate the database with demo users and data

import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function seedDemoUsers() {
  console.log('🌱 Seeding demo users...');

  const demoUsers = [
    {
      email: 'admin@bpjs.go.id',
      password: 'demo123',
      name: 'Admin BPJS Pusat',
      role: 'admin-bpjs',
      phoneNumber: '021-1500400',
      address: 'Jakarta Pusat'
    },
    {
      email: 'admin@rscipto.id',
      password: 'demo123',
      name: 'Admin RS Cipto Mangunkusumo',
      role: 'faskes',
      phoneNumber: '021-3149270',
      address: 'Jakarta Pusat',
      faskes: 'RS. Cipto Mangunkusumo'
    },
    {
      email: 'peserta@email.com',
      password: 'demo123',
      name: 'Ahmad Wijaya',
      role: 'peserta',
      phoneNumber: '081234567890',
      address: 'Jl. Sudirman No. 123, Jakarta',
      faskes: 'RS. Cipto Mangunkusumo'
    }
  ];

  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address,
          faskes: user.faskes
        },
        email_confirm: true
      });

      if (error) {
        console.log(`⚠️ User ${user.email} might already exist:`, error.message);
        continue;
      }

      console.log(`✅ Created user: ${user.email} (${user.role})`);

      // Store user profile
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        faskes: user.faskes,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      // Create peserta-specific data
      if (user.role === 'peserta') {
        await kv.set(`peserta:${data.user.id}`, {
          userId: data.user.id,
          nomorKartu: '0001234567890',
          nik: '3175010101850001',
          kelas: 'Kelas I',
          status: 'Aktif',
          berlakuHingga: '31 Desember 2025',
          faskesPrimer: user.faskes
        });
      }
    } catch (err) {
      console.error(`❌ Error creating user ${user.email}:`, err);
    }
  }
}

async function seedDemoClaims() {
  console.log('🌱 Seeding demo claims...');

  const claims = [
    {
      id: 'CLM-2024-1523',
      patientName: 'Ahmad Wijaya',
      service: 'Rawat Inap',
      diagnosis: 'Demam Berdarah Dengue',
      amount: 'Rp 4.500.000',
      status: 'approved',
      aiScore: 98,
      fraudRiskScore: 15,
      createdAt: '2024-11-10T08:00:00Z',
      updatedAt: '2024-11-10T10:30:00Z'
    },
    {
      id: 'CLM-2024-1524',
      patientName: 'Siti Nurhaliza',
      service: 'Rawat Jalan',
      diagnosis: 'Hipertensi',
      amount: 'Rp 850.000',
      status: 'processing',
      aiScore: 95,
      fraudRiskScore: 22,
      createdAt: '2024-11-12T09:15:00Z',
      updatedAt: '2024-11-12T09:15:00Z'
    },
    {
      id: 'CLM-2024-1525',
      patientName: 'Budi Santoso',
      service: 'IGD',
      diagnosis: 'Gastritis Akut',
      amount: 'Rp 2.300.000',
      status: 'pending_review',
      aiScore: 72,
      fraudRiskScore: 68,
      createdAt: '2024-11-13T14:20:00Z',
      updatedAt: '2024-11-13T14:20:00Z'
    }
  ];

  for (const claim of claims) {
    await kv.set(`claim:${claim.id}`, claim);
    console.log(`✅ Created claim: ${claim.id}`);
  }
}

async function seedDemoAlerts() {
  console.log('🌱 Seeding demo alerts...');

  const alerts = [
    {
      id: 'ALERT-001',
      type: 'fraud',
      severity: 'high',
      message: 'Potensi fraud terdeteksi di RS. Permata Medika',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 'ALERT-002',
      type: 'spike',
      severity: 'medium',
      message: 'Lonjakan klaim 45% di Jawa Barat',
      timestamp: new Date().toISOString(),
      read: false
    }
  ];

  for (const alert of alerts) {
    await kv.set(`alert:${alert.id}`, alert);
    console.log(`✅ Created alert: ${alert.id}`);
  }
}

async function main() {
  console.log('🚀 Starting HealthChain.AI Database Seeding...\n');
  
  await seedDemoUsers();
  await seedDemoClaims();
  await seedDemoAlerts();
  
  console.log('\n✨ Seeding completed successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('   Admin BPJS: admin@bpjs.go.id / demo123');
  console.log('   Faskes:     admin@rscipto.id / demo123');
  console.log('   Peserta:    peserta@email.com / demo123');
}

// Run seeding
main().catch(console.error);
