import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { MultiMemberOTPModal } from './MultiMemberOTPModal';
import { Lock, AlertTriangle, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationConfirmationScreenProps {
  entityData: {
    type: string;
    scale: string;
    name: string;
    brands: string[];
    rolesCount: number;
  };
  members: Array<{
    id: string;
    name: string;
    role: string;
    share?: number;
    phone: string;
  }>;
  onConfirm: () => void;
  onBack: () => void;
}

export function RegistrationConfirmationScreen({
  entityData,
  members,
  onConfirm,
  onBack,
}: RegistrationConfirmationScreenProps) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [acknowledgments, setAcknowledgments] = useState({
    permanent: false,
    changeLimit: false,
    kycReverification: false,
    multiMemberApproval: false,
    reviewedDetails: false,
  });

  const allAcknowledged = Object.values(acknowledgments).every((v) => v);
  const isIndividual = entityData.type === 'Individual';
  const requiredMembers = isIndividual ? 1 : Math.min(2, members.length);

  const handleConfirmClick = () => {
    if (!allAcknowledged) {
      toast.error('Please acknowledge all statements', {
        description: 'All checkboxes must be checked to proceed',
      });
      return;
    }
    setShowOTPModal(true);
  };

  const handleOTPVerified = () => {
    toast.success('Registration locked successfully!', {
      description: 'Your entity is now active with 3 changes remaining',
    });
    setTimeout(() => {
      onConfirm();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-8 h-8 text-[#D4AF37]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Registration Confirmation
            </h1>
          </div>
          <p className="text-gray-600">
            Once confirmed, entity details are locked. Changes limited to 3 times only.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="border-2 border-[#D4AF37]/30 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              Entity Registration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="grid grid-cols-2 gap-4">
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
                  {entityData.brands.join(', ')} ({entityData.brands.length})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roles</p>
                <p className="font-semibold text-gray-900">
                  {entityData.rolesCount} Assigned
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                  ⏳ PENDING CONFIRMATION
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Counter Badge */}
        <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-white to-[#D4AF37]/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-center mb-4 text-gray-900">
              🔄 Changes Remaining After Registration
            </h3>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-[#D4AF37] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
                <p className="text-sm text-gray-600 font-semibold">MAX</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-green-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  0
                </div>
                <p className="text-sm text-gray-600 font-semibold">USED</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#C19A2E] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
                <p className="text-sm text-gray-600 font-semibold">LEFT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lock Warning */}
        <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="font-bold text-red-900 text-lg">
                  ⚠️ IMPORTANT NOTICE
                </h3>
                <div className="space-y-2 text-sm text-red-800">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Registration is PERMANENT and LOCKED</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Entity details CANNOT be freely edited</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Only 3 changes allowed (lifetime limit)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Each change requires:</span>
                  </p>
                  <ul className="ml-6 space-y-1">
                    <li>• App-appointed verifier approval</li>
                    <li>• Complete KYC re-verification</li>
                    <li>• Multi-member OTP (min {requiredMembers} members)</li>
                    <li>• 48-72 hour verification period</li>
                  </ul>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Changes consume from limited quota</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Acknowledgment */}
        <Card className="border-2 border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-lg">Legal Acknowledgment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acknowledgments.permanent}
                  onCheckedChange={(checked) =>
                    setAcknowledgments((prev) => ({
                      ...prev,
                      permanent: checked as boolean,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I understand that registration is permanent
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acknowledgments.changeLimit}
                  onCheckedChange={(checked) =>
                    setAcknowledgments((prev) => ({
                      ...prev,
                      changeLimit: checked as boolean,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I acknowledge the 3-change lifetime limit
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acknowledgments.kycReverification}
                  onCheckedChange={(checked) =>
                    setAcknowledgments((prev) => ({
                      ...prev,
                      kycReverification: checked as boolean,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I agree to KYC re-verification for changes
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acknowledgments.multiMemberApproval}
                  onCheckedChange={(checked) =>
                    setAcknowledgments((prev) => ({
                      ...prev,
                      multiMemberApproval: checked as boolean,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I authorize multi-member approval process
                  {isIndividual && ' (Single OTP for Individual business)'}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acknowledgments.reviewedDetails}
                  onCheckedChange={(checked) =>
                    setAcknowledgments((prev) => ({
                      ...prev,
                      reviewedDetails: checked as boolean,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I have reviewed all details for accuracy
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back (Edit More)
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={!allAcknowledged}
            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] text-white shadow-lg disabled:opacity-50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
            <Lock className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">
              🔒 CONFIRM & LOCK REGISTRATION ({requiredMembers}-Member OTP Req)
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
        requestType="Registration Lock & Activation"
        requiredMembers={requiredMembers}
      />
    </div>
  );
}
