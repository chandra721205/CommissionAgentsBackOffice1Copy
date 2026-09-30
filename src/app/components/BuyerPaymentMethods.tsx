// Buyer Payment Methods Screen
// Configure country-specific payment options: UPI, ACH, SEPA, Wire Transfer, Crypto

import React, { useState } from 'react';
import { CreditCard, Plus, CheckCircle, Globe } from 'lucide-react';
import type { Language } from '../types/tradie-prototype';

interface BuyerPaymentMethodsProps {
  language: Language;
}

const PAYMENT_METHODS = [
  { id: '1', type: 'UPI', details: 'buyer@okaxis', country: 'India', verified: true, default: true },
  { id: '2', type: 'NEFT', details: 'AXIS0001234 - ****5678', country: 'India', verified: true, default: false },
  { id: '3', type: 'ACH', details: 'US Bank ****9012', country: 'USA', verified: false, default: false },
  { id: '4', type: 'SEPA', details: 'DE89370400440532013000', country: 'EU', verified: true, default: false },
];

export function BuyerPaymentMethods({ language }: BuyerPaymentMethodsProps) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Payment Methods</h1>
            <p className="text-slate-600">Manage your payment options</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white shadow-lg hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add Method
          </button>
        </div>

        <div className="space-y-4">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{method.type}</span>
                    {method.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {method.default && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600">{method.details}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Globe className="h-3 w-3" />
                    {method.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuyerPaymentMethods;
