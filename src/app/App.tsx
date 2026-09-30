import { useState } from 'react';
import { BuyerBackOffice } from './components/BuyerBackOffice';
import { CommissionAgentApp } from './components/CommissionAgentApp';
import { BuyerPrototype } from './components/BuyerPrototype';
import { CommissionAgentBuyerDB } from './components/CommissionAgentBuyerDB';
import TradieAppPrototype from './components/TradieAppPrototype';
import ExpertBuyerDatabase from './components/ExpertBuyerDatabase';
import TradieV4Prototype from './components/TradieV4Prototype';
import DetailedTransactionAuditView from './components/DetailedTransactionAuditView';
import ProducerLedger from './components/ProducerLedger';
import BeautifulProducerLedger from './components/BeautifulProducerLedger';
import CommissionAgentCreditDebitDB from './components/CommissionAgentCreditDebitDB';
import StaffManagement from './components/StaffManagement';
import EntityRolePermissionsPrototype from './components/EntityRolePermissionsPrototype';
import EntityRectificationDashboard from './components/EntityRectificationDashboard';
import EnhancedEntityRectificationDashboard from './components/EnhancedEntityRectificationDashboard';
import EntityRectificationDashboardV2 from './components/EntityRectificationDashboardV2';
import EntityRectificationDashboardV3 from './components/EntityRectificationDashboardV3';
import EntityRectificationDashboardRoleGated from './components/EntityRectificationDashboardRoleGated';
import StaffRolesPermissionsManagement from './components/StaffRolesPermissionsManagement';
import StaffRolesPermissionsComplete from './components/StaffRolesPermissionsComplete';
import StaffRolesPermissionsStandalone from './components/StaffRolesPermissionsStandalone';
import StaffManagementPrototype from './components/StaffManagementPrototype';
import EnhancedStaffManagement from './components/EnhancedStaffManagement';
import TradieV1Complete from './components/TradieV1Complete';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Database, TrendingUp, Shield, CheckCircle2, AlertTriangle, Star, Brain, Smartphone, FileText, Sparkles, Target, Zap, History, Users, BookOpen, UserCog, Building, Scale } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'buyer' | 'agent' | 'prototype' | 'ca-db' | 'full-app' | 'expert-db' | 'v4-proto' | 'transaction-audit' | 'producer-ledger' | 'beautiful-ledger' | 'credit-debit-db' | 'staff-management' | 'business-entity' | 'entity-rectification' | 'entity-rectification-enhanced' | 'entity-rectification-v2' | 'entity-rectification-v3' | 'entity-rectification-role-gated' | 'staff-roles-permissions' | 'staff-roles-complete' | 'staff-roles-standalone' | 'staff-prototype' | 'enhanced-staff' | 'tradie-v1-complete' | 'welcome'>('welcome');

  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="max-w-6xl w-full border-0 shadow-2xl">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <Database className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-white mb-2">TRADIE v1 Commodity Trading Platform</CardTitle>
            <CardDescription className="text-blue-100 text-base">
              Expert Auditor-Enhanced Buyer Database & Bill Authorization System
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8 pb-8 space-y-6">
            {/* System Overview */}
            <div className="text-center mb-8">
              <h2 className="text-slate-900 mb-2">Complete Back-Office Workflow System</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Comprehensive buyer management with 8-screen workflow including weighing completion, 
                2FA authorization, AI-powered risk assessment, blockchain verification, and complete audit trails.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-slate-900">Blockchain Immutability</p>
                  </div>
                  <p className="text-xs text-slate-600">NFT-anchored confirmed records on Polygon</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-slate-900">2FA Authorization</p>
                  </div>
                  <p className="text-xs text-slate-600">OTP + biometrics for high-value transactions</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-slate-900">AI Risk Assessment</p>
                  </div>
                  <p className="text-xs text-slate-600">Pattern detection & anomaly warnings</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <p className="text-sm text-slate-900">Rating System</p>
                  </div>
                  <p className="text-xs text-slate-600">Buyer & agent performance tracking</p>
                </CardContent>
              </Card>
            </div>

            {/* 8 Screen Workflow Overview */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h3 className="text-slate-900 mb-4 text-center">Complete 8-Screen Workflow</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 1</p>
                  <p className="text-sm text-slate-900">Weighing Complete</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-amber-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 2</p>
                  <p className="text-sm text-slate-900">Pending Table</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-orange-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 3</p>
                  <p className="text-sm text-slate-900">Buyer Wait</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 4</p>
                  <p className="text-sm text-slate-900">Bill Approval</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-green-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 5</p>
                  <p className="text-sm text-slate-900">Confirmed Ledger</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-red-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 6</p>
                  <p className="text-sm text-slate-900">Warnings</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-purple-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 7</p>
                  <p className="text-sm text-slate-900">Insights</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-indigo-500">
                  <p className="text-xs text-slate-500 mb-1">Screen 8+</p>
                  <p className="text-sm text-slate-900">Auditor Controls</p>
                </div>
              </div>
            </div>

            {/* Audit Principles */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Expert Auditor Principles Implemented
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>Immutability:</strong> Blockchain-anchored confirmed entries (NFT append-only)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>2FA Auth:</strong> Mandatory OTP + biometrics for ₹50K+ transactions</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>3-State Flow:</strong> Pending (yellow) → Waiting (orange) → Confirmed (green)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>AI Warnings:</strong> Pattern detection for {'>'} 3 changes/month with rating drops</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>Due Date Logic:</strong> Regulatory/Association/Agreed/Net-30/60/90/COD</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>Packaging:</strong> Fixed/Dynamic toggle with material selection</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>Measurements:</strong> Commodity-specific (200+ options)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700"><strong>Payments:</strong> Country-specific (India/US/EU/Global)</p>
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Card 
                className="border-2 hover:border-blue-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => setMode('buyer')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-100 p-4 rounded-xl">
                      <Database className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-blue-900">Buyer Back Office</CardTitle>
                  <CardDescription>
                    Complete weighing & bill approval workflow with 8 screens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Weighing completion & auto-entry
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      2FA authorization & justifications
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      AI warnings & rating system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Blockchain confirmation & ledger sync
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Auditor controls & compliance
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Launch Buyer System
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => setMode('agent')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-indigo-100 p-4 rounded-xl">
                      <TrendingUp className="w-12 h-12 text-indigo-600" />
                    </div>
                  </div>
                  <CardTitle className="text-indigo-900">Commission Agent</CardTitle>
                  <CardDescription>
                    10-module agent workflow for produce trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Producer & produce management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Buyer verification & bidding
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Quality sampling & testing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Bill discounting & transport tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      AI insights & performance analytics
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                    Launch Agent System
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-amber-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => setMode('prototype')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-amber-100 p-4 rounded-xl">
                      <Smartphone className="w-12 h-12 text-amber-600" />
                    </div>
                  </div>
                  <CardTitle className="text-amber-900">Mobile Prototype</CardTitle>
                  <CardDescription>
                    Interactive 8-screen clickable prototype
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Mobile-first design (375px)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Multi-language support (7 languages)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Voice input & animations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Complete 8-screen workflow
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Blockchain QR & token rewards
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                    Launch Prototype
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-teal-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => setMode('ca-db')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-teal-100 p-4 rounded-xl">
                      <FileText className="w-12 h-12 text-teal-600" />
                    </div>
                  </div>
                  <CardTitle className="text-teal-900">CA Buyer Database</CardTitle>
                  <CardDescription>
                    Professional Excel-like database for commission agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Excel-like table view
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Multi-brand & contact support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Auto-calculation formulas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Grok AI insights & recovery
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Justification logs & audits
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                    Launch CA Database
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-purple-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-purple-50 to-pink-50"
                onClick={() => setMode('full-app')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl shadow-lg">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-purple-900">🌟 Full 24-Screen App</CardTitle>
                  <CardDescription className="text-purple-700">
                    Complete TRADIE platform with all roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      8 Producer screens (listings, weighing, storage)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      8 Buyer screens (browse, orders, quality)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      4 Agent screens (ledger, scoring, advances)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      4 Admin screens (oversight, QR, analytics)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Multi-lang, voice, blockchain, tokens
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                    Launch Full App 🚀
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-orange-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-orange-50 to-amber-50"
                onClick={() => setMode('expert-db')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-4 rounded-xl shadow-lg">
                      <Target className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-orange-900">🎯 Expert Buyer DB</CardTitle>
                  <CardDescription className="text-orange-700">
                    Professional 5-screen wireframe system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Advanced filter bar (brand/status/commodity/payment)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Complete payment expansion (6 methods + proofs)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Overdue controls & reminders
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Grok AI behavior pattern detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Auditor justification history
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg">
                    Launch Expert DB 🎯
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-cyan-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-cyan-50 to-teal-50"
                onClick={() => setMode('v4-proto')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-4 rounded-xl shadow-lg">
                      <Zap className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-cyan-900">⚡ TRADIE v4.0</CardTitle>
                  <CardDescription className="text-cyan-700">
                    Multi-platform responsive prototype
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Mobile (360×800) + Web (1440×1024)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      7 complete workflows (DB/Auth/Bill/Finance/Audit/Analytics)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      2FA authorization + AI insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Country-specific payments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Dark mode + AI assistant
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg">
                    Launch v4.0 ⚡
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50"
                onClick={() => setMode('transaction-audit')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl shadow-lg">
                      <History className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-indigo-900">📋 Transaction Audit</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Detailed back-office view with audit trail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Large card layout with expandable sections
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Complete commodity & pricing breakdown
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Payment methods with receipt uploads
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Overdue tracking & reminders
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Complete audit trail & AI insights
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                    Launch Audit View 📋
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-pink-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-pink-50 to-rose-50"
                onClick={() => setMode('beautiful-ledger')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-xl shadow-lg">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-pink-900">✨ Beautiful Ledger (NEW!)</CardTitle>
                  <CardDescription className="text-pink-700">
                    Kid-friendly Producer Ledger with PostgreSQL schema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎨 Colorful, game-like interface
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🤖 Friendly AI robot helper
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      💰 Credits, debits, expenses, sales
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🚦 Traffic light risk system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📊 Expert PostgreSQL schema
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg">
                    Launch Beautiful Ledger ✨
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-emerald-50 to-green-50"
                onClick={() => setMode('producer-ledger')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-4 rounded-xl shadow-lg">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-emerald-900">🌾 Producer Ledger</CardTitle>
                  <CardDescription className="text-emerald-700">
                    AI-powered producer credit & transaction tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Credit/Debit/Sale/Expense tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      AI risk ranking & alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      OTP-based validation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Role-based authorization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Auto-calculated balances
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg">
                    Launch Producer Ledger 🌾
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-amber-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-amber-50 to-yellow-50"
                onClick={() => setMode('credit-debit-db')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-4 rounded-xl shadow-lg">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-amber-900">📖 Credit/Debit Book</CardTitle>
                  <CardDescription className="text-amber-700">
                    Child-friendly double-entry accounting ledger
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Simple like school notebook
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Grok AI smart helper (friendly tips)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Auto-calculation (like calculator)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      RBAC staff roles & permissions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Country-specific payment methods
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg">
                    Launch Credit/Debit Book 📖
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-slate-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-slate-50 to-gray-50"
                onClick={() => setMode('staff-management')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-slate-500 to-gray-600 p-4 rounded-xl shadow-lg">
                      <UserCog className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">👥 Staff Management</CardTitle>
                  <CardDescription className="text-slate-700">
                    Internal role & permission assignments (Agent-only)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Separate from customer data (producers)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Multi-role assignment (10+ roles)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      5-tier permission system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Village-based staff allocation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Active/Inactive/Pending status tracking
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg">
                    Launch Staff Management 👥
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-violet-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-violet-50 to-purple-50"
                onClick={() => setMode('business-entity')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-4 rounded-xl shadow-lg">
                      <Building className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-violet-900">🏢 Business Entity (8-SCREEN PROTOTYPE!)</CardTitle>
                  <CardDescription className="text-violet-700">
                    Gold gradient aesthetic with multi-language & voice input
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      8 entity types: Individual, Partnership, Co-op, Trust, Pvt Ltd
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Role-based permissions with OTP/2FA authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Data rectification, suggestions, & audit trails
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Gold shimmer buttons, voice input, multi-lang (EN/HI/TE)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Indian Acts compliant (Companies Act, Partnership Act, etc.)
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg">
                    Launch Business Entity 🏢
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-[#D4AF37] cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-amber-50 to-yellow-50"
                onClick={() => setMode('entity-rectification')}
              >
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-[#D4AF37] to-amber-600 p-4 rounded-xl shadow-lg">
                      <Scale className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-amber-900">⚖️ Entity Rectification & Control</CardTitle>
                  <CardDescription className="text-amber-700">
                    Post-registration control with 3-change limit & compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Immutable entity ID with change tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      2-member OTP approval for all changes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Share-based permission matrix
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      KYC re-verification after 3rd change
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Complete audit trail with PDF certificates
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
                    Launch Rectification Dashboard ⚖️
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-[#F4D03F] cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-yellow-50 to-amber-50 relative overflow-hidden"
                onClick={() => setMode('entity-rectification-enhanced')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">✨ ENHANCED</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-[#F4D03F] to-[#F39C12] p-4 rounded-xl shadow-lg">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-amber-900">✨ Enhanced Rectification (CS/CA/Advocate)</CardTitle>
                  <CardDescription className="text-amber-700">
                    Expert-refined with blockchain, voice, multi-lang, Grok AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔗 Blockchain QR (Polygon locked immutable ID)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎙️ Voice input on all text fields (mic bubble)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🌐 Multi-language (EN/HI/TE toggle)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🧠 Grok AI insights (MSME fast-track, GDPR, compliance)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ✨ Gold shimmer animations, OTP pulse rings, spring expand
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-[#F4D03F] to-[#F39C12] hover:from-[#F39C12] hover:to-[#F4D03F] text-slate-900 shadow-lg">
                    Launch Enhanced Dashboard ✨
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-[#D4AF37] cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] relative overflow-hidden"
                onClick={() => setMode('entity-rectification-v2')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">🔥 V2 NEW</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] p-4 rounded-xl shadow-lg">
                      <Scale className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">🔥 Rectification V2 (TRADIE Integrated)</CardTitle>
                  <CardDescription className="text-slate-700">
                    Complete integration with TRADIE design system & multi-entity support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🏢 Multi-entity selector (Partnership, Family, Pvt Ltd)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎨 TRADIE color palette (ivory #F8F9FA, gold #D4AF37)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📱 Responsive (mobile 360×800, web 1440×1024)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🌐 Multi-language toggle (EN/HI/TE) + voice input
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🧠 AI insights + blockchain QR + tabbed interface
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-[#F4D03F] hover:to-[#D4AF37] text-slate-900 shadow-lg">
                    Launch V2 Dashboard 🔥
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden"
                onClick={() => setMode('entity-rectification-v3')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">⚡ V3 BEST</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-xl shadow-lg">
                      <Scale className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">⚡ Rectification V3 (Self-Contained)</CardTitle>
                  <CardDescription className="text-slate-700">
                    Zero dependencies - Custom components only, ultra-lightweight
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎨 Custom helper components (no ShadCN deps)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎯 TRADIE palette + emoji icons (ultra-clean UI)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🌐 Multi-language (EN/HI/TE) with instant toggle
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎤 Voice input + blockchain QR + AI insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ⚡ Smallest bundle size - production-ready
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                    Launch V3 Self-Contained ⚡
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-violet-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden"
                onClick={() => setMode('entity-rectification-role-gated')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">🔒 PRODUCTION</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-4 rounded-xl shadow-lg">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">🔒 Role-Based Gating (Expert)</CardTitle>
                  <CardDescription className="text-slate-700">
                    Production-grade governance with shareholding + privileged roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎯 Shareholding thresholds (10% min to initiate/approve)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      👑 Privileged roles bypass (Director, CS, CFO, Karta)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔐 Combined approval share validation (20% min)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎭 "Acting As" role selector (preview gating live)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🚫 Lock icons + tooltips for denied actions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ✅ Eligible approver dropdowns (auto-filtered)
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg">
                    Launch Role-Gated Dashboard 🔒
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden"
                onClick={() => setMode('staff-roles-complete')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">🎯 COMPREHENSIVE</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-4 rounded-xl shadow-lg">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">👥 Staff Roles & Permissions (Complete)</CardTitle>
                  <CardDescription className="text-slate-700">
                    Full-featured staff management with table view, bulk ops & AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📊 Table view with search, filter, sort (by name/date/status)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ✅ Bulk role assignment & deletion with confirmation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔐 2FA for critical operations (Manager, Payment roles)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🤖 AI conflict detection (role incompatibility warnings)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ⚡ Auto-generated permissions based on roles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📩 Multi-channel confirmation (SMS/WhatsApp/Email/Arattai)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📈 Role management screen + audit log + analytics
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white shadow-lg">
                    Launch Complete Staff System 👥
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden"
                onClick={() => setMode('staff-roles-standalone')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">✨ CLEAN + LIGHTWEIGHT</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-xl shadow-lg">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">✨ Standalone Staff Management</CardTitle>
                  <CardDescription className="text-slate-700">
                    Zero dependencies • AI insights • Dual OTP verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎨 Pure React + Tailwind (no external libs)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🤖 Inline AI insights with admin visibility toggle
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔐 Dual OTP verification (2 channels for security)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📱 Multi-channel links (SMS/WhatsApp/Arattai/Email)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      👥 7 predefined roles with auto-permission assignment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📊 Smart insights: Role overlap • Permission conflicts • Pending verifications
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                    Launch Standalone Version ✨
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-[#F4D03F] cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden"
                onClick={() => setMode('staff-prototype')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white">📱 8-SCREEN PROTOTYPE</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-[#F4D03F] to-[#F39C12] p-4 rounded-xl shadow-lg">
                      <Smartphone className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">📱 Staff Management Prototype (8 Screens)</CardTitle>
                  <CardDescription className="text-slate-700">
                    Mobile-first clickable prototype with Gold shimmer aesthetic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📱 Mobile-first (375px) with Gold #F4D03F shimmer buttons
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎙️ Voice mic bubble on all inputs (tap to speak)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🌐 Multi-language toggles (EN/HI/TE)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🎯 Multi-role assignment with AI suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📩 QR code + multi-channel share (SMS/WhatsApp/Arattai/Mail)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔐 6-digit OTP rings with spring animations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🤖 AI insights dashboard (Grok-style recommendations)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ⚡ 8 complete flows: Add → Assign → Permissions → Confirm → Insights → View → Delete → Operations
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-[#F4D03F] to-[#F39C12] hover:from-[#F39C12] hover:to-[#F4D03F] text-white shadow-lg">
                    Launch 8-Screen Prototype 📱
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 hover:border-[#27AE60] cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden"
                onClick={() => setMode('enhanced-staff')}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">🎯 REGULATORY + WORKFLOW</Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-xl shadow-lg">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900">🛡️ Enhanced Staff Management (6 Screens)</CardTitle>
                  <CardDescription className="text-slate-700">
                    PDF-integrated regulatory compliance + workflow automation + AI insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔍 4-tier regulatory monitoring (Yard → District → State → Central)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📋 Enhanced roles: Security/Watchman (QR scans), Inventory (OTP handoff), Sample Mover (transfers)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ⚖️ Bill OTP/auth with delay tracking (yellow/red alerts)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🏪 Storage facility management (rent/lease, delivery requests, post-trade transfers)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🤖 AI insights: Tax compliance alerts, repeat cancellations, credit requests, KYC tier verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      🔐 RBAC: View/Edit/Suggest/Rectify permissions with justification logs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      📊 Grok Risk Ranking (1-10), auto-generated Staff ID, village filters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ⚡ 6 screens: Add → Multi-Role Assign → Permissions → Link Share (QR+OTP) → AI Insights → Delete/Revoke
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                    Launch Enhanced Staff Management 🛡️
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Footer Info */}
            <div className="text-center text-sm text-slate-500 pt-4 border-t">
              <p>
                <strong>TRADIE v1</strong> • Auditor-Enhanced System • 
                Blockchain Integration • AI Risk Assessment • Complete Compliance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'prototype') {
    return <BuyerPrototype />;
  }

  if (mode === 'ca-db') {
    return <CommissionAgentBuyerDB />;
  }

  if (mode === 'full-app') {
    return <TradieAppPrototype />;
  }

  if (mode === 'expert-db') {
    return <ExpertBuyerDatabase />;
  }

  if (mode === 'v4-proto') {
    return <TradieV4Prototype />;
  }

  if (mode === 'transaction-audit') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <DetailedTransactionAuditView 
          billId={BigInt(1)} 
          onClose={() => setMode('welcome')}
        />
      </div>
    );
  }

  if (mode === 'producer-ledger') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <ProducerLedger />
      </div>
    );
  }

  if (mode === 'beautiful-ledger') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <BeautifulProducerLedger />
      </div>
    );
  }

  if (mode === 'credit-debit-db') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <CommissionAgentCreditDebitDB />
      </div>
    );
  }

  if (mode === 'staff-management') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <StaffManagement />
      </div>
    );
  }

  if (mode === 'business-entity') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <EntityRolePermissionsPrototype />
      </div>
    );
  }

  if (mode === 'entity-rectification') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
        </div>
        <EntityRectificationDashboard />
      </div>
    );
  }

  if (mode === 'entity-rectification-enhanced') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            ✨ Enhanced CS/CA/Advocate Version
          </Badge>
        </div>
        <EnhancedEntityRectificationDashboard />
      </div>
    );
  }

  if (mode === 'entity-rectification-v2') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-slate-900">
            🔥 V2 - TRADIE Integrated
          </Badge>
        </div>
        <EntityRectificationDashboardV2 />
      </div>
    );
  }

  if (mode === 'entity-rectification-v3') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            ⚡ V3 - Self-Contained
          </Badge>
        </div>
        <EntityRectificationDashboardV3 />
      </div>
    );
  }

  if (mode === 'entity-rectification-role-gated') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
            🔒 Role-Based Gating (Production)
          </Badge>
        </div>
        <EntityRectificationDashboardRoleGated />
      </div>
    );
  }

  if (mode === 'staff-roles-permissions') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
            👥 Multi-Role Staff Management
          </Badge>
        </div>
        <StaffRolesPermissionsManagement />
      </div>
    );
  }

  if (mode === 'staff-roles-complete') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
            🎯 Comprehensive Staff Management
          </Badge>
        </div>
        <StaffRolesPermissionsComplete />
      </div>
    );
  }

  if (mode === 'staff-roles-standalone') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            ✨ Standalone (AI Insights + Dual OTP)
          </Badge>
        </div>
        <StaffRolesPermissionsStandalone />
      </div>
    );
  }

  if (mode === 'enhanced-staff') {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            🛡️ Regulatory + Workflow Integration
          </Badge>
        </div>
        <EnhancedStaffManagement />
      </div>
    );
  }

  if (mode === 'staff-prototype') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMode('welcome')}
            className="gap-2 bg-white shadow-lg"
            size="sm"
          >
            ← Back to Welcome
          </Button>
          <Badge className="bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white">
            📱 8-Screen Mobile Prototype
          </Badge>
        </div>
        <StaffManagementPrototype />
      </div>
    );
  }

  if (mode === 'tradie-v1-complete') {
    return <TradieV1Complete onBack={() => setMode('welcome')} />;
  }

  return (
    <div className="min-h-screen">
      {/* Mode Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 flex-wrap max-w-[700px]">
        <Button
          variant="outline"
          onClick={() => setMode('welcome')}
          className="gap-2 bg-white shadow-lg"
          size="sm"
        >
          ← Welcome
        </Button>
        <Button
          variant={mode === 'buyer' ? 'default' : 'outline'}
          onClick={() => setMode('buyer')}
          className="gap-2"
          size="sm"
        >
          <Database className="w-4 h-4" />
          Buyer
        </Button>
        <Button
          variant={mode === 'agent' ? 'default' : 'outline'}
          onClick={() => setMode('agent')}
          className="gap-2"
          size="sm"
        >
          <TrendingUp className="w-4 h-4" />
          Agent
        </Button>
        <Button
          variant={mode === 'prototype' ? 'default' : 'outline'}
          onClick={() => setMode('prototype')}
          className="gap-2"
          size="sm"
        >
          <Smartphone className="w-4 h-4" />
          Prototype
        </Button>
        <Button
          variant={mode === 'ca-db' ? 'default' : 'outline'}
          onClick={() => setMode('ca-db')}
          className="gap-2"
          size="sm"
        >
          <FileText className="w-4 h-4" />
          CA DB
        </Button>
        <Button
          variant={mode === 'full-app' ? 'default' : 'outline'}
          onClick={() => setMode('full-app')}
          className="gap-2"
          size="sm"
        >
          <Sparkles className="w-4 h-4" />
          Full App
        </Button>
        <Button
          variant={mode === 'expert-db' ? 'default' : 'outline'}
          onClick={() => setMode('expert-db')}
          className="gap-2"
          size="sm"
        >
          <Target className="w-4 h-4" />
          Expert DB
        </Button>
        <Button
          variant={mode === 'v4-proto' ? 'default' : 'outline'}
          onClick={() => setMode('v4-proto')}
          className="gap-2"
          size="sm"
        >
          <Zap className="w-4 h-4" />
          v4.0
        </Button>
        <Button
          variant={mode === 'transaction-audit' ? 'default' : 'outline'}
          onClick={() => setMode('transaction-audit')}
          className="gap-2"
          size="sm"
        >
          <History className="w-4 h-4" />
          Audit
        </Button>
        <Button
          variant={mode === 'producer-ledger' ? 'default' : 'outline'}
          onClick={() => setMode('producer-ledger')}
          className="gap-2"
          size="sm"
        >
          <Users className="w-4 h-4" />
          Ledger
        </Button>
        <Button
          variant={mode === 'beautiful-ledger' ? 'default' : 'outline'}
          onClick={() => setMode('beautiful-ledger')}
          className="gap-2"
          size="sm"
        >
          <Star className="w-4 h-4" />
          Beautiful
        </Button>
        <Button
          variant={mode === 'credit-debit-db' ? 'default' : 'outline'}
          onClick={() => setMode('credit-debit-db')}
          className="gap-2"
          size="sm"
        >
          <BookOpen className="w-4 h-4" />
          Credit/Debit
        </Button>
        <Button
          variant={mode === 'staff-management' ? 'default' : 'outline'}
          onClick={() => setMode('staff-management')}
          className="gap-2"
          size="sm"
        >
          <UserCog className="w-4 h-4" />
          Staff
        </Button>
        <Button
          variant={mode === 'business-entity' ? 'default' : 'outline'}
          onClick={() => setMode('business-entity')}
          className="gap-2"
          size="sm"
        >
          <Building className="w-4 h-4" />
          Entity
        </Button>
        <Button
          variant={mode === 'entity-rectification' ? 'default' : 'outline'}
          onClick={() => setMode('entity-rectification')}
          className="gap-2"
          size="sm"
        >
          <Scale className="w-4 h-4" />
          Rectification
        </Button>
      </div>

      {mode === 'buyer' && <BuyerBackOffice />}
      {mode === 'agent' && <CommissionAgentApp />}
    </div>
  );
}
