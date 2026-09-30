// Producer Weighment View Screen
// View weighbridge data, blockchain verification, and vehicle tracking

import React, { useState } from 'react';
import { Truck, Scale, QrCode, CheckCircle, TrendingUp, Mic } from 'lucide-react';
import type { Language } from '../types/tradie-prototype';

interface ProducerWeighmentViewProps {
  language: Language;
}

const WEIGHMENTS = [
  {
    id: 'WGH-2024-001',
    commodity: 'Coconut West Coast Tall',
    vehicleNumber: 'TN-01-AB-1234',
    grossWeight: 5200,
    tareWeight: 1500,
    netWeight: 3700,
    unit: 'Kg',
    timestamp: '2024-10-28 09:45 AM',
    weighbridgeId: 'WB-CHENNAI-03',
    operator: 'Suresh Kumar',
    blockchainHash: '0x9f2a...4c8e',
    status: 'Verified',
    nftMinted: true,
  },
  {
    id: 'WGH-2024-002',
    commodity: 'Rice Basmati',
    vehicleNumber: 'KA-02-CD-5678',
    grossWeight: 12500,
    tareWeight: 2000,
    netWeight: 10500,
    unit: 'Kg',
    timestamp: '2024-10-27 02:30 PM',
    weighbridgeId: 'WB-BANGALORE-01',
    operator: 'Lakshmi Devi',
    blockchainHash: '0x7e3b...2a1f',
    status: 'Verified',
    nftMinted: true,
  },
  {
    id: 'WGH-2024-003',
    commodity: 'Turmeric',
    vehicleNumber: 'AP-03-EF-9012',
    grossWeight: 2100,
    tareWeight: 800,
    netWeight: 1300,
    unit: 'Kg',
    timestamp: '2024-10-28 11:20 AM',
    weighbridgeId: 'WB-HYDERABAD-05',
    operator: 'Ramesh Reddy',
    blockchainHash: null,
    status: 'Pending Verification',
    nftMinted: false,
  },
];

export function ProducerWeighmentView({ language }: ProducerWeighmentViewProps) {
  const [selectedWeighment, setSelectedWeighment] = useState<string | null>(null);
  const [showBlockchainQR, setShowBlockchainQR] = useState(false);
  const [selectedHash, setSelectedHash] = useState<string | null>(null);

  const totalNetWeight = WEIGHMENTS.reduce((sum, w) => sum + w.netWeight, 0);
  const verifiedCount = WEIGHMENTS.filter((w) => w.status === 'Verified').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Weighment Records
          </h1>
          <p className="text-slate-600">Blockchain-verified weighbridge data</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Total Weighed</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(totalNetWeight / 1000).toFixed(1)} T
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Verified</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {verifiedCount}/{WEIGHMENTS.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">NFTs Minted</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {WEIGHMENTS.filter((w) => w.nftMinted).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weighment Records */}
        <div className="space-y-4">
          {WEIGHMENTS.map((weighment) => (
            <div
              key={weighment.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left Section - Main Details */}
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-1 text-xs font-medium text-slate-500">{weighment.id}</div>
                      <div className="mb-2 text-xl font-bold text-slate-900">{weighment.commodity}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Truck className="h-4 w-4" />
                        {weighment.vehicleNumber}
                      </div>
                    </div>
                    {weighment.status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Weight Details */}
                  <div className="grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4">
                    <div>
                      <div className="mb-1 text-xs text-slate-500">Gross Weight</div>
                      <div className="font-bold text-slate-900">
                        {weighment.grossWeight} {weighment.unit}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-slate-500">Tare Weight</div>
                      <div className="font-bold text-slate-900">
                        {weighment.tareWeight} {weighment.unit}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-slate-500">Net Weight</div>
                      <div className="text-xl font-bold text-green-600">
                        {weighment.netWeight} {weighment.unit}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Weighbridge:</span>{' '}
                      <span className="font-medium text-slate-900">{weighment.weighbridgeId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Operator:</span>{' '}
                      <span className="font-medium text-slate-900">{weighment.operator}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Timestamp:</span>{' '}
                      <span className="font-medium text-slate-900">{weighment.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Blockchain */}
                <div className="border-t border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:w-64 md:border-l md:border-t-0">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wide text-purple-700">
                    Blockchain Verification
                  </div>

                  {weighment.blockchainHash ? (
                    <>
                      <div className="mb-3 rounded-lg bg-white p-3 shadow-sm">
                        <div className="mb-1 text-xs text-slate-500">Transaction Hash</div>
                        <div className="break-all font-mono text-xs font-medium text-purple-700">
                          {weighment.blockchainHash}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedHash(weighment.blockchainHash);
                          setShowBlockchainQR(true);
                        }}
                        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105"
                      >
                        <QrCode className="h-4 w-4" />
                        View QR Code
                      </button>

                      {weighment.nftMinted && (
                        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-purple-200">
                          <div className="mb-1 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs font-medium text-purple-700">NFT Minted</span>
                          </div>
                          <div className="text-xs text-slate-600">Polygon Network</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                      <div className="mb-2 text-sm text-slate-500">Awaiting blockchain verification</div>
                      <div className="text-xs text-slate-400">Processing...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blockchain QR Modal */}
        {showBlockchainQR && selectedHash && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setShowBlockchainQR(false);
              setSelectedHash(null);
            }}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-center">
                <div className="mb-2 text-xl font-bold text-slate-900">Blockchain Verification</div>
                <div className="text-sm text-slate-600">Polygon Network - Mainnet</div>
              </div>

              {/* QR Code */}
              <div className="mb-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-8">
                <div className="mx-auto grid h-64 w-64 grid-cols-8 gap-1">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-purple-900' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="mb-4 rounded-lg bg-purple-50 p-4 ring-1 ring-purple-200">
                <div className="mb-1 text-xs font-medium text-purple-700">Transaction Hash</div>
                <div className="break-all font-mono text-sm font-bold text-purple-900">{selectedHash}</div>
              </div>

              {/* Verification Badge */}
              <div className="mb-4 rounded-lg bg-green-50 p-3 ring-1 ring-green-200">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Polygon Verified & Immutable
                </div>
              </div>

              <button
                onClick={() => {
                  setShowBlockchainQR(false);
                  setSelectedHash(null);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
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

export default ProducerWeighmentView;
