// Producer Inspection Status Screen
// Track quality inspections, sampling results, and blockchain verification

import React, { useState } from 'react';
import { Search, Filter, QrCode, CheckCircle, Clock, AlertTriangle, Mic } from 'lucide-react';
import type { Language } from '../types/tradie-prototype';

interface ProducerInspectionStatusProps {
  language: Language;
}

const INSPECTIONS = [
  {
    id: 'INS-2024-001',
    commodity: 'Coconut West Coast Tall',
    quantity: '500 Nos',
    requestedDate: '2024-10-25',
    status: 'Completed',
    qualityGrade: 'A+',
    moistureContent: '12%',
    foreignMatter: '0.5%',
    inspector: 'Rajesh Kumar',
    photos: 3,
    blockchainVerified: true,
    nftBadge: '0x7a3f...c2e1',
  },
  {
    id: 'INS-2024-002',
    commodity: 'Rice Basmati',
    quantity: '10 Quintal',
    requestedDate: '2024-10-27',
    status: 'In Progress',
    qualityGrade: '-',
    moistureContent: '-',
    foreignMatter: '-',
    inspector: 'Priya Sharma',
    photos: 0,
    blockchainVerified: false,
    nftBadge: null,
  },
  {
    id: 'INS-2024-003',
    commodity: 'Turmeric',
    quantity: '2 Quintal',
    requestedDate: '2024-10-28',
    status: 'Pending',
    qualityGrade: '-',
    moistureContent: '-',
    foreignMatter: '-',
    inspector: '-',
    photos: 0,
    blockchainVerified: false,
    nftBadge: null,
  },
];

export function ProducerInspectionStatus({ language }: ProducerInspectionStatusProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null);
  const [showBlockchainQR, setShowBlockchainQR] = useState(false);

  const filteredInspections = INSPECTIONS.filter((insp) => {
    const matchesSearch =
      insp.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || insp.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 ring-green-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 ring-amber-200';
      case 'Pending':
        return 'bg-slate-100 text-slate-700 ring-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Inspection Status
          </h1>
          <p className="text-slate-600">Track quality inspections and sampling results</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by commodity or inspection ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200">
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Inspections Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInspections.map((inspection) => (
            <div
              key={inspection.id}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={() => setSelectedInspection(inspection.id)}
            >
              {/* Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <div className="mb-1 text-xs font-medium text-slate-500">{inspection.id}</div>
                    <div className="font-bold text-slate-900">{inspection.commodity}</div>
                  </div>
                  {inspection.blockchainVerified && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBlockchainQR(true);
                      }}
                      className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:bg-green-50"
                    >
                      <QrCode className="h-4 w-4 text-green-600" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-slate-600">{inspection.quantity}</div>
              </div>

              {/* Body */}
              <div className="p-4">
                {/* Status Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${getStatusColor(
                      inspection.status
                    )}`}
                  >
                    {inspection.status === 'Completed' && <CheckCircle className="h-3 w-3" />}
                    {inspection.status === 'In Progress' && <Clock className="h-3 w-3" />}
                    {inspection.status === 'Pending' && <AlertTriangle className="h-3 w-3" />}
                    {inspection.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quality Grade:</span>
                    <span className="font-medium text-slate-900">{inspection.qualityGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Moisture:</span>
                    <span className="font-medium text-slate-900">{inspection.moistureContent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Foreign Matter:</span>
                    <span className="font-medium text-slate-900">{inspection.foreignMatter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inspector:</span>
                    <span className="font-medium text-slate-900">{inspection.inspector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-medium text-slate-900">{inspection.requestedDate}</span>
                  </div>
                </div>

                {/* NFT Badge */}
                {inspection.nftBadge && (
                  <div className="mt-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-3 ring-1 ring-purple-200">
                    <div className="mb-1 text-xs font-medium text-purple-700">NFT Quality Certificate</div>
                    <div className="font-mono text-xs text-purple-600">{inspection.nftBadge}</div>
                  </div>
                )}

                {/* Photos */}
                {inspection.photos > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(inspection.photos, 3))].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-lg border-2 border-white bg-gradient-to-br from-blue-100 to-green-100"
                        />
                      ))}
                    </div>
                    <span>{inspection.photos} photos attached</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInspections.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <Filter className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No inspections found matching your criteria</p>
          </div>
        )}

        {/* Blockchain QR Modal */}
        {showBlockchainQR && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowBlockchainQR(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-center">
                <div className="mb-2 font-bold">Blockchain Verification</div>
                <div className="text-sm text-slate-600">Polygon Network</div>
              </div>
              <div className="mb-4 rounded-xl bg-slate-100 p-8">
                <div className="mx-auto grid h-48 w-48 grid-cols-8 gap-1">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        Math.random() > 0.5 ? 'bg-slate-900' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-center">
                <div className="text-xs text-green-700">Transaction Hash</div>
                <div className="font-mono text-xs font-bold text-green-900">
                  0x7a3f8c92...1b4e6c2e1
                </div>
              </div>
              <button
                onClick={() => setShowBlockchainQR(false)}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProducerInspectionStatus;
