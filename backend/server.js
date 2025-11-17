const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory store for demo users
const users = new Map();
users.set("admin@bpjs.go.id", {
  id: "demo-admin",
  email: "admin@bpjs.go.id",
  password: "demo123",
  name: "Admin BPJS",
  role: "admin-bpjs",
});
users.set("admin@rscipto.id", {
  id: "demo-faskes",
  email: "admin@rscipto.id",
  password: "demo123",
  name: "RS Cipto",
  role: "faskes",
});
users.set("peserta@email.com", {
  id: "demo-peserta",
  email: "peserta@email.com",
  password: "demo123",
  name: "Peserta JKN",
  role: "peserta",
});

app.get("/make-server-c613b596/", (req, res) => {
  res.json({ message: "Local HealthChain.AI Mock API", version: "local-1.0" });
});

app.post("/make-server-c613b596/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = users.get(email);
  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });

  return res.json({
    success: true,
    access_token: `local-token-${user.id}`,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

app.post("/make-server-c613b596/auth/signup", (req, res) => {
  const { email, password, name, role } = req.body || {};
  if (!email || !password || !name || !role)
    return res.status(400).json({ error: "Missing required fields" });
  if (users.has(email))
    return res.status(409).json({ error: "User already exists" });

  const id = `local-${Date.now()}`;
  users.set(email, { id, email, password, name, role });
  return res.json({
    success: true,
    message: "User created",
    user: { id, email, name, role },
  });
});

app.get("/make-server-c613b596/health", (req, res) => {
  res.json({ status: "healthy", service: "HealthChain.AI Local Mock" });
});

// AI document validation (mock)
app.post("/make-server-c613b596/ai/validate-document", (req, res) => {
  const { fileName, fileType, fileSize } = req.body || {};
  if (!fileName || !fileType || !fileSize)
    return res.status(400).json({ error: "Missing file metadata" });

  // Simulate processing delay
  setTimeout(() => {
    const validationScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const validations = {
      icdCode: Math.random() > 0.1,
      resumeMedis: Math.random() > 0.15,
      signature: Math.random() > 0.05,
      tanggal: Math.random() > 0.2,
    };

    const result = {
      fileName,
      fileType,
      fileSize,
      validationScore,
      status:
        validationScore >= 85
          ? "excellent"
          : validationScore >= 70
          ? "good"
          : "needs_review",
      validations,
      extractedData: {
        patientName: "Demo Patient",
        diagnosis: "Contoh Diagnosis",
        icdCode: "A00",
        doctorName: "dr. Demo",
        date: new Date().toISOString().split("T")[0],
      },
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, validation: result });
  }, 800);
});

// Create claim (mock) - accepts simple JSON and returns created claim
app.post("/make-server-c613b596/claims/create", (req, res) => {
  const { patientName, service, diagnosis, amount, documents } = req.body || {};
  if (!patientName || !service || !diagnosis || !amount)
    return res.status(400).json({ error: "Missing required claim fields" });

  const claimId = `CLM-${Date.now()}`;
  const aiScore = Math.floor(Math.random() * 30) + 70;
  const fraudRiskScore = Math.floor(Math.random() * 100);

  const claim = {
    id: claimId,
    patientName,
    service,
    diagnosis,
    amount,
    documents: documents || [],
    status:
      aiScore >= 90
        ? "approved"
        : aiScore >= 70
        ? "processing"
        : "pending_review",
    aiScore,
    fraudRiskScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return res.json({ success: true, claim, message: "Claim created (mock)" });
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(
    `Local backend mock listening at http://localhost:${port}/make-server-c613b596/`
  )
);
