// TRADIE v1 - Complete 24-Screen Commodity Trading Prototype
// Master component integrating all roles, workflows, and features

import React, { useState } from 'react';
import { ChevronLeft, Globe, Mic, QrCode, Coins, User, Menu, X } from 'lucide-react';
import type { UserRole, Language } from '../types/tradie-prototype';

// Import existing components
import ProducerLedger from './ProducerLedger';
import { BuyerDashboard } from './BuyerDashboard';
import { BuyerBackOffice } from './BuyerBackOffice';
import IntegratedBillWorkflow from './IntegratedBillWorkflow';
import { CommissionAgentApp } from './CommissionAgentApp';
import { BusinessEntityManagement } from './BusinessEntityManagement';
import EnhancedEntityRectificationDashboard from './EnhancedEntityRectificationDashboard';

// We'll create placeholder components for missing screens
import { ProducerInspectionStatus } from './ProducerInspectionStatus';
import { ProducerWeighmentView } from './ProducerWeighmentView';
import { BuyerStorageManagement } from './BuyerStorageManagement';
import { BuyerPaymentMethods } from './BuyerPaymentMethods';
import { AdminRegulatorySync } from './AdminRegulatorySync';
import { AdminAnalytics } from './AdminAnalytics';
import { TradieTokensWallet } from './TradieTokensWallet';

interface TradieV1CompleteProps {
  onBack?: () => void;
}

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'HI', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'TE', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'TM', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'KN', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'BN', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'MR', name: 'मराठी', flag: '🇮🇳' },
];

const ROLE_OPTIONS: { role: UserRole; icon: string; color: string }[] = [
  { role: 'producer', icon: '🌾', color: 'from-green-500 to-emerald-600' },
  { role: 'buyer', icon: '🏪', color: 'from-blue-500 to-indigo-600' },
  { role: 'agent', icon: '🤝', color: 'from-purple-500 to-pink-600' },
  { role: 'admin', icon: '⚙️', color: 'from-amber-500 to-orange-600' },
];

export function TradieV1Complete({ onBack }: TradieV1CompleteProps) {
  const [step, setStep] = useState<'language' | 'role' | 'dashboard'>('language');
  const [language, setLanguage] = useState<Language>('EN');
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');
  const [showTokens, setShowTokens] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tokens, setTokens] = useState({
    balance: 65, // 50 signup + 5 daily + 10 trade
    history: [
      { type: 'signup', amount: 50, date: '2024-10-25' },
      { type: 'daily', amount: 5, date: '2024-10-28' },
      { type: 'trade', amount: 10, date: '2024-10-28' },
    ],
  });

  // Language Selection Screen
  if (step === 'language') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-4">
        <div className="mx-auto max-w-2xl pt-20">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
              <Globe className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2">TRADIE v1</h1>
            <p className="text-slate-600">Select Your Language / अपनी भाषा चुनें</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setStep('role');
                }}
                className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-6 text-center transition-all hover:scale-105 hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="mb-2 text-4xl">{lang.flag}</div>
                <div className="font-medium">{lang.name}</div>
                <div className="text-xs text-slate-500">{lang.code}</div>
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-400/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Welcome
            </button>
          )}
        </div>
      </div>
    );
  }

  // Role Selection Screen
  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-4">
        <div className="mx-auto max-w-2xl pt-20">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2">Select Your Role</h1>
            <p className="text-slate-600">Choose how you'll use TRADIE</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.role}
                onClick={() => {
                  setRole(option.role);
                  setStep('dashboard');
                  // Award signup bonus
                  if (tokens.balance === 0) {
                    setTokens({
                      balance: 50,
                      history: [{ type: 'signup', amount: 50, date: new Date().toISOString().split('T')[0] }],
                    });
                  }
                }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${option.color} p-8 text-left text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
              >
                <div className="mb-4 text-6xl">{option.icon}</div>
                <div className="text-2xl font-bold capitalize">{option.role}</div>
                <div className="mt-2 text-sm text-white/80">
                  {option.role === 'producer' && 'List produce, track sales, manage storage'}
                  {option.role === 'buyer' && 'Browse, inspect, purchase commodities'}
                  {option.role === 'agent' && 'Facilitate trades, verify quality, earn commissions'}
                  {option.role === 'admin' && 'Manage platform, regulatory sync, analytics'}
                </div>
                <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-white/10" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('language')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white bg-white/20 px-4 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ChevronLeft className="h-4 w-4" />
            Change Language
          </button>
        </div>
      </div>
    );
  }

  // Main Dashboard with Navigation
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500" />
              <div>
                <div className="text-sm font-bold">TRADIE v1</div>
                <div className="text-xs text-slate-500 capitalize">{role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setStep('language')}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              <Globe className="h-4 w-4" />
              {language}
            </button>

            {/* Tokens */}
            <button
              onClick={() => setShowTokens(!showTokens)}
              className="group relative flex items-center gap-2 overflow-hidden rounded-lg border-2 border-yellow-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              <Coins className="h-4 w-4" />
              {tokens.balance}
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>

            {/* Profile */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
              {role?.[0].toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="mb-4 text-sm font-bold text-slate-900">Navigation</div>
              {getNavItems(role!).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                    setMenuOpen(false);
                  }}
                  className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeScreen === item.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 border-r border-slate-200 bg-white md:block">
          <div className="p-4">
            <div className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
              {role} Menu
            </div>
            {getNavItems(role!).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                  activeScreen === item.id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderScreen(activeScreen, role!, language)}
        </div>
      </div>

      {/* TRADIE Tokens Modal */}
      {showTokens && <TradieTokensWallet tokens={tokens} onClose={() => setShowTokens(false)} />}
    </div>
  );
}

// Navigation items for each role
function getNavItems(role: UserRole): { id: string; label: string }[] {
  switch (role) {
    case 'producer':
      return [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'create-listing', label: '➕ Create Listing' },
        { id: 'my-listings', label: '📦 My Listings' },
        { id: 'inspection-status', label: '🔍 Inspection Status' },
        { id: 'weighment', label: '⚖️ Weighment' },
        { id: 'storage', label: '🏪 Storage' },
        { id: 'reports', label: '📈 Reports' },
        { id: 'profile', label: '👤 Profile/KYC' },
      ];
    case 'buyer':
      return [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'browse', label: '🔍 Browse Commodities' },
        { id: 'inspections', label: '🔬 Inspections' },
        { id: 'orders', label: '📋 Orders' },
        { id: 'bills', label: '💰 Bills' },
        { id: 'storage', label: '🏪 Storage' },
        { id: 'payment-methods', label: '💳 Payment Methods' },
        { id: 'reports', label: '📈 Reports' },
      ];
    case 'agent':
      return [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'manage', label: '👥 Manage' },
        { id: 'verification', label: '✓ Verification' },
        { id: 'reports', label: '📈 Reports' },
      ];
    case 'admin':
      return [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'users', label: '👥 Users' },
        { id: 'regulatory', label: '📜 Regulatory Sync' },
        { id: 'analytics', label: '📊 Analytics' },
      ];
    default:
      return [];
  }
}

// Render the appropriate screen component
function renderScreen(screenId: string, role: UserRole, language: Language): React.ReactNode {
  // Producer Screens
  if (role === 'producer') {
    switch (screenId) {
      case 'dashboard':
      case 'my-listings':
      case 'reports':
        return <ProducerLedger />;
      case 'create-listing':
        return <CommissionAgentApp />;
      case 'inspection-status':
        return <ProducerInspectionStatus language={language} />;
      case 'weighment':
        return <ProducerWeighmentView language={language} />;
      case 'storage':
        return <div className="p-8"><p className="text-slate-600">Storage management integrated in ledger</p></div>;
      case 'profile':
        return <BusinessEntityManagement />;
      default:
        return <ProducerLedger />;
    }
  }

  // Buyer Screens
  if (role === 'buyer') {
    switch (screenId) {
      case 'dashboard':
        return <BuyerDashboard />;
      case 'browse':
        return <CommissionAgentApp />;
      case 'inspections':
        return <BuyerBackOffice />;
      case 'orders':
      case 'bills':
        return <IntegratedBillWorkflow />;
      case 'storage':
        return <BuyerStorageManagement language={language} />;
      case 'payment-methods':
        return <BuyerPaymentMethods language={language} />;
      case 'reports':
        return <div className="p-8"><p className="text-slate-600">Reports coming soon</p></div>;
      default:
        return <BuyerDashboard />;
    }
  }

  // Agent Screens
  if (role === 'agent') {
    return <CommissionAgentApp />;
  }

  // Admin Screens
  if (role === 'admin') {
    switch (screenId) {
      case 'dashboard':
        return <BusinessEntityManagement />;
      case 'users':
        return <EnhancedEntityRectificationDashboard />;
      case 'regulatory':
        return <AdminRegulatorySync language={language} />;
      case 'analytics':
        return <AdminAnalytics language={language} />;
      default:
        return <BusinessEntityManagement />;
    }
  }

  return <div className="p-8"><p className="text-slate-600">Screen not found</p></div>;
}

export default TradieV1Complete;
