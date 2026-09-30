import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface TransportTrackingProps {
  onNavigate: (screen: string) => void;
}

export function TransportTracking({ onNavigate }: TransportTrackingProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const shipments = [
    {
      id: 'SH-001',
      lot: 'WH-045',
      buyer: 'Sharma Traders',
      status: 'in-transit',
      stages: [
        { name: 'Dispatch', status: 'completed', time: '10:00 AM' },
        { name: 'Pickup', status: 'completed', time: '11:30 AM' },
        { name: 'Arrival', status: 'in-progress', time: '' },
        { name: 'Delivery', status: 'pending', time: '' },
      ],
    },
    {
      id: 'SH-002',
      lot: 'RC-023',
      buyer: 'Kumar Exports',
      status: 'delivered',
      stages: [
        { name: 'Dispatch', status: 'completed', time: '09:00 AM' },
        { name: 'Pickup', status: 'completed', time: '10:15 AM' },
        { name: 'Arrival', status: 'completed', time: '02:30 PM' },
        { name: 'Delivery', status: 'completed', time: '03:00 PM' },
      ],
    },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'p-0'} space-y-6`}>
      <div>
        <h2 className="text-slate-900">Transport & Delivery Tracking</h2>
        <p className="text-sm text-slate-600">Real-time tracking of shipments</p>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Shipment #{shipment.id}</CardTitle>
                  <p className="text-xs text-slate-600">Lot #{shipment.lot} • {shipment.buyer}</p>
                </div>
                <Badge className={shipment.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}>
                  {shipment.status === 'delivered' ? 'Delivered' : 'In Transit'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Timeline */}
                <div className="space-y-3">
                  {shipment.stages.map((stage, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stage.status === 'completed' ? 'bg-green-500' :
                        stage.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-slate-300'
                      }`}>
                        {stage.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : stage.status === 'in-progress' ? (
                          <Clock className="w-4 h-4 text-white animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-900">{stage.name}</p>
                          {stage.time && (
                            <p className="text-xs text-slate-500">{stage.time}</p>
                          )}
                        </div>
                        {stage.status === 'in-progress' && (
                          <Button size="sm" variant="outline" className="mt-2">
                            Verify OTP
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">Real-time tracking map</p>
                    <p className="text-xs text-slate-500 mt-1">GPS integration placeholder</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
