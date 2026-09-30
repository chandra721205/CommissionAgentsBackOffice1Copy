// Buyer Storage Management Screen
// Manage warehouses: Private/Lease/Chamber with rent payments and capacity tracking

import React, { useState } from 'react';
import { Warehouse, Plus, TrendingUp, DollarSign, Calendar, Mic } from 'lucide-react';
import type { Language } from '../types/tradie-prototype';

interface BuyerStorageManagementProps {
  language: Language;
}

const STORAGE_UNITS = [
  {
    id: 'STR-001',
    type: 'Private',
    location: 'Chennai, Tamil Nadu',
    capacity: 1000,
    occupied: 650,
    unit: 'Quintal',
    owner: 'Self-Owned',
    rentPerMonth: 0,
    paymentType: null,
    commodities: ['Rice Basmati', 'Wheat Durum', 'Toor Dal'],
    regulatedPrice: false,
    status: 'Active',
  },
  {
    id: 'STR-002',
    type: 'Lease',
    location: 'Bangalore, Karnataka',
    capacity: 500,
    occupied: 320,
    unit: 'Quintal',
    owner: '3rd-Party',
    rentPerMonth: 25000,
    paymentType: 'Upfront',
    commodities: ['Turmeric', 'Cardamom'],
    regulatedPrice: true,
    status: 'Active',
  },
  {
    id: 'STR-003',
    type: 'Chamber',
    location: 'Hyderabad, Telangana',
    capacity: 200,
    occupied: 180,
    unit: 'Quintal',
    owner: 'Buyer',
    rentPerMonth: 15000,
    paymentType: 'Partial',
    commodities: ['Coconut WCT', 'Cashew'],
    regulatedPrice: true,
    status: 'Active',
  },
];

export function BuyerStorageManagement({ language }: BuyerStorageManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  const totalCapacity = STORAGE_UNITS.reduce((sum, s) => sum + s.capacity, 0);
  const totalOccupied = STORAGE_UNITS.reduce((sum, s) => sum + s.occupied, 0);
  const totalRent = STORAGE_UNITS.reduce((sum, s) => sum + (s.rentPerMonth || 0), 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Private':
        return 'bg-blue-100 text-blue-700 ring-blue-200';
      case 'Lease':
        return 'bg-purple-100 text-purple-700 ring-purple-200';
      case 'Chamber':
        return 'bg-amber-100 text-amber-700 ring-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
  };

  const getOwnerColor = (owner: string) => {
    if (owner.includes('Self') || owner === 'Buyer') return 'text-green-600';
    if (owner.includes('3rd')) return 'text-purple-600';
    return 'text-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Storage Management
            </h1>
            <p className="text-slate-600">Manage warehouses and track capacity</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add Storage
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <Warehouse className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Total Units</div>
                  <div className="text-2xl font-bold text-slate-900">{STORAGE_UNITS.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Utilization</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {((totalOccupied / totalCapacity) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Monthly Rent</div>
                  <div className="text-2xl font-bold text-slate-900">₹{(totalRent / 1000).toFixed(0)}k</div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Active</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {STORAGE_UNITS.filter((s) => s.status === 'Active').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Units Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STORAGE_UNITS.map((storage) => {
            const utilization = (storage.occupied / storage.capacity) * 100;

            return (
              <div
                key={storage.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                onClick={() => setSelectedStorage(storage.id)}
              >
                {/* Header */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="mb-1 text-xs font-medium text-slate-500">{storage.id}</div>
                      <div className="font-bold text-slate-900">{storage.location}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getTypeColor(storage.type)}`}>
                      {storage.type}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-600">Capacity</span>
                      <span className="font-medium text-slate-900">
                        {storage.occupied}/{storage.capacity} {storage.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full transition-all ${
                          utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{utilization.toFixed(0)}% utilized</div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Owner:</span>
                      <span className={`font-medium ${getOwnerColor(storage.owner)}`}>{storage.owner}</span>
                    </div>

                    {storage.rentPerMonth && storage.rentPerMonth > 0 ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Rent:</span>
                          <span className="font-medium text-slate-900">₹{storage.rentPerMonth.toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Payment:</span>
                          <span className="font-medium text-slate-900">{storage.paymentType}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cost:</span>
                        <span className="font-medium text-green-600">Free (Owned)</span>
                      </div>
                    )}

                    {storage.regulatedPrice && (
                      <div className="rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
                        🔒 Regulated Low Pricing
                      </div>
                    )}
                  </div>

                  {/* Commodities */}
                  <div className="mt-3">
                    <div className="mb-2 text-xs text-slate-500">Stored Commodities:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {storage.commodities.map((commodity) => (
                        <span
                          key={commodity}
                          className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 ring-1 ring-blue-200"
                        >
                          {commodity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Storage Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <h2 className="text-xl font-bold text-slate-900">Add Storage Unit</h2>
                <p className="text-sm text-slate-600">Configure new warehouse or chamber</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Storage Type</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Private</option>
                      <option>Lease</option>
                      <option>Chamber</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Owner Type</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Self-Owned</option>
                      <option>Buyer</option>
                      <option>3rd-Party</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="City, State"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-1.5">
                        <Mic className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Capacity</label>
                    <input
                      type="number"
                      placeholder="1000"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Unit</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Quintal</option>
                      <option>Kg</option>
                      <option>Tonnes</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Rent/Month (₹)</label>
                    <input
                      type="number"
                      placeholder="0 for owned"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Payment Type</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Upfront</option>
                      <option>Partial</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" className="rounded" />
                      Regulated Low Pricing
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-200 bg-slate-50 p-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
                >
                  Add Storage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerStorageManagement;
