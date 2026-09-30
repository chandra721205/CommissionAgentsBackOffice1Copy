// Admin Regulatory Sync Screen
// QR code management: Yard/District/State/Central sync with ledger append and tax calculation

import React, { useState } from 'react';
import { QrCode, Database, TrendingUp, CheckCircle } from 'lucide-react';
import type { Language } from '../types/tradie-prototype';

interface AdminRegulatorySyncProps {
  language: Language;
}

const QR_LEVELS = [
  { level: 'Yard', count: 45, synced: 42, tax: 125000 },
  { level: 'District', count: 8, synced: 8, tax: 450000 },
  { level: 'State', count: 3, synced: 3, tax: 1200000 },
  { level: 'Central', count: 1, synced: 1, tax: 3500000 },
];

export function AdminRegulatorySync({ language }: AdminRegulatorySyncProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6">Regulatory QR Sync</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {QR_LEVELS.map((qr) => (
            <div key={qr.level} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-amber-100 p-3">
                  <QrCode className="h-6 w-6 text-amber-600" />
                </div>
                {qr.synced === qr.count && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <div className="mb-2 font-bold text-slate-900">{qr.level} Level</div>
              <div className="mb-3 text-sm text-slate-600">
                {qr.synced}/{qr.count} Synced
              </div>
              <div className="text-xs text-slate-500">Tax Collected:</div>
              <div className="font-bold text-green-600">₹{(qr.tax / 1000).toFixed(0)}k</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminRegulatorySync;
