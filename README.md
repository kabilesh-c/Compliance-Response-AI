# Pharmacy Operations Platform - Phase 1

A modern, role-based pharmacy operations web application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features Implemented (Phase 1)

### ✅ Authentication & Authorization
- Landing page with navigation
- Login and signup pages with form validation
- Role-based access control (Admin, Manager, Pharmacist)
- Mock JWT authentication

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

### ✅ Layout & Design
- Fixed left sidebar with icon navigation
- Active state with yellow circular background
- Top bar with global search and notifications
- Pixel-perfect design matching specifications:
  - Cream background (#FAF9F6)
  - Yellow accents (#FFDE4D)
  - Soft rounded cards (16px border radius)
  - Dark cards for contrast
  - Gradient backgrounds for alerts
  - Consistent spacing and shadows

### ✅ Pages
- Landing page
- Login page
- Signup page with role selection
- Dashboard with full grid layout
- POS (Point of Sale)
- Inventory (placeholder)
- Analytics (placeholder)
- Settings (placeholder)

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)

**Backend (API skeleton ready):**
- Node.js
- Express
- TypeScript
- JWT authentication
- Bcrypt password hashing

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev:web
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔑 Test Credentials

```
Admin:
  Email: admin@pharmacy.com
  Password: admin123

Manager:
  Email: manager@pharmacy.com
  Password: manager123

Pharmacist:
  Email: pharmacist@pharmacy.com
  Password: pharmacist123
```

## 📁 Project Structure

```
Pharmacy-VS/
├── apps/
│   ├── web/               # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/         # Auth pages
│   │   │   │   ├── (dashboard)/    # Protected pages
│   │   │   │   └── api/            # API routes (mock)
│   │   │   ├── components/
│   │   │   │   ├── layout/         # Sidebar, TopBar
│   │   │   │   ├── dashboard/      # Dashboard cards
│   │   │   │   └── pos/            # POS components
│   │   │   └── styles/
│   │   └── package.json
│   └── api/               # Express API (ready for Phase 2)
│       ├── src/
│       └── package.json
├── design.md              # Design specifications
├── requirements.md        # Requirements document
├── tasks.md              # Implementation plan
└── package.json          # Root workspace config
```

## 🎨 Design System

**Colors:**
- Background: `#FAF9F6` (cream)
- Primary: `#FFDE4D` (yellow)
- Success: `#4ADE80` (green)
- Warning: `#FBBF24` (yellow)
- Danger: `#FF3D3D` (red)
- Expiring: `#FB923C` (orange)
- Dark Card: `#2A2D3A`

**Typography:**
- Font: Inter
- Clean, modern, readable

**Components:**
- Border Radius: 12-16px
- Shadows: Subtle (0 4px 12px rgba(0,0,0,0.05))
- Spacing: Consistent 4px/8px grid

## 🚧 Next Steps (Phase 2+)

- [ ] Connect to real PostgreSQL database
- [ ] Implement full API endpoints
- [ ] Add real-time inventory updates
- [ ] Implement search functionality
- [ ] Add inventory management features
- [ ] Build analytics and reporting
- [ ] Implement automation and AI features
- [ ] Add WhatsApp integration
- [ ] Hospital mode with OPD/IPD/OT workflows
- [ ] Role-based permissions management

## 📝 License

Private project for pharmacy operations management.
