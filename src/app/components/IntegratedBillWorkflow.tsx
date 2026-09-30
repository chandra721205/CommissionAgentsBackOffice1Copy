// ==========================================
// Complete Integrated Bill Workflow Component
// Demonstrates full SQL schema integration
// ==========================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import {
  CheckCircle2, Clock, Edit, AlertTriangle, Brain, Shield, 
  Lock, FileText, TrendingUp, DollarSign, Send, History
} from 'lucide-react';

// Import types and services
import {
  Bill,
  BillWithDetails,
  BillChangeRequest,
  BillAuthorization,
  AIBuyerScore,
  AuthStatus,
  PaymentMethod,
  Role
} from '../types/database';

import { api } from '../services/api';
import {
  createBillAfterWeighment,
  requestBillChange,
  buyerApproveWithOTP,
  agentFinalApprovalAndFreeze,
  monitorBuyerBehavior
} from '../services/workflows';

type WorkflowStep = 'create' | 'buyer-review' | 'change-request' | 'buyer-approve' | 'agent-approve' | 'complete';

interface IntegratedBillWorkflowProps {
  lotId: bigint;
  buyerEntityId: bigint;
  buyerUserId: bigint;
  agentUserId: bigint;
}

const IntegratedBillWorkflow: React.FC<IntegratedBillWorkflowProps> = ({
  lotId,
  buyerEntityId,
  buyerUserId,
  agentUserId
}) => {
  // State Management
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('create');
  const [bill, setBill] = useState<BillWithDetails | null>(null);
  const [buyerScore, setBuyerScore] = useState<AIBuyerScore | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [pricePerUnit, setPricePerUnit] = useState('22.00');
  const [quantityUnits, setQuantityUnits] = useState('50');
  const [packagingCost, setPackagingCost] = useState('50');
  const [dueDateType, setDueDateType] = useState<'REGULATION' | 'ASSOCIATION' | 'CUSTOM' | 'AI_SUGGESTED'>('REGULATION');

  // Change Request States
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [justification, setJustification] = useState('');

  // 2FA States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpRole, setOtpRole] = useState<Role | null>(null);

  // Load buyer AI score and behavior analysis
  useEffect(() => {
    loadBuyerData();
  }, [buyerEntityId]);

  const loadBuyerData = async () => {
    try {
      const [score, behavior] = await Promise.all([
        api.getBuyerScore(buyerEntityId),
        monitorBuyerBehavior(buyerEntityId)
      ]);
      setBuyerScore(score);
      setBehaviorAnalysis(behavior);
    } catch (err) {
      console.error('Error loading buyer data:', err);
    }
  };

  // ========================================
  // WORKFLOW STEP 1: Create Bill
  // ========================================
  const handleCreateBill = async () => {
    setLoading(true);
    setError(null);

    try {
      const newBill = await createBillAfterWeighment({
        lot_id: lotId,
        buyer_entity_id: buyerEntityId,
        price_per_unit: parseFloat(pricePerUnit),
        quantity_units: parseFloat(quantityUnits),
        packaging_cost: parseFloat(packagingCost),
        due_date_type: dueDateType
      });

      // Fetch full bill details
      const billDetails = await api.getBillById(newBill.id);
      setBill(billDetails);
      setCurrentStep('buyer-review');

      console.log('✅ Bill created:', newBill.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // WORKFLOW STEP 2: Change Request (Optional)
  // ========================================
  const handleRequestChange = async () => {
    if (!bill) return;
    setLoading(true);
    setError(null);

    try {
      const changeRequest = await requestBillChange({
        bill_id: bill.id,
        buyer_user_id: buyerUserId,
        field_name: 'price_per_unit',
        old_value: pricePerUnit,
        new_value: newPrice,
        justification: justification
      });

      // Refresh bill details
      const updatedBill = await api.getBillById(bill.id);
      setBill(updatedBill);
      setShowChangeModal(false);
      setCurrentStep('buyer-approve');

      console.log('✅ Change request created:', changeRequest.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // WORKFLOW STEP 3: Buyer 2FA Approval
  // ========================================
  const handleBuyerApprove = async () => {
    if (!bill) return;
    setOtpRole(Role.BUYER);
    setShow2FAModal(true);
  };

  const handleSendOTP = async () => {
    try {
      const userId = otpRole === Role.BUYER ? buyerUserId : agentUserId;
      await api.sendOTP(userId, 'SMS');
      console.log('📱 OTP sent to user:', userId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!bill) return;
    setLoading(true);
    setError(null);

    try {
      if (otpRole === Role.BUYER) {
        // Buyer approval
        await buyerApproveWithOTP({
          bill_id: bill.id,
          buyer_user_id: buyerUserId,
          otp_code: otpCode,
          note: 'Approved via integrated workflow'
        });

        const updatedBill = await api.getBillById(bill.id);
        setBill(updatedBill);
        setCurrentStep('agent-approve');

        console.log('✅ Buyer approved via 2FA');
      } else if (otpRole === Role.COMMISSION_AGENT) {
        // Agent final approval
        const result = await agentFinalApprovalAndFreeze({
          bill_id: bill.id,
          agent_user_id: agentUserId,
          otp_code: otpCode,
          note: 'Final approval via integrated workflow'
        });

        const updatedBill = await api.getBillById(bill.id);
        setBill(updatedBill);
        setCurrentStep('complete');

        // Refresh AI scores
        await loadBuyerData();

        console.log('✅ Agent approved and ledger frozen:', result.ledger_entry.id);
      }

      setShow2FAModal(false);
      setOtpCode('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // WORKFLOW STEP 4: Agent Final Approval
  // ========================================
  const handleAgentApprove = async () => {
    if (!bill) return;
    setOtpRole(Role.COMMISSION_AGENT);
    setShow2FAModal(true);
  };

  // ========================================
  // UI Rendering
  // ========================================

  const getStatusBadge = (status: AuthStatus) => {
    switch (status) {
      case AuthStatus.PENDING_BUYER:
        return <Badge className="bg-yellow-500">🕓 Pending Buyer</Badge>;
      case AuthStatus.PENDING_AGENT:
        return <Badge className="bg-blue-500">🕓 Pending Agent</Badge>;
      case AuthStatus.MODIFIED_NEEDS_JUSTIFICATION:
        return <Badge className="bg-orange-500">✏️ Modified</Badge>;
      case AuthStatus.AUTHORIZED:
        return <Badge className="bg-green-500">✅ Authorized</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Integrated Bill Workflow</span>
            {bill && getStatusBadge(bill.status)}
          </CardTitle>
          <CardDescription>
            Complete bill lifecycle from creation to ledger freeze with SQL schema integration
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Buyer Analysis */}
      {behaviorAnalysis && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Buyer Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Risk Level:</span>
              <Badge className={
                behaviorAnalysis.riskLevel === 'HIGH' ? 'bg-red-500' :
                behaviorAnalysis.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                'bg-green-500'
              }>
                {behaviorAnalysis.riskLevel}
              </Badge>
            </div>

            {buyerScore && (
              <>
                <div className="text-sm">
                  <strong>Reliability Score:</strong> {buyerScore.reliability_score}%
                </div>
                <div className="text-sm">
                  <strong>Discrepancy Ratio:</strong> {(buyerScore.discrepancy_ratio * 100).toFixed(2)}%
                </div>
                <div className="text-sm">
                  <strong>On-Time Payment:</strong> {(buyerScore.on_time_pay_ratio * 100).toFixed(2)}%
                </div>
              </>
            )}

            {behaviorAnalysis.warnings && behaviorAnalysis.warnings.length > 0 && (
              <Alert className="mt-3">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {behaviorAnalysis.warnings.map((warning: string, i: number) => (
                    <div key={i} className="text-xs">⚠️ {warning}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {(['create', 'buyer-review', 'buyer-approve', 'agent-approve', 'complete'] as WorkflowStep[]).map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-2 ${
                  currentStep === step ? 'text-blue-600 font-bold' :
                  index < ['create', 'buyer-review', 'buyer-approve', 'agent-approve', 'complete'].indexOf(currentStep) ? 'text-green-600' :
                  'text-gray-400'
                }`}>
                  {index < ['create', 'buyer-review', 'buyer-approve', 'agent-approve', 'complete'].indexOf(currentStep) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                      currentStep === step ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                  <span className="text-sm capitalize hidden md:block">
                    {step.replace('-', ' ')}
                  </span>
                </div>
                {index < 4 && <div className="flex-1 h-0.5 bg-gray-300 mx-2" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Create Bill */}
      {currentStep === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Bill after Weighment</CardTitle>
            <CardDescription>SQL: INSERT INTO bills ... RETURNING id;</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price per Unit (₹)</Label>
                <Input
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  step="0.01"
                />
              </div>
              <div>
                <Label>Quantity (units)</Label>
                <Input
                  type="number"
                  value={quantityUnits}
                  onChange={(e) => setQuantityUnits(e.target.value)}
                />
              </div>
              <div>
                <Label>Packaging Cost (₹)</Label>
                <Input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Due Date Type</Label>
              <Select value={dueDateType} onValueChange={(v) => setDueDateType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULATION">Regulatory (15 days)</SelectItem>
                  <SelectItem value="ASSOCIATION">Association (30 days)</SelectItem>
                  <SelectItem value="CUSTOM">Custom Agreement</SelectItem>
                  <SelectItem value="AI_SUGGESTED">AI Suggested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-semibold mb-2">Calculation Preview:</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{quantityUnits} units × ₹{pricePerUnit}</span>
                  <span className="font-semibold">
                    ₹{(parseFloat(quantityUnits) * parseFloat(pricePerUnit)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging</span>
                  <span className="font-semibold">₹{parseFloat(packagingCost).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total Payable:</span>
                  <span className="text-green-600">
                    ₹{(parseFloat(quantityUnits) * parseFloat(pricePerUnit) + parseFloat(packagingCost)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateBill}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {loading ? 'Creating...' : 'Create Bill (Status: PENDING_BUYER)'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Buyer Review & Optional Change Request */}
      {currentStep === 'buyer-review' && bill && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Buyer Review</CardTitle>
            <CardDescription>Bill ID: {bill.id.toString()} • Status: {bill.status}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price per Unit:</span>
                <span className="font-semibold">₹{bill.price_per_unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-semibold">{bill.quantity_units} units</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging:</span>
                <span className="font-semibold">₹{bill.packaging_cost}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span className="font-semibold">{new Date(bill.due_date).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span className="text-green-600">₹{bill.total_payable.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleBuyerApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve as-is
              </Button>
              <Button
                onClick={() => setShowChangeModal(true)}
                variant="outline"
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Request Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Buyer Approval (after optional change) */}
      {currentStep === 'buyer-approve' && bill && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Buyer 2FA Approval</CardTitle>
            <CardDescription>
              SQL: INSERT INTO bill_authorizations ... UPDATE bills SET status='PENDING_AGENT'
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBuyerApprove}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <Lock className="w-4 h-4 mr-2" />
              Approve with 2FA
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Agent Approval */}
      {currentStep === 'agent-approve' && bill && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Agent Final Approval & Ledger Freeze</CardTitle>
            <CardDescription>
              SQL: UPDATE bills SET status='AUTHORIZED' ... INSERT INTO ledger_entries ...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-500 bg-blue-50">
              <Shield className="w-4 h-4 text-blue-500" />
              <AlertDescription className="text-sm">
                <strong>Awaiting Commission Agent Approval</strong>
                <br />
                Once approved, this bill will be AUTHORIZED and frozen in the immutable ledger.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleAgentApprove}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Lock className="w-4 h-4 mr-2" />
              Final Approval with 2FA (Agent)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Complete */}
      {currentStep === 'complete' && bill && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-6 h-6" />
              Bill Lifecycle Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Bill ID:</span>
                <span className="font-mono font-semibold">{bill.id.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-500">✅ AUTHORIZED</Badge>
              </div>
              <div className="flex justify-between">
                <span>Ledger Entry:</span>
                <Badge className="bg-blue-500">🔒 FROZEN (Immutable)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-green-600">₹{bill.total_payable.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">AI Score Updated</span>
              </div>
              {buyerScore && (
                <div className="text-sm space-y-1">
                  <div>Reliability: {buyerScore.reliability_score}%</div>
                  <div>Discrepancy: {(buyerScore.discrepancy_ratio * 100).toFixed(2)}%</div>
                </div>
              )}
            </div>

            <Button
              onClick={() => {
                setBill(null);
                setCurrentStep('create');
                setPricePerUnit('22.00');
                setQuantityUnits('50');
                setPackagingCost('50');
              }}
              className="w-full"
              variant="outline"
            >
              Start New Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Change Request Modal */}
      <Dialog open={showChangeModal} onOpenChange={setShowChangeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Bill Change</DialogTitle>
            <DialogDescription>
              SQL: INSERT INTO bill_change_requests ... UPDATE bills SET status='MODIFIED_NEEDS_JUSTIFICATION'
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Current Price</Label>
              <Input value={pricePerUnit} disabled />
            </div>
            <div>
              <Label>New Price (₹)</Label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                step="0.01"
              />
            </div>
            <div>
              <Label>Justification (Mandatory) *</Label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explain reason for price change..."
                rows={4}
              />
            </div>
            <Alert className="border-orange-500 bg-orange-50">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <AlertDescription className="text-xs">
                Frequent change patterns are tracked by AI and may affect buyer reliability score.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button
                onClick={handleRequestChange}
                disabled={!newPrice || !justification || loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Submitting...' : 'Submit Change Request'}
              </Button>
              <Button variant="outline" onClick={() => setShowChangeModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2FA Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>2FA Verification Required</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to your registered mobile number
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="border-blue-500 bg-blue-50">
              <Shield className="w-4 h-4 text-blue-500" />
              <AlertDescription className="text-xs">
                <strong>Role:</strong> {otpRole === Role.BUYER ? 'Buyer' : 'Commission Agent'}
                <br />
                OTP valid for 5 minutes
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
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

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyOTP}
                disabled={otpCode.length !== 6 || loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Verifying...' : 'Verify & Approve'}
              </Button>
              <Button variant="outline" onClick={handleSendOTP}>
                <Send className="w-4 h-4 mr-2" />
                Resend OTP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegratedBillWorkflow;
