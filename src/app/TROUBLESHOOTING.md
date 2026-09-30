# 🔧 TRADIE Troubleshooting Guide

## Common Issues and Solutions

---

## 1. `process is not defined` Error

**Error Message:**
```
ReferenceError: process is not defined
```

**Cause:** 
Trying to access `process.env` in browser/client-side code. Node.js `process` object is not available in browsers.

**Solution:**
✅ **FIXED** - The application now uses `import.meta.env` for Vite compatibility and falls back to safe defaults.

**How it works:**
```typescript
// ❌ Old (breaks in browser)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ New (browser-safe)
import config from './config/env';
const API_URL = config.apiUrl; // Uses import.meta.env or defaults
```

**Environment Variables:**
- Copy `.env.example` to `.env`
- All variables must be prefixed with `VITE_` for Vite
- Example: `VITE_API_URL=/api`

---

## 2. TypeScript Errors with BigInt

**Error Message:**
```
Type 'number' is not assignable to type 'bigint'
```

**Solution:**
Always use `BigInt()` constructor for database IDs:

```typescript
// ❌ Wrong
const billId = 123;

// ✅ Correct
const billId = BigInt(123);

// Converting from string
const billId = BigInt('123');
```

---

## 3. Import Path Issues

**Error Message:**
```
Cannot find module '../types/database'
```

**Solution:**
Ensure you're using the correct relative paths:

```typescript
// From /components/
import { Bill } from '../types/database';

// From /services/
import { Bill } from '../types/database';

// From /config/
import { Bill } from '../types/database';
```

---

## 4. API Fetch Errors

**Error Message:**
```
Failed to fetch
```

**Possible Causes:**
1. **Backend not running** - Start your API server
2. **CORS issues** - Configure CORS on backend
3. **Wrong API URL** - Check `VITE_API_URL` in `.env`

**Solution:**

1. **Check environment variable:**
```bash
# .env file
VITE_API_URL=http://localhost:3000/api
```

2. **Verify API server is running:**
```bash
# Check if API is responding
curl http://localhost:3000/api/health
```

3. **Enable CORS on backend:**
```typescript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

---

## 5. Component Not Rendering

**Issue:** Component shows blank screen or doesn't load

**Solutions:**

1. **Check console for errors:**
```bash
# Open browser DevTools (F12)
# Check Console tab for errors
```

2. **Verify imports:**
```typescript
// Make sure all imports are correct
import { Button } from './ui/button'; // ✅
import { Button } from '../ui/button'; // ❌ Wrong path
```

3. **Check component props:**
```typescript
// Component expects bigint
<DetailedTransactionAuditView billId={BigInt(123)} />

// Not number
<DetailedTransactionAuditView billId={123} /> // ❌
```

---

## 6. Supabase Connection Issues

**Error Message:**
```
Supabase client not initialized
```

**Solution:**

1. **Check if Supabase is enabled:**
```bash
# .env
VITE_ENABLE_SUPABASE=true
```

2. **Add Supabase credentials:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. **Initialize Supabase client:**
```typescript
import { createClient } from '@supabase/supabase-js';
import config from './config/env';

const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);
```

---

## 7. OTP Verification Failing

**Issue:** OTP codes not working or timing out

**Debugging Steps:**

1. **Check OTP expiry:**
```typescript
// config/env.ts
otpExpiryMinutes: 5, // OTP valid for 5 minutes
```

2. **Verify OTP code:**
```typescript
// Must be exactly 6 digits
const otpCode = '123456'; // ✅
const otpCode = '12345';  // ❌ Too short
```

3. **Check OTP service:**
```typescript
// Ensure SMS/Email service is configured
console.log('Sending OTP via:', channel); // SMS | EMAIL | APP
```

---

## 8. AI Insights Not Loading

**Issue:** AI scores showing as null or not updating

**Solutions:**

1. **Enable AI feature:**
```bash
# .env
VITE_ENABLE_AI=true
```

2. **Refresh AI scores:**
```typescript
import { refreshBuyerAIScore } from './services/workflows';

await refreshBuyerAIScore(buyerEntityId);
```

3. **Check database:**
```sql
-- Verify AI scores exist
SELECT * FROM ai_buyer_scores 
WHERE buyer_entity_id = $buyerEntityId
ORDER BY generated_at DESC LIMIT 1;
```

---

## 9. Build Errors

**Error Message:**
```
Build failed with errors
```

**Solutions:**

1. **Clear cache and reinstall:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

2. **Clear Vite cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

3. **Check TypeScript errors:**
```bash
npx tsc --noEmit
```

---

## 10. Modal/Dialog Not Showing

**Issue:** Dialogs or modals not appearing

**Solutions:**

1. **Check z-index:**
```css
/* Ensure modal has high z-index */
.dialog-overlay {
  z-index: 50;
}
```

2. **Verify state:**
```typescript
// Modal should have open state
const [showModal, setShowModal] = useState(false);

<Dialog open={showModal} onOpenChange={setShowModal}>
  {/* Content */}
</Dialog>
```

3. **Check for conflicting CSS:**
```css
/* Remove any overflow: hidden on parent */
.parent {
  overflow: visible; /* Not hidden */
}
```

---

## Development Tips

### Hot Reload Not Working

```bash
# Restart dev server
npm run dev

# Or force refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Checking Configuration

```typescript
// config/env.ts logs configuration in development
// Check browser console for config output
```

### Debugging API Calls

```typescript
// Add logging to API service
console.log('API Request:', endpoint, options);
console.log('API Response:', response);
```

### Testing Database Queries

```typescript
// Use browser console
import { api } from './services/api';

// Test fetching bills
const bills = await api.getBills();
console.log(bills);
```

---

## Environment-Specific Issues

### Development

```bash
# Use development API
VITE_API_URL=http://localhost:3000/api
VITE_MODE=development
```

### Production

```bash
# Use production API
VITE_API_URL=https://api.tradie.app
VITE_MODE=production

# Build for production
npm run build
```

### Staging

```bash
# Use staging API
VITE_API_URL=https://staging-api.tradie.app
VITE_MODE=staging
```

---

## Getting Help

If you're still experiencing issues:

1. **Check browser console** (F12 → Console tab)
2. **Check network tab** (F12 → Network tab)
3. **Review error logs** in terminal
4. **Check documentation:**
   - `/BACKEND_INTEGRATION.md` - API integration
   - `/TRANSACTION_AUDIT_DOCUMENTATION.md` - Component details
   - `/INTEGRATION_SUMMARY.md` - Complete overview

---

## Quick Checklist

When something's not working:

- [ ] Check browser console for errors
- [ ] Verify `.env` file exists with correct values
- [ ] Ensure backend API is running
- [ ] Check network requests in DevTools
- [ ] Verify TypeScript types (use `BigInt` for IDs)
- [ ] Clear cache and rebuild: `rm -rf node_modules/.vite && npm run dev`
- [ ] Check component props are correct types
- [ ] Verify database connection and data exists
- [ ] Check CORS configuration on backend
- [ ] Review documentation for correct usage

---

**Still stuck?** Review the comprehensive documentation files or check the example components for reference implementations.
