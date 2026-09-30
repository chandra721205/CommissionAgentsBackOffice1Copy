import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Users } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BuyerRatingProps {
  onNavigate: (screen: string) => void;
}

export function BuyerRating({ onNavigate }: BuyerRatingProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [alerts, setAlerts] = useState({
    bidReminder: true,
    paymentDue: true,
    deliveryDelay: false,
  });

  const buyers = [
    {
      name: 'Sharma Traders',
      punctuality: 98,
      volume: 145,
      disputes: 2,
      profit: 12.5,
      consumers: 450,
      netWorth: '₹5.2Cr',
      trend: 'up',
    },
    {
      name: 'Kumar Exports',
      punctuality: 92,
      volume: 89,
      disputes: 5,
      profit: 8.3,
      consumers: 230,
      netWorth: '₹3.8Cr',
      trend: 'stable',
    },
    {
      name: 'Patel Foods',
      punctuality: 75,
      volume: 56,
      disputes: 12,
      profit: -2.5,
      consumers: 120,
      netWorth: '₹1.2Cr',
      trend: 'down',
    },
  ];

  const volumeData = [
    { month: 'Jan', volume: 120 },
    { month: 'Feb', volume: 145 },
    { month: 'Mar', volume: 138 },
    { month: 'Apr', volume: 165 },
    { month: 'May', volume: 145 },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Buyer Rating & Alerts</h2>
        <p className="text-sm text-slate-600">Monitor buyer performance and configure alerts</p>
      </div>

      {/* Alert Configuration */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Alert Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <Label htmlFor="bidReminder" className="cursor-pointer">Bid Reminder</Label>
              <Switch 
                id="bidReminder"
                checked={alerts.bidReminder}
                onCheckedChange={(checked) => setAlerts({...alerts, bidReminder: checked})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <Label htmlFor="paymentDue" className="cursor-pointer">Payment Due</Label>
              <Switch 
                id="paymentDue"
                checked={alerts.paymentDue}
                onCheckedChange={(checked) => setAlerts({...alerts, paymentDue: checked})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <Label htmlFor="deliveryDelay" className="cursor-pointer">Delivery Delay</Label>
              <Switch 
                id="deliveryDelay"
                checked={alerts.deliveryDelay}
                onCheckedChange={(checked) => setAlerts({...alerts, deliveryDelay: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Ratings */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle className="text-base">Buyer Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {buyers.map((buyer, idx) => (
            <Card key={idx} className="border-l-4 hover:shadow-md transition-shadow"
                  style={{
                    borderLeftColor: 
                      buyer.trend === 'up' ? '#10b981' :
                      buyer.trend === 'down' ? '#ef4444' :
                      '#3b82f6'
                  }}>
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-slate-900">{buyer.name}</h4>
                      {buyer.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {buyer.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                    </div>
                    <Badge className={
                      buyer.punctuality >= 90 ? 'bg-green-500' :
                      buyer.punctuality >= 75 ? 'bg-amber-500' :
                      'bg-red-500'
                    }>
                      {buyer.punctuality}% Punctual
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Volume History</p>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-900">{buyer.volume} deals</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Dispute Ratio</p>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-900">{buyer.disputes}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Profit Trend</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <p className={`text-sm ${buyer.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {buyer.profit > 0 ? '+' : ''}{buyer.profit}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Consumer Base</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-900">{buyer.consumers}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 mb-1">Net Worth</p>
                      <p className="text-sm text-slate-900">{buyer.netWorth}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Payment Punctuality</span>
                      <span className="text-slate-900">{buyer.punctuality}%</span>
                    </div>
                    <Progress value={buyer.punctuality} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Volume Trend Chart */}
      {!isMobile && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Volume Trend - Top Buyer</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
