import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Clock, Edit, Lock, AlertTriangle, Shield, Filter, Search, Bell, Mic, Calendar, Package, DollarSign
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface PendingRecord {
  id: string;
  serialNo: string;
  date: string;
  buyerName: string;
  company: string;
  status: 'pending' | 'waiting' | 'confirmed';
  amount: number;
  commodity: string;
  weight: number;
  dueDate: string;
  daysRemaining: number;
  editable: boolean;
  tradieReward: number;
}

export function PendingAuthorizationTable() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PendingRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [justificationReason, setJustificationReason] = useState('');
  const [justificationNotes, setJustificationNotes] = useState('');

  const records: PendingRecord[] = [
    {
      id: '1',
      serialNo: 'TRD-2025-B001',
      date: '2025-10-27',
      buyerName: 'Rajesh Kumar',
      company: 'Kumar Traders Ltd',
      status: 'waiting',
      amount: 125000,
      commodity: 'Wheat',
      weight: 5000,
      dueDate: '2025-11-03',
      daysRemaining: 7,
      editable: true,
      tradieReward: 5,
    },
    {
      id: '2',
      serialNo: 'TRD-2025-B002',
      date: '2025-10-26',
      buyerName: 'Priya Sharma',
      company: 'Sharma Exports',
      status: 'waiting',
      amount: 89500,
      commodity: 'Rice',
      weight: 3500,
      dueDate: '2025-10-28',
      daysRemaining: 1,
      editable: true,
      tradieReward: 5,
    },
    {
      id: '3',
      serialNo: 'TRD-2025-B003',
      date: '2025-10-25',
      buyerName: 'Amit Patel',
      company: 'Patel Foods & Co',
      status: 'pending',
      amount: 156000,
      commodity: 'Pulses',
      weight: 6200,
      dueDate: '2025-11-05',
      daysRemaining: 9,
      editable: true,
      tradieReward: 5,
    },
    {
      id: '4',
      serialNo: 'TRD-2025-B004',
      date: '2025-10-20',
      buyerName: 'Sunita Reddy',
      company: 'Reddy Commodities',
      status: 'confirmed',
      amount: 234000,
      commodity: 'Spices',
      weight: 2000,
      dueDate: '2025-11-02',
      daysRemaining: 6,
      editable: false,
      tradieReward: 10,
    },
  ];

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === 'confirmed') {
      return <Badge className="bg-green-500 text-white gap-1">
        <Lock className="w-3 h-3" />
        Confirmed
      </Badge>;
    }
    
    if (status === 'waiting') {
      const color = daysRemaining <= 1 ? 'bg-red-500 animate-pulse' : daysRemaining <= 3 ? 'bg-amber-500' : 'bg-orange-500';
      return <Badge className={`${color} text-white gap-1`}>
        <Clock className="w-3 h-3" />
        Waiting ({daysRemaining}d)
      </Badge>;
    }

    return <Badge className="bg-amber-500 text-white gap-1">
      <AlertTriangle className="w-3 h-3" />
      Pending Auth
    </Badge>;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditSubmit = () => {
    if (!justificationReason || !justificationNotes) {
      alert('Please provide reason and justification notes');
      return;
    }
    setShowEditModal(false);
    setShowOTPDialog(true);
  };

  const confirmEdit = () => {
    console.log('Edit confirmed with OTP:', otp);
    setShowOTPDialog(false);
    setOtp('');
    setJustificationReason('');
    setJustificationNotes('');
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Pending Authorization Category</h1>
          <p className="text-slate-600 mt-1">Buyer records waiting for authorization</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Pending Auth</p>
            <p className="text-slate-900 mt-1">{records.filter(r => r.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Waiting Buyer</p>
            <p className="text-slate-900 mt-1">{records.filter(r => r.status === 'waiting').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Confirmed</p>
            <p className="text-slate-900 mt-1">{records.filter(r => r.status === 'confirmed').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by buyer, serial, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Auth</SelectItem>
                <SelectItem value="waiting">Waiting Buyer</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Database Records</CardTitle>
          <CardDescription>Editable until confirmed (locked after authorization)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <Card 
                key={record.id} 
                className={`border-l-4 hover:shadow-md transition-shadow ${
                  record.status === 'confirmed' ? 'border-l-green-500' :
                  record.status === 'waiting' && record.daysRemaining <= 1 ? 'border-l-red-500' :
                  record.status === 'waiting' ? 'border-l-orange-500' :
                  'border-l-amber-500'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-slate-900">{record.buyerName}</h3>
                        {getStatusBadge(record.status, record.daysRemaining)}
                        {record.editable ? (
                          <Badge variant="outline" className="text-xs">Editable</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Lock className="w-3 h-3" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{record.company}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{record.serialNo}</Badge>
                        <span className="text-xs text-slate-500">Date: {record.date}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Commodity</p>
                            <p className="text-slate-700">{record.commodity} ({record.weight}kg)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Amount</p>
                            <p className="text-slate-900">₹{record.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Due Date</p>
                            <p className="text-slate-700">{record.dueDate}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Tradie Reward</p>
                          <Badge className="bg-[#F4D03F] text-[#4A4A4A]">+{record.tradieReward}</Badge>
                        </div>
                      </div>

                      {record.status === 'waiting' && record.daysRemaining <= 1 && (
                        <Alert className="border-red-500 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800 text-xs">
                            <strong>Alert:</strong> Pre-due notification sent (1 day remaining)
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {record.editable && (
                        <>
                          <Dialog open={showEditModal && selectedRecord?.id === record.id} onOpenChange={setShowEditModal}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Edit className="w-4 h-4" />
                                Edit w/ Justify
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Record with Justification</DialogTitle>
                                <DialogDescription>
                                  {record.serialNo} - {record.buyerName}
                                </DialogDescription>
                              </DialogHeader>

                              <Tabs defaultValue="edit" className="mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="edit">Edit Values</TabsTrigger>
                                  <TabsTrigger value="justify">Justification</TabsTrigger>
                                </TabsList>

                                <TabsContent value="edit" className="space-y-4 mt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Buyer Name</Label>
                                      <Input defaultValue={record.buyerName} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Company</Label>
                                      <Input defaultValue={record.company} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Weight (kg)</Label>
                                      <Input type="number" defaultValue={record.weight} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Amount (₹)</Label>
                                      <Input type="number" defaultValue={record.amount} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                      <Label>Due Date</Label>
                                      <Input type="date" defaultValue={record.dueDate} />
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="justify" className="space-y-4 mt-4">
                                  <Alert className="border-amber-500 bg-amber-50">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    <AlertDescription className="text-amber-800 text-xs">
                                      All changes require justification and 2FA authorization. Edits are logged and tracked.
                                    </AlertDescription>
                                  </Alert>

                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="reason">Reason for Change *</Label>
                                      <Select value={justificationReason} onValueChange={setJustificationReason}>
                                        <SelectTrigger id="reason" className="h-16">
                                          <SelectValue placeholder="Select reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="quality">Quality Issue/Mismatch</SelectItem>
                                          <SelectItem value="measurement">Measurement Error</SelectItem>
                                          <SelectItem value="agreement">Agreement Change</SelectItem>
                                          <SelectItem value="buyer-request">Buyer Request</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="notes">Detailed Notes *</Label>
                                      <div className="relative">
                                        <Textarea 
                                          id="notes" 
                                          value={justificationNotes}
                                          onChange={(e) => setJustificationNotes(e.target.value)}
                                          placeholder="Explain the reason for this change in detail..."
                                          rows={4}
                                          className="pr-10"
                                        />
                                        <button className="absolute right-2 top-2 p-2 hover:bg-slate-100 rounded">
                                          <Mic className="w-4 h-4 text-slate-400" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>

                              <Separator />

                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleEditSubmit}
                                  disabled={!justificationReason || !justificationNotes}
                                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                                >
                                  <Shield className="w-4 h-4" />
                                  Submit with 2FA
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" className="gap-2">
                            <Bell className="w-4 h-4" />
                            Notify
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2FA Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              2FA Authorization Required
            </DialogTitle>
            <DialogDescription>
              Confirm changes to {selectedRecord?.serialNo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-blue-500 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs">
                OTP sent to your registered mobile. This edit will be logged in the audit trail.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Enter 6-Digit OTP</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <p className="text-slate-600 mb-2">Summary:</p>
              <p className="text-slate-900">Reason: {justificationReason}</p>
              <p className="text-slate-900">Notes: {justificationNotes}</p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowOTPDialog(false)}>
                Cancel
              </Button>
              <Button 
                disabled={otp.length !== 6}
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={confirmEdit}
              >
                <Shield className="w-4 h-4" />
                Confirm Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
