import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Brain, TrendingUp, TrendingDown, Download, Wallet, BarChart3, PieChart,
  AlertTriangle, CheckCircle2, Clock, DollarSign
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BuyerInsightsDashboard() {
  const buyerChangeData = [
    { name: 'Sunita R.', changes: 5, risk: 'medium' },
    { name: 'Amit P.', changes: 3, risk: 'medium' },
    { name: 'Rajesh K.', changes: 0, risk: 'low' },
    { name: 'Priya S.', changes: 0, risk: 'low' },
  ];

  const agentChangeData = [
    { name: 'Agent C', changes: 8, risk: 'high' },
    { name: 'Agent A', changes: 2, risk: 'low' },
    { name: 'Agent B', changes: 0, risk: 'low' },
  ];

  const paymentMethodData = [
    { name: 'Bank Wire', value: 45, color: '#3b82f6' },
    { name: 'UPI', value: 30, color: '#10b981' },
    { name: 'Cheque', value: 15, color: '#f59e0b' },
    { name: 'Cash', value: 10, color: '#8b5cf6' },
  ];

  const insights = {
    buyerPatterns: {
      totalBuyers: 145,
      repeatedChanges: 2,
      riskMedium: 2,
      riskHigh: 0,
      avgChanges: 0.55,
      recommendation: 'Lock preferences for stability on future transactions'
    },
    agentPatterns: {
      totalAgents: 12,
      highRisk: 1,
      mediumRisk: 0,
      avgDisputeRate: 8.3,
      recommendation: 'Additional training for Agent C; suggest alternatives for new buyers'
    },
    financial: {
      totalPayables: 12458600,
      pendingAmount: 234000,
      avgTransactionValue: 85850,
      dueTodayCount: 3
    },
    tradieWallet: {
      balance: 1250,
      earnedToday: 45,
      monthlyTotal: 380
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Insights Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Pattern analysis, predictions, and recommendations</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Audit Report
        </Button>
      </div>

      {/* Key Insights */}
      <Alert className="border-purple-500 bg-purple-50 border-2">
        <Brain className="h-5 w-5 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <div className="space-y-2">
            <p>
              <strong>Buyer Patterns:</strong> {insights.buyerPatterns.repeatedChanges} buyers with 3+ changes/month (Medium Risk). 
              Average {insights.buyerPatterns.avgChanges} changes per buyer.
            </p>
            <p>
              <strong>Agent Patterns:</strong> Agent C shows {agentChangeData[0].changes} disputes (High Risk - 15% dispute rate). 
              Cross-warning sent to associated buyers.
            </p>
            <p className="text-sm">
              <strong>Suggestion:</strong> Lock buyer preferences for stability. Additional agent training recommended.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Tradie Wallet */}
      <Card className="border-l-4 border-l-[#F4D03F] bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-10 h-10 text-[#F4D03F]" />
              <div>
                <p className="text-sm text-slate-600">Tradie Token Balance</p>
                <p className="text-slate-900">{insights.tradieWallet.balance} Tokens</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="text-slate-500">Today</p>
                <Badge className="bg-[#F4D03F] text-[#4A4A4A] mt-1">+{insights.tradieWallet.earnedToday}</Badge>
              </div>
              <div className="text-center">
                <p className="text-slate-500">This Month</p>
                <Badge className="bg-[#F4D03F] text-[#4A4A4A] mt-1">+{insights.tradieWallet.monthlyTotal}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-slate-600">Total Payables</p>
            </div>
            <p className="text-slate-900">₹{(insights.financial.totalPayables / 1000000).toFixed(2)}M</p>
            <Badge className="bg-blue-500 text-white mt-2 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-slate-600">Pending Amount</p>
            </div>
            <p className="text-slate-900">₹{(insights.financial.pendingAmount / 1000).toFixed(0)}K</p>
            <Badge className="bg-amber-500 text-white mt-2 text-xs">
              {insights.financial.dueTodayCount} due today
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-xs text-slate-600">Avg Transaction</p>
            </div>
            <p className="text-slate-900">₹{(insights.financial.avgTransactionValue / 1000).toFixed(0)}K</p>
            <Badge className="bg-green-500 text-white mt-2 text-xs">Healthy</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-xs text-slate-600">Risk Alerts</p>
            </div>
            <p className="text-slate-900">{insights.buyerPatterns.riskMedium + insights.agentPatterns.highRisk}</p>
            <Badge className="bg-red-500 text-white mt-2 text-xs">
              {insights.agentPatterns.highRisk} High
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buyer Changes Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Repeat Alerts: Buyer vs Changes
            </CardTitle>
            <CardDescription>Number of changes by buyer (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={buyerChangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="changes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {buyerChangeData.map((buyer, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{buyer.name}</span>
                  <Badge className={
                    buyer.risk === 'high' ? 'bg-red-500' :
                    buyer.risk === 'medium' ? 'bg-amber-500' :
                    'bg-green-500'
                  }>
                    {buyer.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Total Payables by Payment Method
            </CardTitle>
            <CardDescription>Distribution of payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {paymentMethodData.map((method, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: method.color }}></div>
                  <span className="text-slate-600">{method.name}</span>
                  <span className="text-slate-900">{method.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agent Performance & Dispute Rate</CardTitle>
          <CardDescription>Cross-analysis of agent changes and risk levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agentChangeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="changes" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {agentChangeData.map((agent, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div>
                  <p className="text-sm text-slate-900">{agent.name}</p>
                  <p className="text-xs text-slate-600">{agent.changes} disputes</p>
                </div>
                <Badge className={
                  agent.risk === 'high' ? 'bg-red-500 animate-pulse' :
                  agent.risk === 'medium' ? 'bg-amber-500' :
                  'bg-green-500'
                }>
                  {agent.risk}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <Alert className="border-blue-500 bg-blue-50">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Buyer Stability:</strong> {insights.buyerPatterns.recommendation}
            </AlertDescription>
          </Alert>

          <Alert className="border-amber-500 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Agent Training:</strong> {insights.agentPatterns.recommendation}
            </AlertDescription>
          </Alert>

          <Alert className="border-green-500 bg-green-50">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <strong>Financial Health:</strong> Average transaction value stable at ₹{(insights.financial.avgTransactionValue / 1000).toFixed(0)}K. Payment diversification healthy.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2">
          <Download className="w-4 h-4" />
          Export PDF Report
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Download className="w-4 h-4" />
          Export CSV Data
        </Button>
        <Button className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700">
          <Brain className="w-4 h-4" />
          Generate AI Analysis
        </Button>
      </div>
    </div>
  );
}
