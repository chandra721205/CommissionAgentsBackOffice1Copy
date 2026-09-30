import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, TrendingUp, AlertTriangle, DollarSign, Download } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AgentAIInsightsProps {
  onNavigate: (screen: string) => void;
}

export function AgentAIInsights({ onNavigate }: AgentAIInsightsProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const priceData = [
    { month: 'Jan', price: 2400 },
    { month: 'Feb', price: 2550 },
    { month: 'Mar', price: 2480 },
    { month: 'Apr', price: 2620 },
    { month: 'May', price: 2540 },
  ];

  const advanceData = [
    { month: 'Jan', given: 80000, settled: 75000 },
    { month: 'Feb', given: 95000, settled: 88000 },
    { month: 'Mar', given: 105000, settled: 102000 },
    { month: 'Apr', given: 125000, settled: 118000 },
    { month: 'May', given: 125000, settled: 125000 },
  ];

  const predictions = [
    { title: 'High-Demand Crops Next Month', items: ['Wheat (+15%)', 'Pulses (+8%)'], color: 'bg-green-500' },
    { title: 'Likely Defaults > 30 Days', items: ['2 producers at risk'], color: 'bg-red-500' },
    { title: 'Bill Discounting Opportunities', items: ['₹2.5L available at 7.8%'], color: 'bg-blue-500' },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">AI Insights & Analytics</h2>
          <p className="text-sm text-slate-600">Predictive analytics and trends</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Predictions */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        {predictions.map((pred, idx) => (
          <Card key={idx} className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`${pred.color} p-2 rounded-lg`}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-slate-900 mb-2">{pred.title}</h4>
                  {pred.items.map((item, i) => (
                    <p key={i} className="text-xs text-slate-600">{item}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Price Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Advance vs Settlement</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={advanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="given" fill="#D4AF37" />
                <Bar dataKey="settled" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Credit Exposure</p>
                <p className="text-slate-900 mt-1">₹12.5L</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Buyers</p>
                <p className="text-slate-900 mt-1">24</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Recovery Rate</p>
                <p className="text-slate-900 mt-1">96.5%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
