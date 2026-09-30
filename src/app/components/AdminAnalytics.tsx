// Admin Analytics Dashboard
// Platform metrics, trends, and insights

import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import type { Language } from '../types/tradie-prototype';

interface AdminAnalyticsProps {
  language: Language;
}

export function AdminAnalytics({ language }: AdminAnalyticsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6">Platform Analytics</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Total Users</div>
                <div className="text-2xl font-bold">1,250</div>
              </div>
            </div>
            <div className="text-xs text-green-600">+15% this month</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Transactions</div>
                <div className="text-2xl font-bold">8,432</div>
              </div>
            </div>
            <div className="text-xs text-green-600">+22% this month</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">GMV</div>
                <div className="text-2xl font-bold">₹45M</div>
              </div>
            </div>
            <div className="text-xs text-green-600">+18% this month</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Growth Rate</div>
                <div className="text-2xl font-bold">32%</div>
              </div>
            </div>
            <div className="text-xs text-green-600">MoM growth</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
