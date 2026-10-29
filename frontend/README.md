# SupplyShield (ChainGuard)
Secure Supply Chain Monitoring & Tamper-Detection System

## 🚀 Project Overview
SupplyShield is a full-stack cloud application built for secure supply chain tracking. It uses SHA-256 cryptographic hashing, role-based access control (RBAC), and secure 4-digit PIN authentication to ensure tamper-proof logistics monitoring and audit logging.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Python, FastAPI, Supabase, PostgreSQL
- **Security:** SHA-256 Cryptographic Hashing, Role-Based Access Control

---

## 🔑 Login & Testing Credentials (For Evaluators)

### 1. Admin Login
- **Name:** Siya Sarate (Admin)
- **Master PIN:** `1234`
- **Access:** Full administrative controls, employee management, and audit logs.

### 2. Employee / Manager / Scanner Login
- Created dynamically by the Admin from the dashboard.
- Generates a secure **4-digit PIN** stored securely in browser storage (`localStorage`).

---

## ⚙️ How to Run the Project Locally

### Step 1: Run the Backend (FastAPI)
Open a terminal in the backend folder and run:
\`\`\`bash
cd backend
uvicorn main:app --reload
\`\`\`
*(Backend will start at: \`http://localhost:8000\`)*

### Step 2: Run the Frontend (React)
Open a separate terminal in the frontend folder and run:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(Frontend will start at: \`http://localhost:5173\`)*