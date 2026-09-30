import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  CheckCircle2, XCircle, Clock, Edit, Shield, AlertTriangle,
  User, Building2, Package, DollarSign, Calendar, FileText, Brain, Phone
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ApprovalQueueProps {
  userRole: string;
}

interface PendingRecord {
  id: string;
  serialNo: string;
  date: string;
  buyerName: string;
  company: string;
  totalAmount: number;
  commodity: string;
  weight: number;
  status: 'waiting' | 'change-requested';
  requestedChanges?: string;
  changeJustification?: string;
  agentName: string;
  submittedAt: string;
  editCount: number;
  aiRisk: number;
  waitingTime: string;
}

export function ApprovalQueue({ userRole }: ApprovalQueueProps) {
  const [selectedRecord, setSelectedRecord] = useState<PendingRecord | null>(null);
  const [otp, setOtp] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | 'request-change' | null>(null);
  const [newValue, setNewValue] = useState('');
  const [fieldToChange, setFieldToChange] = useState('');

  const canApprove = ['admin', 'manager', 'auditor'].includes(userRole);

  const pendingRecords: PendingRecord[] = [
    {
      id: '1',
      serialNo: 'TRD-2025-001',
      date: '2025-10-27',
      buyerName: 'Rajesh Kumar',
      company: 'Kumar Traders Ltd',
      totalAmount: 125000,
      commodity: 'Wheat',
      weight: 5000,
      status: 'waiting',
      agentName: 'Agent A',
      submittedAt: '2025-10-27 09:30 AM',
      editCount: 0,
      aiRisk: 15,
      waitingTime: '45 mins',
    },
    {
      id: '2',
      serialNo: 'TRD-2025-006',
      date: '2025-10-27',
      buyerName: 'Vikram Singh',
      company: 'Singh Commodities',
      totalAmount: 89000,
      commodity: 'Rice',
      weight: 3200,
      status: 'waiting',
      agentName: 'Agent B',
      submittedAt: '2025-10-27 10:15 AM',
      editCount: 0,
      aiRisk: 8,
      waitingTime: '1 hr 30 mins',
    },
    {
      id: '3',
      serialNo: 'TRD-2025-007',
      date: '2025-10-26',
      buyerName: 'Neha Gupta',
      company: 'Gupta Exports',
      totalAmount: 156000,
      commodity: 'Pulses',
      weight: 6200,
      status: 'change-requested',
      requestedChanges: 'Please update the weight from 6200kg to 6250kg as per revised measurement.',
      changeJustification: 'Buyer provided additional bags after initial weighing. Verified by supervisor on-site.',
      agentName: 'Agent A',
      submittedAt: '2025-10-26 03:45 PM',
      editCount: 2,
      aiRisk: 35,
      waitingTime: '18 hrs',
    },
    {
      id: '4',
      serialNo: 'TRD-2025-008',
      date: '2025-10-26',
      buyerName: 'Sunita Reddy',
      company: 'Reddy Commodities',
      totalAmount: 234000,
      commodity: 'Spices',
      weight: 2000,
      status: 'change-requested',
      requestedChanges: 'Update payment method from Cheque to Bank Wire',
      changeJustification: 'Buyer requested change due to faster settlement preference',
      agentName: 'Agent C',
      submittedAt: '2025-10-26 11:20 AM',
      editCount: 5,
      aiRisk: 72,
      waitingTime: '1 day 2 hrs',
    },
  ];

  const handleApproval = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowOTPDialog(true);
  };

  const handleRequestChange = () => {
    setApprovalAction('request-change');
    setShowChangeDialog(true);
  };

  const confirmApproval = () => {
    // In production, this would validate OTP and process the approval
    console.log('Processing approval:', approvalAction, 'OTP:', otp);
    setShowOTPDialog(false);
    setOtp('');
    setApprovalAction(null);
    setSelectedRecord(null);
  };

  const submitChangeRequest = () => {
    console.log('Change request:', { field: fieldToChange, newValue, reason: changeReason });
    setShowChangeDialog(false);
    setChangeReason('');
    setNewValue('');
    setFieldToChange('');
  };

  return (
    <div className="space-y-6">
      {!canApprove && (
        <Alert className="border-amber-500 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You don't have permission to approve records. Only Admin, Manager, and Auditor roles can approve.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Waiting Authorization</p>
                <p className="text-slate-900 mt-1">{pendingRecords.filter(r => r.status === 'waiting').length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Change Requested</p>
                <p className="text-slate-900 mt-1">{pendingRecords.filter(r => r.status === 'change-requested').length}</p>
              </div>
              <Edit className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">High Risk Items</p>
                <p className="text-slate-900 mt-1">{pendingRecords.filter(r => r.aiRisk > 50).length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Records */}
      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="waiting" className="gap-2">
            <Clock className="w-4 h-4" />
            Waiting Authorization ({pendingRecords.filter(r => r.status === 'waiting').length})
          </TabsTrigger>
          <TabsTrigger value="changes" className="gap-2">
            <Edit className="w-4 h-4" />
            Change Requests ({pendingRecords.filter(r => r.status === 'change-requested').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="space-y-3">
          {pendingRecords.filter(r => r.status === 'waiting').map((record) => (
            <Card key={record.id} className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-slate-900">{record.buyerName}</h3>
                        <Badge className="bg-amber-500 text-white gap-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          Waiting {record.waitingTime}
                        </Badge>
                        {record.aiRisk > 30 && (
                          <Badge className="bg-red-500 text-white gap-1">
                            <Brain className="w-3 h-3" />
                            Risk {record.aiRisk}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{record.company}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{record.serialNo}</Badge>
                        <span className="text-xs text-slate-500">Submitted: {record.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-slate-700">{record.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Commodity</p>
                      <p className="text-slate-700">{record.commodity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Weight</p>
                      <p className="text-slate-700">{record.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="text-slate-900">₹{record.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <Separator />

                  {canApprove && (
                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => setSelectedRecord(record)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve with 2FA
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Shield className="w-5 h-5 text-green-600" />
                              2FA Approval Required
                            </DialogTitle>
                            <DialogDescription>
                              Approve: {record.serialNo} - {record.buyerName}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <Alert className="border-blue-500 bg-blue-50">
                              <Phone className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-800">
                                OTP sent to your registered mobile number ending in ****7890
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

                            <div className="flex justify-between pt-4">
                              <Button variant="link" className="text-blue-600">
                                Resend OTP
                              </Button>
                              <Button 
                                disabled={otp.length !== 6}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  confirmApproval();
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Confirm Approval
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          setSelectedRecord(record);
                          handleRequestChange();
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Request Change
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedRecord(record);
                          handleApproval('reject');
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="changes" className="space-y-3">
          {pendingRecords.filter(r => r.status === 'change-requested').map((record) => (
            <Card key={record.id} className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-slate-900">{record.buyerName}</h3>
                        <Badge className="bg-blue-500 text-white gap-1">
                          <Edit className="w-3 h-3" />
                          Change Requested
                        </Badge>
                        {record.editCount > 2 && (
                          <Badge className="bg-amber-500 text-white gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {record.editCount} edits
                          </Badge>
                        )}
                        {record.aiRisk > 50 && (
                          <Badge className="bg-red-500 text-white gap-1 animate-pulse">
                            <Brain className="w-3 h-3" />
                            High Risk {record.aiRisk}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{record.company}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{record.serialNo}</Badge>
                        <span className="text-xs text-slate-500">Submitted: {record.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-slate-700">{record.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Commodity</p>
                      <p className="text-slate-700">{record.commodity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Weight</p>
                      <p className="text-slate-700">{record.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="text-slate-900">₹{record.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {record.requestedChanges && (
                    <Alert className="border-blue-500 bg-blue-50">
                      <Edit className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Requested Changes:</strong> {record.requestedChanges}
                      </AlertDescription>
                    </Alert>
                  )}

                  {record.changeJustification && (
                    <Alert className="border-purple-500 bg-purple-50">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        <strong>Justification:</strong> {record.changeJustification}
                      </AlertDescription>
                    </Alert>
                  )}

                  {record.aiRisk > 50 && (
                    <Alert className="border-red-500 bg-red-50">
                      <Brain className="h-4 w-4 text-red-600 animate-pulse" />
                      <AlertDescription className="text-red-800">
                        <strong>AI Warning:</strong> This record has {record.editCount} corrections by {record.agentName}. Risk score: {record.aiRisk}%. Pattern detected - requires manual audit review.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  {canApprove && (
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedRecord(record);
                          handleApproval('approve');
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Changes
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedRecord(record);
                          handleApproval('reject');
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Change Request Dialog */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Value Change</DialogTitle>
            <DialogDescription>
              Request changes to buyer record with justification
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field">Field to Change</Label>
              <select 
                id="field"
                value={fieldToChange}
                onChange={(e) => setFieldToChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select field</option>
                <option value="weight">Weight</option>
                <option value="amount">Amount</option>
                <option value="payment">Payment Method</option>
                <option value="duedate">Due Date</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newValue">New Value</Label>
              <Input 
                id="newValue" 
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Justification (Required) *</Label>
              <Textarea 
                id="justification" 
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain the reason for this change..."
                rows={4}
              />
            </div>

            <Alert className="border-amber-500 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                All changes are tracked and audited. Multiple corrections may trigger AI risk alerts.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowChangeDialog(false)}>
                Cancel
              </Button>
              <Button 
                disabled={!fieldToChange || !newValue || !changeReason}
                onClick={submitChangeRequest}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit Change Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject OTP Dialog */}
      <Dialog open={showOTPDialog && approvalAction === 'reject'} onOpenChange={setShowOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Reject Record - 2FA Required
            </DialogTitle>
            <DialogDescription>
              Confirm rejection of {selectedRecord?.serialNo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                This action will reject the buyer record. This cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea 
                placeholder="Provide reason for rejection..."
                rows={3}
              />
            </div>

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

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowOTPDialog(false)}>
                Cancel
              </Button>
              <Button 
                disabled={otp.length !== 6}
                className="gap-2 bg-red-600 hover:bg-red-700"
                onClick={confirmApproval}
              >
                <XCircle className="w-4 h-4" />
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
