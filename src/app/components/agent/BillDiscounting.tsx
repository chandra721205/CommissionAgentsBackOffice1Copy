import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { DollarSign, TrendingUp, Clock, Shield, Brain } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Alert, AlertDescription } from '../ui/alert';

interface BillDiscountingProps {
  onNavigate: (screen: string) => void;
}

export function BillDiscounting({ onNavigate }: BillDiscountingProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const requests = [
    { id: '1', buyer: 'Sharma Traders', amount: '₹1.2L', commodity: 'Wheat', status: 'pending' },
    { id: '2', buyer: 'Kumar Exports', amount: '₹89K', commodity: 'Rice', status: 'approved' },
  ];

  const offers = [
    { bank: 'HDFC Agri Finance', rate: 8.5, tenure: '90 days', cap: '₹5L', compliance: 'RBI Approved' },
    { bank: 'ICICI Commodity Credit', rate: 9.2, tenure: '60 days', cap: '₹3L', compliance: 'NABARD' },
    { bank: 'SBI Kisan Credit', rate: 7.8, tenure: '120 days', cap: '₹10L', compliance: 'RBI Approved' },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Bill Discounting & Finance</h2>
        <p className="text-sm text-slate-600">Manage bill discounting requests and offers</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="bg-white shadow-md">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="border-0 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm text-slate-900">{req.buyer}</h4>
                    <p className="text-xs text-slate-600">{req.commodity}</p>
                  </div>
                  <Badge className={req.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}>
                    {req.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-slate-900">{req.amount}</p>
                  <Button size="sm" className="bg-gradient-to-r from-[#D4AF37] to-amber-600">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Alert className="border-purple-500 bg-purple-50">
            <Brain className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>AI Recommendation:</strong> HDFC offers best rate with fastest approval
            </AlertDescription>
          </Alert>

          {offers.map((offer, idx) => (
            <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm text-slate-900">{offer.bank}</h4>
                      <Badge variant="outline" className="mt-1 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        {offer.compliance}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600">{offer.rate}%</p>
                      <p className="text-xs text-slate-500">interest rate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500">Tenure</p>
                      <p className="text-slate-900">{offer.tenure}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Cap Limit</p>
                      <p className="text-slate-900">{offer.cap}</p>
                    </div>
                    <div>
                      <Button size="sm" className="w-full">Apply</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No history available</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
