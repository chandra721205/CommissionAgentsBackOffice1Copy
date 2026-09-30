# 🎭 Mock Data Guide

## Overview

The TRADIE application includes a complete **mock data system** that allows you to run and test the application without a backend server. This is perfect for development, demos, and testing UI components.

---

## 🔧 How It Works

### Automatic Fallback

The API service (`/services/api.ts`) automatically uses mock data when:

1. **`USE_MOCK_DATA` is set to `true`** (default)
2. **Backend API calls fail** (fallback mechanism)

```typescript
// services/api.ts
const USE_MOCK_DATA = true; // Toggle this
```

### Configuration

```typescript
// To use real backend
const USE_MOCK_DATA = false;

// To use mock data (default)
const USE_MOCK_DATA = true;
```

---

## 📊 Available Mock Data

### 1. Bills (Transactions)

```typescript
// Mock bill data includes:
{
  id: BigInt(1),
  lot_id: BigInt(1),
  buyer_entity_id: BigInt(1),
  price_per_unit: 22.0,
  quantity_units: 50,
  packaging_cost: 50.0,
  total_payable: 1150.0,
  currency_code: 'INR',
  status: 'PENDING_BUYER',
  due_date: new Date('2024-11-15'),
  // ... full bill details
  lot: { /* commodity info */ },
  buyer_entity: { /* buyer details */ },
  weighment: { /* weight data */ }
}
```

### 2. Buyers

```typescript
// Mock buyer data includes:
{
  id: BigInt(1),
  display_name: 'Ramesh Traders',
  company: {
    legal_name: 'Ramesh Traders Pvt Ltd',
    brand_name: 'RT Commodities',
    address_line: 'Shop 45, APMC Market',
    city: 'Mumbai',
    state_region: 'Maharashtra',
    country_code: 'IN'
  },
  contacts: [
    {
      name: 'Ramesh Kumar',
      phone: '+91-9876543210',
      email: 'ramesh@rtcommodities.com',
      is_authorized: true
    }
  ],
  pay_prefs: [
    {
      method: 'UPI',
      details_json: { upi_id: 'ramesh@paytm' },
      is_default: true
    }
  ]
}
```

### 3. Payments

```typescript
// Mock payments:
[
  {
    id: BigInt(1),
    bill_id: BigInt(1),
    amount: 500,
    method: 'UPI',
    reference: 'TXN123456789',
    paid_at: new Date('2024-10-25')
  },
  {
    id: BigInt(2),
    bill_id: BigInt(1),
    amount: 650,
    method: 'CARD',
    reference: 'CARD987654321',
    paid_at: new Date('2024-10-26')
  }
]
```

### 4. AI Scores

```typescript
// Mock AI insights:
{
  buyer_entity_id: BigInt(1),
  reliability_score: 85,
  avg_settlement_days: 22,
  discrepancy_ratio: 12,
  on_time_ratio: 88,
  warnings: [
    'Payment delays observed in last 30 days',
    'Reliability score below 90%'
  ],
  recommendations: [
    'Consider requiring advance payment',
    'Monitor closely for next 2 transactions'
  ]
}
```

### 5. Audit Logs

```typescript
// Mock audit trail:
[
  {
    id: BigInt(1),
    entity: 'BILL',
    entity_id: BigInt(1),
    action: 'CREATE',
    actor_user_id: BigInt(1),
    before_json: null,
    after_json: { status: 'PENDING_BUYER', amount: 1150 },
    created_at: new Date('2024-10-20T10:00:00')
  },
  {
    id: BigInt(2),
    entity: 'BILL',
    entity_id: BigInt(1),
    action: 'UPDATE',
    actor_user_id: BigInt(2),
    before_json: { price_per_unit: 20 },
    after_json: { price_per_unit: 22 },
    created_at: new Date('2024-10-21T14:30:00')
  }
]
```

---

## 🎯 Endpoints Supported

All API endpoints return mock data:

### Bills
- `GET /bills` → List of bills
- `GET /bills/:id` → Single bill with details
- `POST /bills` → Create bill (returns mock)
- `GET /bills/:id/payments` → Payment history
- `GET /bills/:id/authorizations` → Authorizations

### Buyers
- `GET /buyers` → List of buyers
- `GET /buyers/:id` → Single buyer with details
- `GET /buyers/:id/score` → AI score

### AI & Analytics
- `GET /ai/buyers/:id/insights` → AI insights
- `GET /buyers/:id/mod-flags` → Modification flags

### Audit
- `GET /audit/:entity/:id` → Audit trail

### OTP
- `POST /otp/send` → Send OTP (simulated)
- `POST /otp/verify` → Verify OTP (always valid)

### Workflows
- `POST /bills/change-request` → Request change
- `POST /bills/authorize` → Authorize bill
- `POST /bills/authorize-final` → Final approval
- `POST /weighments` → Create weighment

---

## 🚀 Usage Examples

### Working with Mock Data

```typescript
import { api } from './services/api';

// All these work without backend!

// Get bill
const bill = await api.getBillById(BigInt(1));
console.log(bill.buyer_entity.display_name); // "Ramesh Traders"

// Get payments
const payments = await api.getBillPayments(BigInt(1));
console.log(payments.length); // 2

// Get AI insights
const insights = await api.getBuyerAIInsights(BigInt(1));
console.log(insights.reliability_score); // 85

// Get audit log
const logs = await api.getAuditLog('BILL', BigInt(1));
console.log(logs.length); // 2

// Create bill (returns mock)
const newBill = await api.createBill({
  lot_id: BigInt(1),
  buyer_entity_id: BigInt(1),
  price_per_unit: 22.0,
  quantity_units: 50,
  packaging_cost: 50,
  currency_code: 'INR',
  due_date_type: 'REGULATION',
  due_date: new Date('2024-12-15')
});
console.log(newBill.id); // BigInt(1)
```

### Testing Components

```tsx
import DetailedTransactionAuditView from './components/DetailedTransactionAuditView';

// Works immediately with mock data
function App() {
  return (
    <DetailedTransactionAuditView 
      billId={BigInt(1)}
    />
  );
}

// Component will:
// ✅ Load mock bill data
// ✅ Show payments (2 items)
// ✅ Display AI insights
// ✅ Show audit trail (2 entries)
// ✅ All without backend!
```

---

## 🔄 Switching Between Mock and Real Data

### Development Mode (Mock Data)

```typescript
// services/api.ts
const USE_MOCK_DATA = true;

// .env
VITE_API_URL=/api
```

Run the app:
```bash
npm run dev
```

Everything works with mock data! ✅

### Production Mode (Real Backend)

```typescript
// services/api.ts
const USE_MOCK_DATA = false;

// .env
VITE_API_URL=https://api.tradie.app
```

Build and deploy:
```bash
npm run build
```

App will connect to real backend ✅

### Hybrid Mode (Automatic Fallback)

The API service **automatically falls back to mock data** if the backend fails:

```typescript
private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    return this.getMockResponse<T>(endpoint, options);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      // ... real fetch
    });
    return response.json();
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error);
    return this.getMockResponse<T>(endpoint, options); // ✅ Fallback
  }
}
```

This means:
- If backend is down → Mock data is used
- If endpoint doesn't exist → Mock data is used
- If network error → Mock data is used

---

## 🎨 Customizing Mock Data

### Adding Your Own Mock Data

Edit `/services/api.ts`:

```typescript
// Add to MOCK_DATA object
const MOCK_DATA = {
  buyers: [] as BuyerEntityWithDetails[],
  bills: [] as BillWithDetails[],
  payments: [] as Payment[],
  auditLogs: [] as AuditLog[],
  aiScores: {} as Record<string, AIBuyerScore>,
  
  // Add your custom data
  myCustomData: [
    { id: 1, name: 'Custom Item' }
  ]
};
```

### Modifying Mock Functions

```typescript
// Customize bill data
private getMockBill(id: bigint): BillWithDetails {
  return {
    id,
    // Change any field here
    price_per_unit: 25.0,  // Custom price
    quantity_units: 100,   // Custom quantity
    buyer_entity: {
      display_name: 'My Custom Buyer',  // Custom name
      // ... rest of data
    }
  };
}
```

### Adding New Endpoints

```typescript
private async getMockResponse<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Add your endpoint
  if (endpoint === '/my-custom-endpoint') {
    return { data: 'custom response' } as T;
  }
  
  // ... existing endpoints
}
```

---

## 📋 Mock Data Scenarios

### Scenario 1: Overdue Bill

```typescript
private getMockBill(id: bigint): BillWithDetails {
  return {
    // ... other fields
    due_date: new Date('2024-10-15'), // Past date
    status: AuthStatus.PENDING_BUYER,
    // Will show as overdue in UI ✅
  };
}
```

### Scenario 2: Paid in Full

```typescript
private getMockPayments(billId: bigint): Payment[] {
  return [
    {
      id: BigInt(1),
      bill_id: billId,
      amount: 1150, // Equals total_payable
      method: PaymentMethod.UPI,
      // Will show as "Paid in Full" ✅
    }
  ];
}
```

### Scenario 3: High Risk Buyer

```typescript
private getMockAIInsights(buyerId: bigint): any {
  return {
    reliability_score: 45, // Low score
    discrepancy_ratio: 35, // High discrepancy
    on_time_ratio: 50,     // Low on-time rate
    warnings: [
      'Chronic overdue pattern detected',
      'High dispute rate',
      'Reliability below threshold'
    ],
    // Will show severe warnings ✅
  };
}
```

---

## 🧪 Testing Workflows

### Test Complete Bill Lifecycle

```typescript
import { completeBillLifecycle } from './services/workflows';

// All steps use mock data
const result = await completeBillLifecycle({
  lot_id: BigInt(1),
  buyer_entity_id: BigInt(1),
  buyer_user_id: BigInt(1),
  agent_user_id: BigInt(2),
  price_per_unit: 22.0,
  quantity_units: 50,
  packaging_cost: 50,
  due_date_type: 'REGULATION',
  buyer_otp: '123456',  // Any OTP works
  agent_otp: '654321'   // Any OTP works
});

// Returns mock data at each step ✅
```

### Test Error Scenarios

```typescript
// Mock OTP verification failure
private async getMockResponse<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (endpoint === '/otp/verify') {
    // Test invalid OTP
    return { valid: false, message: 'Invalid OTP' } as T;
  }
}
```

---

## 🎯 Benefits of Mock Data

✅ **No Backend Needed** - Develop UI independently
✅ **Fast Development** - No network delays
✅ **Predictable Testing** - Consistent data every time
✅ **Demo Ready** - Show features without setup
✅ **Offline Development** - Work anywhere
✅ **Easy Debugging** - Controlled data scenarios
✅ **Component Testing** - Isolate UI logic
✅ **Quick Prototyping** - Build features fast

---

## 🔍 Debugging Mock Data

### Check What's Being Returned

```typescript
// Enable logging in getMockResponse
private async getMockResponse<T>(endpoint: string, options?: RequestInit): Promise<T> {
  console.log('Mock endpoint called:', endpoint);
  console.log('Mock options:', options);
  
  // ... mock logic
  
  const response = /* ... */;
  console.log('Mock response:', response);
  return response;
}
```

### Verify in Browser Console

```javascript
// Open browser console (F12)

// Test API calls
import { api } from './services/api';

const bill = await api.getBillById(BigInt(1));
console.log(bill);

const payments = await api.getBillPayments(BigInt(1));
console.log(payments);
```

---

## 📝 Summary

The mock data system provides:

1. **Complete working data** for all API endpoints
2. **Automatic fallback** if backend unavailable
3. **Easy customization** for different scenarios
4. **Zero setup** required
5. **Production-ready** switch

Just run `npm run dev` and everything works! 🚀

---

## 🔗 Related Documentation

- **`/services/api.ts`** - API service with mock data
- **`/TROUBLESHOOTING.md`** - Common issues
- **`/SETUP.md`** - Environment setup
- **`/BACKEND_INTEGRATION.md`** - Real backend integration

---

**Mock data makes development faster and easier!** 🎭✨
