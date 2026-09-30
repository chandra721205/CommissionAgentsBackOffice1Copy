import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, DollarSign, Gavel, Package, Receipt, 
  Plus, TrendingUp, Clock, AlertTriangle, Brain
} from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface AgentDashboardProps {
  onNavigate: (screen: string) => void;
}

export function AgentDashboard({ onNavigate }: AgentDashboardProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const stats = [
    { label: 'Producers Linked', value: '45', icon: Users, color: 'from-blue-500 to-blue-600', trend: '+3' },
    { label: 'Advances Given', value: '₹12.5L', icon: DollarSign, color: 'from-green-500 to-green-600', trend: '+₹2L' },
    { label: 'Active Auctions', value: '8', icon: Gavel, color: 'from-purple-500 to-purple-600', trend: '2 ending' },
    { label: 'Pending Deliveries', value: '12', icon: Package, color: 'from-amber-500 to-amber-600', trend: '3 urgent' },
    { label: 'Bill Discounting', value: '₹8.2L', icon: Receipt, color: 'from-rose-500 to-rose-600', trend: '+₹1.5L' },
  ];

  const quickActions = [
    { label: 'Add Producer', icon: Plus, action: () => onNavigate('producers'), color: 'bg-blue-600' },
    { label: 'Advance Record', icon: DollarSign, action: () => onNavigate('finance'), color: 'bg-green-600' },
    { label: 'AI Insights', icon: Brain, action: () => onNavigate('insights'), color: 'bg-purple-600' },
    { label: 'Storage', icon: Package, action: () => onNavigate('produce'), color: 'bg-amber-600' },
    { label: 'Reports', icon: Receipt, action: () => {}, color: 'bg-rose-600' },
  ];

  const aiWidgets = [
    {
      title: 'Top Buyers Paying Above Market',
      items: [
        { name: 'Sharma Traders', commodity: 'Wheat', premium: '+8%', amount: '₹2,500/qtl' },
        { name: 'Kumar Exports', commodity: 'Rice', premium: '+5%', amount: '₹3,200/qtl' },
      ],
      color: 'border-green-500',
    },
    {
      title: 'Producers Near Harvest',
      items: [
        { name: 'Rajesh Kumar', crop: 'Wheat', days: '5 days', area: '10 acres' },
        { name: 'Priya Sharma', crop: 'Pulses', days: '8 days', area: '7 acres' },
      ],
      color: 'border-blue-500',
    },
    {
      title: 'Expiring Lots < 24h',
      items: [
        { name: 'Lot #WH-2025-045', commodity: 'Wheat', expires: '18h', currentBid: '₹1.2L' },
        { name: 'Lot #RC-2025-023', commodity: 'Rice', expires: '22h', currentBid: '₹89K' },
      ],
      color: 'border-red-500',
    },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      {/* Stats Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-5'} gap-4`}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${stat.color} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-6 h-6 text-white" />
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-white text-sm mb-1">{stat.label}</p>
                  <p className="text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used operations</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-3`}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`${isMobile ? 'h-24 flex-col' : 'h-20 flex-col'} gap-2 hover:scale-105 transition-transform`}
                  onClick={action.action}
                >
                  <div className={`${action.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Widgets */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        {aiWidgets.map((widget, index) => (
          <Card key={index} className={`border-l-4 ${widget.color} shadow-lg`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {widget.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-slate-900">{item.name}</p>
                    {item.premium && (
                      <Badge className="bg-green-500 text-white text-xs">
                        {item.premium}
                      </Badge>
                    )}
                    {item.expires && (
                      <Badge className="bg-red-500 text-white text-xs animate-pulse">
                        {item.expires}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    {Object.entries(item).slice(1).map(([key, value]) => (
                      <div key={key}>
                        <span className="capitalize">{key}: </span>
                        <span className="text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="link" size="sm" className="w-full text-blue-600">
                View All →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Active Auctions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              { lot: 'WH-045', commodity: 'Wheat', bids: 8, highBid: '₹1.2L', time: '18h left' },
              { lot: 'RC-023', commodity: 'Rice', bids: 5, highBid: '₹89K', time: '22h left' },
              { lot: 'PL-067', commodity: 'Pulses', bids: 12, highBid: '₹1.5L', time: '5h left' },
            ].map((auction, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm text-slate-900">Lot #{auction.lot}</p>
                  <p className="text-xs text-slate-600">{auction.commodity} • {auction.bids} bids</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-900">{auction.highBid}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Clock className="w-3 h-3" />
                    {auction.time}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="text-base">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              { buyer: 'Sharma Traders', commodity: 'Wheat', qty: '5000 kg', status: 'In Transit' },
              { buyer: 'Kumar Exports', commodity: 'Rice', qty: '3500 kg', status: 'Delayed' },
              { buyer: 'Patel Foods', commodity: 'Pulses', qty: '6200 kg', status: 'Awaiting Pickup' },
            ].map((delivery, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm text-slate-900">{delivery.buyer}</p>
                  <p className="text-xs text-slate-600">{delivery.commodity} • {delivery.qty}</p>
                </div>
                <Badge className={
                  delivery.status === 'In Transit' ? 'bg-blue-500' :
                  delivery.status === 'Delayed' ? 'bg-red-500' :
                  'bg-amber-500'
                }>
                  {delivery.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
