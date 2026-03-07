# PharmaOS - Intelligent Pharmacy Operations Platform

A comprehensive, AI-powered pharmacy management system built with Next.js, TypeScript, Express, and FastAPI. PharmaOS combines modern pharmacy operations with intelligent automation, predictive analytics, and an AI-powered Compliance Response system.

---

## 🏥 What is PharmaOS?

**PharmaOS** is an enterprise-grade pharmacy operations platform designed to streamline every aspect of pharmacy management—from inventory control and prescription processing to compliance documentation and vendor assessments.

### Core Capabilities:
- **Intelligent Inventory Management** — Real-time stock tracking, automated reorder alerts, expiry monitoring
- **Point of Sale (POS)** — Fast, intuitive billing with support for OPD, IPD, and OT workflows
- **Prescription Processing** — Digital prescription management with pharmacist verification workflows
- **Predictive Analytics** — ML-powered demand forecasting, inventory optimization, and expiry prediction
- **Role-Based Access Control** — Granular permissions for Admin, Manager, and Pharmacist roles
- **Audit & Compliance Logging** — Complete audit trails for regulatory compliance

---

## 🤖 Compliance Response AI

### What We're Building Now

The **Compliance Response AI** is an intelligent questionnaire assistant that leverages Retrieval-Augmented Generation (RAG) to automatically answer vendor assessment questionnaires, compliance audits, and security reviews.

### How It Works:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Vendor        │     │   RAG Pipeline   │     │   Generated     │
│   Questionnaire │ ──▶ │   + Knowledge    │ ──▶ │   Response      │
│                 │     │   Base           │     │   Document      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Key Features:

1. **Knowledge Base Integration**
   - 10+ comprehensive policy documents covering security, compliance, architecture, and operations
   - Semantic search for relevant context retrieval
   - Vector embeddings for accurate information matching

2. **Intelligent Answer Generation**
   - Context-aware responses using Google Gemini API
   - Citations and references from source documents
   - Confidence scoring for generated answers

3. **Questionnaire Support**
   - Basic vendor evaluations (8 questions)
   - Security & operations assessments (12 questions)
   - Enterprise vendor questionnaires (15 questions)
   - Compliance & audit reviews (10 questions)
   - Comprehensive evaluations (18+ questions)

4. **Smart Response Handling**
   - Returns "Not found in references" when information isn't available
   - Provides source document references for transparency
   - Exports responses in multiple formats (PDF, Word, Excel)

### Knowledge Base Coverage:

| Document | Topics Covered |
|----------|----------------|
| Platform Overview | System capabilities, user roles, core features |
| System Architecture | Infrastructure, tech stack, deployment |
| Security Policy | Encryption, authentication, access control |
| Privacy Policy | HIPAA compliance, data handling, consent |
| Compliance & Audit | Logging, retention, regulatory requirements |
| Disaster Recovery | RTO/RPO, backup procedures, failover |
| External Integrations | APIs, third-party systems, connectivity |
| Analytics & Reporting | BI capabilities, dashboards, exports |

---

## 🚀 Features Implemented

### ✅ Authentication & Authorization
- Landing page with navigation
- Login and signup pages with form validation
- Role-based access control (Admin, Manager, Pharmacist)
- JWT authentication with secure session management
- One-click demo mode for testing

### ✅ Dashboard
- Medicine inventory overview with circular visualization
- Active salesman/staff display
- Prescriptions summary with completion rate
- Recent orders with type filters (ALL, OPD, IPD, OT)
- Stock alerts (low stock, zero stock)
- Expired medicines list
- Expiring soon medicines with month filters
- Financial metrics cards (invoices, paid, discount, dues, refund)

### ✅ Point of Sale (POS)
- Active orders bar with patient avatars and order types
- Medicine card grid with selection
- Add medicine functionality
- Billing panel with cart management
- Quantity controls (+/-)
- Discount calculation
- Payment method selection (Cash, Card, Code)
- Real-time total calculations

### ✅ ML Services
- Demand forecasting with stacking models
- Inventory optimization recommendations
- Expiry prediction and alerts
- RESTful prediction APIs

### ✅ Layout & Design
- Fixed left sidebar with icon navigation
- Active state with yellow circular background
- Top bar with global search and notifications
- Pixel-perfect design with modern aesthetics

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15.1.0 (App Router with Turbopack)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)

**Backend API:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Bcrypt password hashing

**ML Services:**
- Python 3.11+ with FastAPI
- Scikit-learn (ML models)
- Sentence Transformers (embeddings)
- ChromaDB / FAISS (vector store)
- Google Gemini API (LLM)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run all services (web + API + ML)
npm run dev

# Or run individually
npm run dev:web    # Frontend on http://localhost:3000
npm run dev:api    # API on http://localhost:3001
npm run dev:ml     # ML service on http://localhost:8000
```

## 🔑 Demo Mode

One-click login available for testing:

| Role | Access Level |
|------|--------------|
| **Admin** | Full system access, user management, settings |
| **Manager** | Inventory, analytics, staff management |
| **Pharmacist** | POS, prescriptions, basic inventory |

## 📁 Project Structure

```
PharmaOS/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Auth pages (login, signup)
│   │   │   │   ├── (dashboard)/# Protected pages
│   │   │   │   └── api/        # API routes
│   │   │   ├── components/
│   │   │   │   ├── layout/     # Sidebar, TopBar
│   │   │   │   ├── dashboard/  # Dashboard cards
│   │   │   │   └── pos/        # POS components
│   │   │   └── styles/
│   │   └── package.json
│   ├── api/                    # Express backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   └── ml/                     # FastAPI ML service
│       ├── app/
│       │   ├── api/            # Prediction endpoints
│       │   └── services/       # ML logic
│       ├── knowledge_base/     # RAG documents (10+ policies)
│       ├── questionnaires/     # Vendor assessment templates
│       ├── models/             # Pre-trained ML models
│       └── requirements.txt
├── design.md                   # Design specifications
├── requirements.md             # Requirements document
└── package.json                # Root workspace config
```

## 🎨 Design System

| Property | Value |
|----------|-------|
| Background | `#FAF9F6` (cream) |
| Primary | `#FFDE4D` (yellow) |
| Success | `#4ADE80` (green) |
| Warning | `#FBBF24` (amber) |
| Danger | `#FF3D3D` (red) |
| Dark Card | `#2A2D3A` |
| Border Radius | 12-16px |
| Font | Inter |

## 🚧 Roadmap

- [x] Core pharmacy operations (POS, inventory, dashboard)
- [x] ML prediction services (demand, expiry, optimization)
- [x] Knowledge base for Compliance Response AI
- [ ] RAG pipeline integration with Gemini API
- [ ] Questionnaire upload and parsing
- [ ] Automated response generation UI
- [ ] Response export (PDF, Word, Excel)
- [ ] WhatsApp integration for notifications
- [ ] Hospital mode with OPD/IPD/OT workflows

## 👥 Team

**Kabilesh C** — Developer  
📧 kabileshc.dev@gmail.com

## 📝 License

Private project for pharmacy operations and compliance automation.
