import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { MultiMemberOTPModal } from './MultiMemberOTPModal';
import {
  FileEdit,
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle2,
  Upload,
  X,
  ArrowLeft,
  Send,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface ChangeRequestScreenProps {
  entityData: {
    type: string;
    scale: string;
    name: string;
    brands: string[];
    rolesCount: number;
  };
  changeQuota: {
    total: number;
    used: number;
    remaining: number;
  };
  members: Array<{
    id: string;
    name: string;
    role: string;
    share?: number;
    phone: string;
    consentStatus?: 'pending' | 'approved';
  }>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onProceedWithoutChanges: () => void;
}

export function ChangeRequestScreen({
  entityData,
  changeQuota,
  members,
  onSubmit,
  onCancel,
  onProceedWithoutChanges,
}: ChangeRequestScreenProps) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [acknowledgments, setAcknowledgments] = useState({
    consumesChange: false,
    verifierFee: false,
    kycReverification: false,
    membersConsent: false,
    timeline: false,
  });

  const quotaPercentage = (changeQuota.remaining / changeQuota.total) * 100;
  const isIndividual = entityData.type === 'Individual';
  const requiredMembers = isIndividual ? 1 : 2;

  const changeTypes = [
    'Entity Type',
    'Scale Category',
    'Entity Name',
    'Brands/Trademarks',
    'Partner/Director Details',
    'Share Distribution',
    'Registered Address',
    'Contact Information',
  ];

  const estimatedCosts = {
    appVerifierFee: 5000,
    kycReverificationFee: 2000,
    documentProcessingFee: 1000,
    governmentFees: 0,
  };

  const totalEstimated =
    estimatedCosts.appVerifierFee +
    estimatedCosts.kycReverificationFee +
    estimatedCosts.documentProcessingFee +
    estimatedCosts.governmentFees;

  const handleChangeToggle = (change: string) => {
    setSelectedChanges((prev) =>
      prev.includes(change)
        ? prev.filter((c) => c !== change)
        : [...prev, change]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map((f) => f.name);
      setUploadedDocs((prev) => [...prev, ...fileNames]);
      toast.success(`${fileNames.length} document(s) uploaded`);
    }
  };

  const handleRemoveDoc = (doc: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d !== doc));
  };

  const canSubmit =
    selectedChanges.length > 0 &&
    reason.length >= 50 &&
    uploadedDocs.length > 0 &&
    Object.values(acknowledgments).every((v) => v) &&
    changeQuota.remaining > 0;

  const handleSubmitClick = () => {
    if (!canSubmit) {
      if (selectedChanges.length === 0) {
        toast.error('Please select at least one change');
      } else if (reason.length < 50) {
        toast.error('Reason must be at least 50 characters');
      } else if (uploadedDocs.length === 0) {
        toast.error('Please upload supporting documents');
      } else if (!Object.values(acknowledgments).every((v) => v)) {
        toast.error('Please acknowledge all statements');
      }
      return;
    }
    setShowOTPModal(true);
  };

  const handleOTPVerified = () => {
    toast.success('Change request submitted successfully!', {
      description: 'Verification process initiated (3-4 business days)',
    });
    setTimeout(() => {
      onSubmit({
        changes: selectedChanges,
        reason,
        documents: uploadedDocs,
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileEdit className="w-8 h-8 text-[#D4AF37]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Entity Change Request
            </h1>
          </div>
          <p className="text-gray-600">
            Changes require app verifier + KYC re-verification (48-72 hrs)
          </p>
        </div>

        {/* Change Quota Display */}
        <Card className="border-4 border-[#D4AF37] bg-gradient-to-br from-white to-[#D4AF37]/10 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
              🔄 CHANGE QUOTA STATUS
            </h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Allowed</p>
                <p className="text-4xl font-bold text-gray-900">{changeQuota.total}</p>
                <p className="text-xs text-gray-500 mt-1">changes</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Used to Date</p>
                <p className="text-4xl font-bold text-red-600">{changeQuota.used}</p>
                <p className="text-xs text-gray-500 mt-1">changes</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">REMAINING</p>
                <p className="text-4xl font-bold text-[#D4AF37]">{changeQuota.remaining}</p>
                <p className="text-xs text-gray-500 mt-1">changes</p>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={quotaPercentage} className="h-3" />
              <p className="text-center text-sm text-gray-600">
                {quotaPercentage}% of change quota remaining
              </p>
            </div>
            {changeQuota.remaining === 0 && (
              <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-3 text-center">
                <p className="text-red-800 font-semibold">
                  ⚠️ All changes exhausted - No more changes allowed
                </p>
              </div>
            )}
            {changeQuota.remaining > 0 && (
              <p className="mt-4 text-center text-sm text-yellow-700">
                ⚠️ Use wisely - Limited to {changeQuota.remaining} more lifetime changes
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Entity Summary */}
        <Card className="border-2 border-[#D4AF37]/30">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle>📋 Current Registered Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 pt-6">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900">{entityData.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Scale</p>
              <p className="font-semibold text-gray-900">{entityData.scale}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{entityData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Brands</p>
              <p className="font-semibold text-gray-900">
                {entityData.brands.join(', ')}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Roles</p>
              <p className="font-semibold text-gray-900">
                {entityData.rolesCount} assigned
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Request Form */}
        <Card className="border-2 border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle>🔧 What would you like to change?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Types */}
            <div className="space-y-2">
              {changeTypes.map((changeType) => (
                <label
                  key={changeType}
                  className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#D4AF37] cursor-pointer transition-all"
                >
                  <Checkbox
                    checked={selectedChanges.includes(changeType)}
                    onCheckedChange={() => handleChangeToggle(changeType)}
                  />
                  <span className="text-gray-900">{changeType}</span>
                </label>
              ))}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                📝 Reason for Change (Required, min 50 characters):
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter detailed reason for the change..."
                className="min-h-[100px] border-2 border-gray-300 focus:border-[#D4AF37]"
              />
              <p className="text-sm text-gray-600 mt-1">
                {reason.length}/50 characters {reason.length >= 50 ? '✓' : '(minimum)'}
              </p>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                📎 Supporting Documents:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-all">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload partnership deed, certificates, etc.
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG, DOCX (max 10MB each)</p>
                </label>
              </div>

              {uploadedDocs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded"
                    >
                      <span className="text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {doc}
                      </span>
                      <button
                        onClick={() => handleRemoveDoc(doc)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verification Requirements */}
        <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="space-y-4">
                <h3 className="font-bold text-red-900 text-lg">
                  ⚠️ MANDATORY VERIFICATION PROCESS
                </h3>
                <p className="text-sm text-red-800">This change will trigger:</p>

                <div className="space-y-3 text-sm text-red-800">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-semibold mb-1">1. 👨‍⚖️ APP-APPOINTED VERIFIER</p>
                    <ul className="ml-4 space-y-1">
                      <li>• Independent professional appointed by app</li>
                      <li>• Reviews documents & legitimacy</li>
                      <li>• Fee: ₹5,000 (non-refundable)</li>
                      <li>• Timeline: 24 hours for appointment</li>
                    </ul>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-semibold mb-1">2. 🆔 COMPLETE KYC RE-VERIFICATION</p>
                    <ul className="ml-4 space-y-1">
                      <li>• All partners/directors re-submit:</li>
                      <li className="ml-4">✓ Aadhaar + PAN verification</li>
                      <li className="ml-4">✓ Address proof (latest)</li>
                      <li className="ml-4">✓ Bank statements (3 months)</li>
                      <li className="ml-4">✓ Business registration docs</li>
                      <li>• Timeline: 48-72 hours processing</li>
                    </ul>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-semibold mb-1">3. 🔐 MULTI-MEMBER OTP APPROVAL</p>
                    <ul className="ml-4 space-y-1">
                      <li>• Minimum {requiredMembers} members must approve</li>
                      <li>• Simultaneous OTP sharing required</li>
                      <li>• All partners/directors must consent</li>
                      <li>• Timeline: Immediate (when members ready)</li>
                    </ul>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-semibold mb-1">4. 📊 AUDIT TRAIL UPDATE</p>
                    <ul className="ml-4 space-y-1">
                      <li>• Change logged permanently</li>
                      <li>• Visible to regulators/auditors</li>
                      <li>• Quota decremented (3→2→1→0)</li>
                      <li>• Cannot be reversed</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/80 rounded-lg p-3 border-2 border-red-400">
                  <p className="font-bold text-red-900">TOTAL PROCESSING TIME: 3-4 BUSINESS DAYS</p>
                  <p className="font-bold text-red-900">VERIFICATION FEE: ₹{totalEstimated.toLocaleString('en-IN')} + Govt Fees</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              💰 ESTIMATED COSTS FOR THIS CHANGE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">App Verifier Fee:</span>
                <span className="font-semibold">₹{estimatedCosts.appVerifierFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">KYC Re-verification:</span>
                <span className="font-semibold">₹{estimatedCosts.kycReverificationFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Document Processing:</span>
                <span className="font-semibold">₹{estimatedCosts.documentProcessingFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Government Fees (if any):</span>
                <span className="font-semibold">₹0-5,000</span>
              </div>
              <div className="flex justify-between py-3 bg-yellow-100 px-3 rounded-lg border-2 border-yellow-400 mt-2">
                <span className="font-bold text-gray-900">TOTAL ESTIMATED:</span>
                <span className="font-bold text-lg text-gray-900">
                  ₹{totalEstimated.toLocaleString('en-IN')}-{(totalEstimated + 5000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Processing Time: 3-4 business days
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceed Without Changes */}
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">
                  ✅ NO CHANGES NEEDED?
                </h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p>If current details are accurate:</p>
                  <p>• Zero verification fees</p>
                  <p>• Zero processing time</p>
                  <p>• All {changeQuota.total} changes preserved for future</p>
                  <p>• Immediate business operations</p>
                  <p className="font-semibold">• Recommended if details are correct</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Member Consent */}
        {!isIndividual && (
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                🔐 Multi-Member Approval Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">
                      {member.role} {member.share ? `(${member.share}%)` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Status:</p>
                    <p className="font-semibold text-yellow-700">⏳ Pending Consent</p>
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-600 text-center pt-2">
                All members must approve to proceed. Simultaneous OTP sharing will be required.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Legal Acknowledgment */}
        <Card className="border-2 border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle>Legal Acknowledgment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries({
              consumesChange: 'I understand this consumes 1 of 3 changes',
              verifierFee: 'I acknowledge ₹5,000 verifier fee',
              kycReverification: 'I agree to complete KYC re-verification',
              membersConsent: 'All members consent to this change',
              timeline: 'I accept 3-4 day processing timeline',
            }).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acknowledgments[key as keyof typeof acknowledgments]}
                  onCheckedChange={(checked) =>
                    setAcknowledgments((prev) => ({
                      ...prev,
                      [key]: checked as boolean,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {label}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-2 border-gray-300 hover:border-gray-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            onClick={onProceedWithoutChanges}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Proceed Without Changes (FREE)
          </Button>

          <Button
            onClick={handleSubmitClick}
            disabled={!canSubmit || changeQuota.remaining === 0}
            className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] text-white shadow-lg disabled:opacity-50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
            <Send className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">
              🔄 Submit Change Request ({requiredMembers}-Member OTP)
            </span>
          </Button>
        </div>
      </div>

      {/* Multi-Member OTP Modal */}
      <MultiMemberOTPModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerified}
        members={members}
        requestType="Entity Change Request"
        requiredMembers={requiredMembers}
      />
    </div>
  );
}
