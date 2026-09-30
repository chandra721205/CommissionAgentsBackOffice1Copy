# 🌾 TRADIE - Commodity Trading Platform

**Complete back-office system for agricultural commodity trading with blockchain integration, AI-powered insights, and expert auditor workflows.**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```

That's it! The app works with mock data out of the box. No backend required for initial exploration.

---

## ✨ Features

### 🏢 **Complete Workflows**
- ✅ Weighment completion & authorization
- ✅ Bill creation with 2FA approval
- ✅ Buyer database with AI insights
- ✅ Payment tracking & overdue management
- ✅ Complete audit trail
- ✅ Change request with justification
- ✅ Multi-role access control
- ✨ **NEW: Beautiful Producer Ledger** (PostgreSQL + kid-friendly design)
  - **Expert Database**: 8 tables + 5 views with running balance & OTP
  - **Kid-Friendly UI**: Colorful icons 🎨, friendly AI robot 🤖, traffic lights 🚦
  - **Complete Lifecycle**: Credits, debits, expenses, sales tracking
  - **AI-Powered**: Risk scoring, pattern detection, friendly insights
- ✅ **Producer Ledger** (Expert accounting: 18 fields, 6 transactions)
- ✅ **Credit/Debit Book** (Child-friendly double-entry system)
- ✅ **Staff Management** (Internal operations, 11 fields, multi-role support)

### 🧠 **AI-Powered**
- ✅ Buyer reliability scoring (0-100%)
- ✅ Pattern detection for fraud prevention
- ✅ Behavioral analysis & warnings
- ✅ Automated due date suggestions
- ✅ Risk flagging & recommendations

### 🔐 **Security & Compliance**
- ✅ 2FA/OTP verification (SMS/Email/WhatsApp)
- ✅ Immutable ledger entries (blockchain-ready)
- ✅ Complete audit trail logging
- ✅ Role-based access control (5 roles + 5-tier RBAC for Producer Ledger)
- ✅ Change request justification tracking
- ✅ Chronological audit sequencing (append-only records)
- ✅ Multi-level access permissions (AgentOnly/MarketOnly/AgentAndAdmin/etc.)

### 🌍 **Multi-Country Support**
- ✅ 12 payment methods (UPI/NEFT/Wire/Crypto)
- ✅ Country-specific payment options
- ✅ Multi-currency support
- ✅ Regulatory compliance (India APMC Act, APEDA)

### 📱 **Responsive Design**
- ✅ Mobile-first UI (360×800)
- ✅ Desktop optimized (1440×1024)
- ✅ Tablet support
- ✅ Dark mode support

---

## 📦 What's Included

### 10 Complete Modules

1. **🏢 Buyer Back-Office** - Bill approvals, weighment processing
2. **👨‍💼 Commission Agent Dashboard** - Producer management, bill discounting
3. **📱 Buyer Prototype** - Mobile-friendly buyer interface
4. **📊 CA Buyer Database** - Buyer relationship management
5. **🎯 24-Screen Full App** - Complete TRADIE experience
6. **🧠 Expert Buyer Database** - Advanced analytics with Grok AI
7. **⚡ TRADIE v4.0** - Latest comprehensive system (7 workflows)
8. **📋 Transaction Audit** - Detailed view with complete audit trail
9. **🌾 Producer Ledger** - Expert-level accounting (18 fields, producers as customers, 5-tier RBAC, AI alerts)
10. **💰 Credit/Debit Book** - Child-friendly double-entry system with Grok AI helper
11. **👥 Staff Management** - Internal role & permission assignments (separate from customer data)

---

## 🗄️ Database Schema

Complete SQL/Prisma schema with 18 tables:

**Identity & Organization:**
- `users`, `companies`, `buyer_entities`, `buyer_contacts`, `buyer_payment_prefs`

**Trade Artifacts:**
- `lots`, `weighments`, `bills`, `bill_items`, `bill_change_requests`
- `bill_authorizations`, `otp_codes`, `ledger_entries`, `payments`

**AI & Audit:**
- `ai_buyer_scores`, `ai_agent_scores`, `audit_log`, `country_payment_methods`

See `/BACKEND_INTEGRATION.md` for complete documentation.

---

## 🔧 Architecture

```
Frontend (React + TypeScript)
    ↓
API Service Layer (/services/api.ts)
    ↓
Workflow Implementations (/services/workflows.ts)
    ↓
Backend API (SQL/Prisma)
    ↓
PostgreSQL Database
```

**Key Features:**
- Complete type safety with TypeScript
- Browser-safe configuration (`/config/env.ts`)
- 30+ API methods covering all operations
- 8+ workflow functions for business logic
- Comprehensive error handling

---

## 📚 Documentation

### Getting Started
- **`/SETUP.md`** - Installation and setup guide
- **`/TROUBLESHOOTING.md`** - Common issues and solutions
- **`/FIX_SUMMARY.md`** - Recent bug fixes

### Architecture & Integration
- **`/BACKEND_INTEGRATION.md`** - Complete SQL → Frontend mapping
- **`/INTEGRATION_SUMMARY.md`** - Quick reference with examples
- **`/SYSTEM_ARCHITECTURE_DIAGRAM.md`** - Visual system architecture
- **`/TRADIE_V4_DOCUMENTATION.md`** - v4.0 system documentation
- **`/TRANSACTION_AUDIT_DOCUMENTATION.md`** - Transaction detail component

### Accounting & Ledger Systems
- **`/PRODUCER_LEDGER_DOCUMENTATION.md`** - Expert-level accounting (1000+ lines)
- **`/PRODUCER_LEDGER_QUICK_REFERENCE.md`** - Quick reference card
- **`/ACCOUNTING_SYSTEMS_OVERVIEW.md`** - Comparison of both systems
- **`/DOCUMENTATION_INDEX.md`** - Complete documentation index

### Workflow Documentation
- **`/BUYER_WORKFLOW_DOCUMENTATION.md`** - Buyer workflows
- **`/TRADIE_FULL_APP_DOCUMENTATION.md`** - Full app documentation

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS v4.0
- Shadcn/ui components
- Lucide icons
- Recharts (analytics)
- Motion/React (animations)

**Backend (Optional):**
- Node.js + Express
- PostgreSQL + Prisma
- Twilio (SMS OTP)
- SendGrid (Email OTP)
- Supabase (optional)

---

## ⚙️ Configuration

### Environment Variables

```bash
# .env file (Vite requires VITE_ prefix)
VITE_API_URL=/api
VITE_ENABLE_AI=true
VITE_ENABLE_SUPABASE=false
VITE_MODE=development
```

See `.env.example` for complete list of variables.

### Browser-Safe Config

```typescript
import config from './config/env';

console.log(config.apiUrl);        // '/api'
console.log(config.enableAI);      // true
console.log(config.apiTimeout);    // 30000
```

No `process.env` errors! ✅

---

## 🔄 Complete Workflow Example

```typescript
import { completeBillLifecycle } from './services/workflows';

// Execute complete bill workflow with one function call
const result = await completeBillLifecycle({
  lot_id: BigInt(123),
  buyer_entity_id: BigInt(456),
  buyer_user_id: BigInt(789),
  agent_user_id: BigInt(101),
  price_per_unit: 22.00,
  quantity_units: 50,
  packaging_cost: 50,
  due_date_type: 'REGULATION',
  buyer_otp: '123456',
  agent_otp: '654321'
});

// Steps executed automatically:
// 1. ✅ Bill created (PENDING_BUYER)
// 2. ✅ Buyer approved via 2FA (PENDING_AGENT)
// 3. ✅ Agent approved via 2FA (AUTHORIZED)
// 4. ✅ Ledger entry frozen (immutable)
// 5. ✅ AI scores refreshed
```

---

## 🎯 Key Highlights

### Detailed Transaction View
- 📋 Large card layout with expandable sections
- 💰 Complete pricing breakdown with calculation helpers
- 💳 12 payment methods with icons
- ⏰ Auto-calculated days overdue
- 🚨 Flashing warnings for severe overdue (≥7 days)
- 📨 Send reminders (SMS/Email/WhatsApp)
- 🧠 AI behavioral insights
- 📜 Complete audit trail

### AI Insights
- 📊 Reliability score (0-100%)
- ⚖️ Discrepancy ratio tracking
- ⏱️ Average settlement time
- ✅ On-time payment percentage
- ⚠️ Pattern detection warnings
- 📈 Historical trend analysis

### Security Features
- 🔐 2FA/OTP verification (6-digit codes)
- 🔒 Immutable ledger entries
- 📝 Mandatory change justifications
- 👥 Role-based access control
- 📋 Complete audit trail
- 🚫 Deletion prevention for authorized bills

---

## 📊 SQL Workflow Examples

### Workflow 1: Create Bill
```sql
INSERT INTO bills (lot_id, buyer_entity_id, price_per_unit, ...)
VALUES ($1, $2, $3, ...)
RETURNING id;
```

### Workflow 2: Change Request
```sql
INSERT INTO bill_change_requests (bill_id, field_name, justification, ...)
VALUES ($billId, 'price_per_unit', 'Grade lower', ...);

UPDATE bills SET status='MODIFIED_NEEDS_JUSTIFICATION' WHERE id=$billId;
```

### Workflow 3: Buyer Approval
```sql
INSERT INTO bill_authorizations (bill_id, by_role, otp_last4, ...)
VALUES ($billId, 'BUYER', $last4, ...);

UPDATE bills SET status='PENDING_AGENT' WHERE id=$billId;
```

### Workflow 4: Agent Approval & Freeze
```sql
UPDATE bills SET status='AUTHORIZED' WHERE id=$billId;

INSERT INTO ledger_entries (bill_id, snapshot_json)
SELECT id, to_jsonb(bills.*) FROM bills WHERE id=$billId;
```

### Workflow 5: AI Score Refresh
```sql
INSERT INTO ai_buyer_scores (buyer_entity_id, reliability_score, ...)
VALUES ($buyerId, $score, ...);
```

---

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t tradie-app .
docker run -p 5173:5173 tradie-app
```

See `/SETUP.md` for detailed deployment instructions.

---

## 🐛 Troubleshooting

### Common Issues

**`process is not defined` Error:**
✅ Fixed! App now uses browser-safe configuration.

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**Port already in use:**
```bash
npx kill-port 5173
npm run dev
```

See `/TROUBLESHOOTING.md` for complete guide.

---

## 📖 Project Structure

```
tradie-app/
├── components/              # React components
│   ├── ui/                 # Shadcn components
│   ├── agent/              # Agent-specific
│   └── *.tsx               # Feature components
├── services/               # Business logic
│   ├── api.ts             # API service (30+ methods)
│   └── workflows.ts       # Workflows (8+ functions)
├── types/                  # TypeScript types
│   └── database.ts        # Complete schema types
├── config/                 # Configuration
│   └── env.ts             # Browser-safe config
├── styles/                 # Global styles
├── App.tsx                 # Main app component
├── .env                    # Environment variables
└── *.md                    # Documentation
```

---

## 🎓 Learning Resources

### For Developers
1. Start with `/SETUP.md` - Get up and running
2. Read `/BACKEND_INTEGRATION.md` - Understand architecture
3. Review `/services/api.ts` - See API methods
4. Check `/services/workflows.ts` - Study business logic
5. Explore `/components/` - Learn component structure

### For Business Users
1. `/TRADIE_V4_DOCUMENTATION.md` - Feature overview
2. `/TRANSACTION_AUDIT_DOCUMENTATION.md` - Transaction management
3. `/BUYER_WORKFLOW_DOCUMENTATION.md` - Buyer processes

---

## 🤝 Contributing

This is a production-ready prototype. To extend:

1. **Add new workflows** - Update `/services/workflows.ts`
2. **Add new API methods** - Update `/services/api.ts`
3. **Add new components** - Create in `/components/`
4. **Add new types** - Update `/types/database.ts`
5. **Update docs** - Keep documentation in sync

---

## 📝 License

Proprietary - TRADIE Commodity Trading Platform

---

## 🎯 Status

✅ **Production Ready**
- Complete type safety
- Browser-safe configuration
- Comprehensive documentation
- 8 fully functional modules
- 30+ API methods
- 8+ workflow implementations
- Complete SQL schema integration
- AI-powered insights
- 2FA security
- Audit trail tracking

---

## 📞 Support

- **Documentation**: Check `/TROUBLESHOOTING.md`
- **Setup Help**: See `/SETUP.md`
- **API Reference**: Review `/services/api.ts`
- **Examples**: Explore `/components/`

---

**Built with precision for enterprise-grade commodity trading workflows.** 🌾✨

Version: **4.0.0** | Last Updated: **October 2024**
