/**
 * Beautiful Producer Ledger Component
 * Kid-friendly design with colorful icons and simple language
 * Based on PostgreSQL schema with expert-level accounting
 * 
 * IMPORTANT: Producers are CUSTOMERS, not staff members
 * Staff roles are managed separately in the Staff Management module
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Download,
  Eye,
  Sparkles,
  PiggyBank,
  ShoppingCart,
  Wallet,
  Receipt,
  Info,
} from 'lucide-react';
import {
  generateMockLedgerEntries,
  convertToKidFriendly,
  generateAIInsights,
  calculateLedgerSummary,
  mockProducers,
  mockAIScores,
} from '../services/producer-ledger-mock-data';
import type { ProducerLedgerEntry, KidFriendlyLedgerEntry, AIInsightMessage } from '../types/producer-ledger';

export default function BeautifulProducerLedger() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProducer, setSelectedProducer] = useState<number | null>(null);

  // Load data
  const ledgerEntries = useMemo(() => generateMockLedgerEntries(), []);
  const aiInsights = useMemo(() => generateAIInsights(ledgerEntries, mockAIScores), [ledgerEntries]);
  const summary = useMemo(() => calculateLedgerSummary(ledgerEntries), [ledgerEntries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return ledgerEntries.filter((entry) => {
      const producer = mockProducers.find((p) => p.id === entry.producerUserId);
      const matchesSearch =
        producer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producer?.village?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVillage = selectedVillage === 'all' || entry.village === selectedVillage;
      const matchesType = selectedType === 'all' || entry.entryType === selectedType;
      const matchesProducer = selectedProducer === null || entry.producerUserId === selectedProducer;
      return matchesSearch && matchesVillage && matchesType && matchesProducer;
    });
  }, [ledgerEntries, searchTerm, selectedVillage, selectedType, selectedProducer]);

  // Get unique villages
  const villages = useMemo(() => {
    const uniqueVillages = new Set(ledgerEntries.map((e) => e.village).filter(Boolean));
    return Array.from(uniqueVillages);
  }, [ledgerEntries]);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(to bottom, #F7FAFC, #D9F2FF)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🌾</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Producer Ledger
            </span>
            <span className="text-5xl">💰</span>
          </h1>
          <p className="text-gray-600">
            <span className="text-2xl mr-2">📊</span>
            Track all your customer (producer) money records easily!
            <span className="text-2xl ml-2">✨</span>
          </p>
          
          {/* Clarifying Banner - Producers are Customers */}
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-full shadow-sm">
            <span className="text-xl">💡</span>
            <span className="text-sm font-medium text-blue-900">
              Producers are your valued customers - not staff members
            </span>
            <Info className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        {/* AI Robot Helper Banner */}
        <Card className="border-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <span className="text-3xl">🤖</span>
              AI Robot Helper Says:
              <span className="text-2xl">💬</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight, idx) => (
                <Alert
                  key={idx}
                  className={`border-2 ${
                    insight.type === 'danger'
                      ? 'bg-red-50 border-red-300'
                      : insight.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-300'
                      : insight.type === 'success'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{insight.icon}</span>
                    <div>
                      <div className="font-bold mb-1">{insight.title}</div>
                      <AlertDescription className="text-sm">{insight.message}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <DollarSign className="h-4 w-4" />
                Money Given 💰
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">₹{summary.totalCredits.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Total advances + sales</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
                <TrendingDown className="h-4 w-4" />
                Money Taken 💸
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">₹{summary.totalDebits.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Total repayments + expenses</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                <PiggyBank className="h-4 w-4" />
                Money Owed 🐷
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">₹{summary.netBalance.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">What producers still owe</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
                <Users className="h-4 w-4" />
                Open Advances ⏳
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{summary.openAdvances}</div>
              <p className="text-xs text-gray-600 mt-1">Waiting for repayment</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-2 border-gray-200 mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="🔍 Search by name or village..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base border-2 border-gray-300 focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Village Filter */}
              <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-400 transition-colors">
                  <span className="mr-2">🏘️</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Villages</SelectItem>
                  {villages.map((village) => (
                    <SelectItem key={village} value={village}>
                      {village}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-400 transition-colors">
                  <span className="mr-2">💼</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ADVANCE">💰 Advances</SelectItem>
                  <SelectItem value="SALE_GROSS">💵 Sales</SelectItem>
                  <SelectItem value="REPAYMENT">💸 Repayments</SelectItem>
                  <SelectItem value="EXPENSE">🧾 Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-base gap-2">
              <span className="text-xl">📊</span>
              All Records
            </TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-base gap-2">
              <span className="text-xl">💰</span>
              Money Given
            </TabsTrigger>
            <TabsTrigger value="debits" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-base gap-2">
              <span className="text-xl">💸</span>
              Money Taken
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-base gap-2">
              <span className="text-xl">🤖</span>
              AI Tips
            </TabsTrigger>
          </TabsList>

          {/* All Records Tab */}
          <TabsContent value="all">
            <LedgerEntriesList entries={filteredEntries} />
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits">
            <LedgerEntriesList
              entries={filteredEntries.filter((e) => e.amount > 0)}
              title="Money Given to Producers 💰"
            />
          </TabsContent>

          {/* Debits Tab */}
          <TabsContent value="debits">
            <LedgerEntriesList
              entries={filteredEntries.filter((e) => e.amount < 0)}
              title="Money Received Back 💸"
            />
          </TabsContent>

          {/* AI Tips Tab */}
          <TabsContent value="ai">
            <AITipsPanel insights={aiInsights} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ================
// Ledger Entries List Component
// ================

function LedgerEntriesList({ entries, title }: { entries: ProducerLedgerEntry[]; title?: string }) {
  const [selectedEntry, setSelectedEntry] = useState<ProducerLedgerEntry | null>(null);

  if (entries.length === 0) {
    return (
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardContent className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-gray-600 text-xl">No records found!</p>
          <p className="text-gray-500 mt-2">Try changing your search or filters</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2 mb-4">
          <span>{title}</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {entries.length}
          </Badge>
        </h2>
      )}

      <div className="grid grid-cols-1 gap-4">
        {entries.map((entry, idx) => (
          <LedgerEntryCard key={idx} entry={entry} onClick={() => setSelectedEntry(entry)} />
        ))}
      </div>

      {/* Detail Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <span className="text-3xl">{convertToKidFriendly(selectedEntry).icon}</span>
                Transaction Details
              </DialogTitle>
              <DialogDescription>
                View complete transaction information and AI analysis
              </DialogDescription>
            </DialogHeader>
            <LedgerEntryDetails entry={selectedEntry} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ================
// Ledger Entry Card
// ================

function LedgerEntryCard({ entry, onClick }: { entry: ProducerLedgerEntry; onClick: () => void }) {
  const kidFriendly = convertToKidFriendly(entry);
  const producer = mockProducers.find((p) => p.id === entry.producerUserId);
  const aiScore = mockAIScores.find((s) => s.producerUserId === entry.producerUserId);

  return (
    <Card
      className={`border-4 ${kidFriendly.color} hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left: Icon and Type */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">{kidFriendly.icon}</div>
            <div>
              <div className="font-bold text-lg">{kidFriendly.label}</div>
              <div className="text-sm text-gray-600">{kidFriendly.description}</div>
            </div>
          </div>

          {/* Middle: Producer Info (Customer - No Staff Roles) */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">👤</span>
              <span className="font-bold">{producer?.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">📍</span>
              <span>{entry.village}</span>
            </div>
            {aiScore && (
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`${
                    aiScore.riskRank <= 2
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : aiScore.riskRank <= 3
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}
                >
                  {aiScore.riskRank <= 2 ? '🟢 Safe' : aiScore.riskRank <= 3 ? '🟡 Watch' : '🔴 Alert'}
                </Badge>
              </div>
            )}
          </div>

          {/* Right: Amount and Balance */}
          <div className="flex flex-col justify-center text-right">
            <div className="text-sm text-gray-600 mb-1">Amount:</div>
            <div className={`text-2xl font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {entry.amount > 0 ? '+' : ''}₹{Math.abs(entry.amount).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Balance After: <span className="font-bold">₹{entry.runningBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Far Right: Date and Status */}
          <div className="flex flex-col justify-center items-end">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{entry.txnDate.toLocaleDateString()}</span>
            </div>
            <div className="text-4xl mb-2">{kidFriendly.status}</div>
            <div className="text-3xl">{kidFriendly.safetyLevel}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ================
// Ledger Entry Details
// ================

function LedgerEntryDetails({ entry }: { entry: ProducerLedgerEntry }) {
  const kidFriendly = convertToKidFriendly(entry);
  const producer = mockProducers.find((p) => p.id === entry.producerUserId);
  const aiScore = mockAIScores.find((s) => s.producerUserId === entry.producerUserId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-4 rounded-lg border-2 ${kidFriendly.color}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{kidFriendly.icon}</span>
          <div>
            <div className="text-xl font-bold">{kidFriendly.label}</div>
            <div className="text-sm text-gray-600">{kidFriendly.description}</div>
          </div>
        </div>
      </div>

      {/* Producer Info (Customer Information Only) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">👤 Producer (Customer)</div>
          <div className="font-bold">{producer?.fullName}</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">📍 Village</div>
          <div className="font-bold">{entry.village}</div>
        </div>
      </div>

      {/* Amount Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-sm text-gray-600 mb-1">💰 Amount</div>
          <div className={`text-2xl font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {entry.amount > 0 ? '+' : ''}₹{Math.abs(entry.amount).toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-sm text-gray-600 mb-1">🐷 Balance After</div>
          <div className="text-2xl font-bold text-purple-600">₹{entry.runningBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Date and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <div className="text-sm text-gray-600 mb-1">📅 Date</div>
          <div className="font-bold">{entry.txnDate.toLocaleDateString()}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-sm text-gray-600 mb-1">Status</div>
          <div className="text-3xl">{kidFriendly.status}</div>
        </div>
      </div>

      {/* AI Score */}
      {aiScore && (
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🤖</span>
            <span className="font-bold text-lg">AI Robot Analysis:</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <div className="text-sm text-gray-600">Risk Level:</div>
              <div className="text-xl font-bold">
                {aiScore.riskRank <= 2 ? '🟢 Safe' : aiScore.riskRank <= 3 ? '🟡 Careful' : '🔴 Alert'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Risk Score:</div>
              <div className="text-xl font-bold">{aiScore.riskScore}/100</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Pending:</div>
              <div className="text-xl font-bold">₹{aiScore.pendingCredits.toLocaleString()}</div>
            </div>
          </div>
          {aiScore.comment && (
            <div className="text-sm bg-white p-3 rounded border border-purple-200">{aiScore.comment}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ================
// AI Tips Panel
// ================

function AITipsPanel({ insights }: { insights: AIInsightMessage[] }) {
  return (
    <div className="space-y-4">
      <Card className="border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-4xl">🤖</span>
            AI Robot Helper - Smart Tips & Alerts
            <span className="text-4xl">✨</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Your friendly AI assistant analyzing all the data to help you!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <Alert
                key={idx}
                className={`border-4 ${
                  insight.type === 'danger'
                    ? 'bg-red-50 border-red-300'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-300'
                    : insight.type === 'success'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-blue-50 border-blue-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{insight.icon}</span>
                  <div className="flex-1">
                    <div className="text-xl font-bold mb-2">{insight.title}</div>
                    <AlertDescription className="text-lg">{insight.message}</AlertDescription>
                    <Badge
                      variant="outline"
                      className={`mt-3 ${
                        insight.priority === 'high'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : insight.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      {insight.priority === 'high' ? '🚨 High Priority' : insight.priority === 'medium' ? '⚠️ Medium' : '💡 Info'}
                    </Badge>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Score Details */}
      <Card className="border-2 border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Producer Risk Scores
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-300">
              Customer Status Only - No Staff Roles
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAIScores.map((score) => {
              const producer = mockProducers.find((p) => p.id === score.producerUserId);
              return (
                <div
                  key={score.id}
                  className={`p-4 rounded-lg border-2 ${
                    score.riskRank <= 2
                      ? 'bg-green-50 border-green-200'
                      : score.riskRank <= 3
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <span className="font-bold text-lg">{producer?.fullName}</span>
                      <Badge
                        variant="outline"
                        className={`${
                          score.riskRank <= 2
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : score.riskRank <= 3
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {score.riskRank <= 2 ? '🟢 Safe' : score.riskRank <= 3 ? '🟡 Watch' : '🔴 Alert'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Score:</div>
                      <div className="text-xl font-bold">{score.riskScore}/100</div>
                    </div>
                  </div>
                  {score.comment && <div className="text-sm text-gray-700 mt-2">{score.comment}</div>}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="bg-white p-2 rounded border">
                      <span className="text-gray-600">Pending: </span>
                      <span className="font-bold">₹{score.pendingCredits.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <span className="text-gray-600">Overdue: </span>
                      <span className="font-bold">₹{score.overdueCredits.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
