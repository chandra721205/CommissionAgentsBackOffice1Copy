# 🚀 TRADIE Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API server (optional for mock data)

---

## Installation

### 1. Clone/Download Project

```bash
# If using git
git clone <repository-url>
cd tradie-app

# Or extract downloaded files
cd tradie-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (optional)
nano .env  # or use your preferred editor
```

**Default `.env` (works out of the box):**
```bash
VITE_API_URL=/api
VITE_ENABLE_AI=true
VITE_ENABLE_SUPABASE=false
VITE_MODE=development
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## Quick Start

### Using Mock Data (No Backend Required)

The application includes mock data and works without a backend:

1. Start the dev server: `npm run dev`
2. Open browser: `http://localhost:5173`
3. Navigate through different modules from the welcome screen
4. All data is mocked in-memory

### With Backend API

If you have a backend API server:

1. **Update `.env`:**
   ```bash
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Start backend server** (in separate terminal):
   ```bash
   cd backend
   npm run dev
   ```

3. **Start frontend**:
   ```bash
   npm run dev
   ```

---

## Project Structure

```
tradie-app/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── agent/          # Commission agent components
│   ├── figma/          # Figma integration utilities
│   └── *.tsx           # Feature components
├── services/           # API and workflow services
│   ├── api.ts         # API service layer
│   └── workflows.ts   # Business logic workflows
├── types/             # TypeScript type definitions
│   └── database.ts    # Database schema types
├── config/            # Configuration
│   └── env.ts         # Environment config (browser-safe)
├── styles/            # Global styles
│   └── globals.css    # Tailwind + custom styles
├── App.tsx            # Main application component
└── .env               # Environment variables
```

---

## Available Modules

### From Welcome Screen:

1. **Buyer Back-Office** 🏢
   - Bill approvals and weighment processing
   - Payment tracking

2. **Commission Agent Dashboard** 👨‍💼
   - Producer management
   - Bill discounting
   - Transport tracking

3. **Buyer Prototype** 📱
   - Mobile-friendly buyer interface
   - Quick approval workflow

4. **CA Buyer Database** 📊
   - Buyer relationship management
   - AI-powered insights

5. **24-Screen Full App** 🎯
   - Complete TRADIE experience
   - All roles and workflows

6. **Expert Buyer Database** 🧠
   - Advanced buyer analytics
   - Grok AI integration

7. **TRADIE v4.0** ⚡
   - Latest comprehensive system
   - 7 complete workflows
   - 2FA + AI insights

8. **Transaction Audit** 📋
   - Detailed transaction view
   - Complete audit trail
   - Overdue management

---

## Development Workflows

### Run Development Server
```bash
npm run dev
```
- Hot reload enabled
- Runs on http://localhost:5173
- Source maps for debugging

### Build for Production
```bash
npm run build
```
- Optimized production build
- Output in `dist/` folder
- Tree-shaking and minification

### Preview Production Build
```bash
npm run preview
```
- Test production build locally
- Runs on http://localhost:4173

### Type Check
```bash
npm run type-check
# or
npx tsc --noEmit
```

### Lint Code
```bash
npm run lint
```

---

## Environment Variables Reference

### Required (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Backend API endpoint |
| `VITE_MODE` | `development` | Environment mode |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_ENABLE_AI` | `true` | Enable AI features |
| `VITE_ENABLE_SUPABASE` | `false` | Enable Supabase |
| `VITE_API_TIMEOUT` | `30000` | API timeout (ms) |
| `VITE_OTP_EXPIRY_MINUTES` | `5` | OTP validity |
| `VITE_OVERDUE_SEVERE_DAYS` | `7` | Severe overdue threshold |

See `.env.example` for complete list.

---

## Database Setup (Backend)

If running with a real backend:

### 1. Create Database

```bash
createdb tradie
```

### 2. Run Migrations

```sql
-- Run schema.sql from backend
psql -U postgres -d tradie < schema.sql
```

Or with Prisma:

```bash
npx prisma migrate dev --name init
```

### 3. Seed Data

```bash
npx prisma db seed
```

See `/BACKEND_INTEGRATION.md` for complete database documentation.

---

## Testing

### Manual Testing

1. **Start app**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Navigate to modules**:
   - Test Buyer Back-Office
   - Test Commission Agent Dashboard
   - Test Transaction Audit View
4. **Check console** for any errors

### Component Testing

```typescript
// Example: Test API service
import { api } from './services/api';

// Mock bill fetch
const bills = await api.getBills();
console.log(bills);
```

---

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

```bash
# Build and run
docker build -t tradie-app .
docker run -p 5173:5173 tradie-app
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3001
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

See `/TROUBLESHOOTING.md` for complete troubleshooting guide.

---

## Documentation

Comprehensive documentation available:

- **`/BACKEND_INTEGRATION.md`** - Complete SQL → Frontend integration
- **`/INTEGRATION_SUMMARY.md`** - Quick reference and examples
- **`/TRANSACTION_AUDIT_DOCUMENTATION.md`** - Transaction detail component
- **`/TRADIE_V4_DOCUMENTATION.md`** - v4.0 system documentation
- **`/TROUBLESHOOTING.md`** - Common issues and solutions

---

## Configuration Tips

### Development

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_MODE=development
VITE_ENABLE_AI=true
```

### Staging

```bash
# .env.staging
VITE_API_URL=https://staging-api.tradie.app
VITE_MODE=staging
VITE_ENABLE_AI=true
```

### Production

```bash
# .env.production
VITE_API_URL=https://api.tradie.app
VITE_MODE=production
VITE_ENABLE_AI=true
VITE_ENABLE_SUPABASE=true
```

---

## Next Steps

1. ✅ **Explore the application** - Navigate through different modules
2. ✅ **Review documentation** - Understand the architecture
3. ✅ **Set up backend** (optional) - Connect to real API
4. ✅ **Customize styling** - Modify `/styles/globals.css`
5. ✅ **Add features** - Extend components as needed
6. ✅ **Test workflows** - Try complete bill lifecycle
7. ✅ **Deploy** - Push to production

---

## Support

- **Documentation**: Check `/TROUBLESHOOTING.md`
- **Examples**: Review component files in `/components/`
- **API Reference**: See `/services/api.ts`
- **Workflows**: Check `/services/workflows.ts`

---

**Happy coding! 🚀**
