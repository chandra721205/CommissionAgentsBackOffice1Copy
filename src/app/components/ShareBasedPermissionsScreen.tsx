import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MultiMemberOTPModal } from './MultiMemberOTPModal';
import { 
  Scale, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Shield,
  Eye,
  Edit,
  FileCheck,
  DollarSign,
  Info,
  ArrowRight,
  Save,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface MemberPermission {
  id: string;
  name: string;
  position: string;
  share: number;
  stake: 'Unlimited' | 'Limited' | 'None';
  permissions: {
    viewAccess: string;
    suggestRights: boolean;
    editRectify: boolean | string;
    approveChanges: boolean;
    financialAccess: string;
    multiApprovalReq: boolean;
  };
  authentication: {
    individualOTP: boolean;
    otherMembersOTP: string[];
    biometric2FA: boolean;
  };
}

interface ShareBasedPermissionsScreenProps {
  entityData: {
    type: string;
    name: string;
  };
  members: Array<{
    id: string;
    name: string;
    role: string;
    share?: number;
    phone: string;
  }>;
  onSave: () => void;
  onProceed: () => void;
}

export function ShareBasedPermissionsScreen({
  entityData,
  members,
  onSave,
  onProceed,
}: ShareBasedPermissionsScreenProps) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAIInsight, setShowAIInsight] = useState(true);

  const isIndividual = entityData.type === 'Individual';
  const requiredMembers = isIndividual ? 1 : 2;

  // Auto-calculated permissions based on share and position
  const memberPermissions: MemberPermission[] = members.map((member) => {
    const share = member.share || 0;
    const isPartner = member.role.includes('Partner') || member.role.includes('Director');
    const isManager = member.role.includes('Manager');
    const isStaff = !isPartner && !isManager;

    return {
      id: member.id,
      name: member.name,
      position: member.role,
      share,
      stake: isPartner ? (share > 0 ? 'Unlimited' : 'Limited') : 'None',
      permissions: {
        viewAccess: share >= 50 || member.role === 'Owner' ? 'FULL (100%)' : isManager ? 'FULL (Ops Data)' : 'LIMITED (Bills)',
        suggestRights: true,
        editRectify: share >= 50 || member.role === 'Owner' ? true : isManager ? 'LIMITED (Ops)' : false,
        approveChanges: share >= 50 || member.role === 'Owner' ? true : false,
        financialAccess: share >= 50 || member.role === 'Owner' ? `FULL (${share}% share)` : isManager ? 'READ-ONLY' : 'NONE',
        multiApprovalReq: share >= 50 || member.role === 'Owner' ? (isIndividual ? false : true) : false,
      },
      authentication: {
        individualOTP: share >= 50 || member.role === 'Owner' || isManager,
        otherMembersOTP: share >= 50 && !isIndividual ? members.filter(m => m.id !== member.id && (m.share || 0) >= 50).map(m => m.id) : [],
        biometric2FA: share >= 50 || member.role === 'Owner',
      },
    };
  });

  const handleSaveClick = () => {
    setShowOTPModal(true);
  };

  const handleOTPVerified = () => {
    toast.success('Permissions saved successfully!', {
      description: 'Proportionate permissions locked until next change',
    });
    setTimeout(() => {
      onSave();
    }, 500);
  };

  const PermissionIcon = ({ allowed }: { allowed: boolean | string }) => {
    if (typeof allowed === 'string') {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
    return allowed ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-8 h-8 text-[#D4AF37]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Proportionate Permission Allocation
            </h1>
          </div>
          <p className="text-gray-600">
            Permissions based on share % and position in entity
          </p>
        </div>

        {/* Entity Context */}
        <Card className="border-2 border-[#D4AF37]/30 bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
          <CardContent className="pt-6">
            <p className="text-center">
              <span className="font-bold text-gray-900">🏢 {entityData.name}</span>
              <span className="text-gray-600 ml-2">
                ({entityData.type})
              </span>
            </p>
          </CardContent>
        </Card>

        {/* AI Grok Insight */}
        {showAIInsight && (
          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Bot className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-2">
                    🤖 AI GROK PROPORTIONATE ALLOCATION
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>✓ Permissions auto-calculated from share %</p>
                    <p>✓ 50% share = 50% financial access rights</p>
                    <p>✓ Position (Partner/Manager/Staff) determines approval hierarchy</p>
                    <p>✓ Multi-member OTP enforces mutual consent</p>
                    <p>✓ Staff excluded from financial/strategic decisions (fraud prevention)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIInsight(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Member Permission Cards */}
        <div className="space-y-4">
          {memberPermissions.map((member) => (
            <Card
              key={member.id}
              className="border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-lg"
            >
              <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF]">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    👤 {member.name}
                  </div>
                  {member.share > 0 && (
                    <Badge className="bg-[#D4AF37] text-white">
                      {member.share}% Share
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Position Info */}
                <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-semibold text-gray-900">{member.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Share</p>
                    <p className="font-semibold text-gray-900">
                      {member.share}% {member.share > 0 ? `(${member.stake} Liability)` : '(Employee)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stake</p>
                    <Badge
                      variant={member.stake === 'Unlimited' ? 'destructive' : member.stake === 'Limited' ? 'default' : 'secondary'}
                    >
                      {member.stake}
                    </Badge>
                  </div>
                </div>

                {/* Auto-Calculated Permissions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    📊 Auto-Calculated Permissions:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">View Access:</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {member.permissions.viewAccess}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Suggest Rights:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PermissionIcon allowed={member.permissions.suggestRights} />
                        <span className="text-sm font-semibold text-gray-900">
                          {member.permissions.suggestRights ? 'YES' : 'NO'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Edit/Rectify:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PermissionIcon allowed={member.permissions.editRectify} />
                        <span className="text-sm font-semibold text-gray-900">
                          {typeof member.permissions.editRectify === 'string'
                            ? member.permissions.editRectify
                            : member.permissions.editRectify
                            ? 'YES (with OTP)'
                            : 'NO'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Approve Changes:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PermissionIcon allowed={member.permissions.approveChanges} />
                        <span className="text-sm font-semibold text-gray-900">
                          {member.permissions.approveChanges ? 'YES (2FA)' : 'NO (Suggest only)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Financial Access:</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {member.permissions.financialAccess}
                      </span>
                    </div>

                    {member.permissions.multiApprovalReq !== undefined && (
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Multi-Approval Required:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PermissionIcon allowed={member.permissions.multiApprovalReq} />
                          <span className="text-sm font-semibold text-gray-900">
                            {member.permissions.multiApprovalReq ? 'YES (Other Members)' : 'N/A'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Authentication */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4" />
                    🔐 Authentication:
                  </h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>• Individual OTP: {member.authentication.individualOTP ? 'Required' : 'Not required'}</p>
                    {member.authentication.otherMembersOTP.length > 0 && (
                      <p>• Other Members OTP: Required ({member.authentication.otherMembersOTP.length} members)</p>
                    )}
                    <p>• Biometric 2FA: {member.authentication.biometric2FA ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Multi-Member Approval Matrix */}
        {!isIndividual && (
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                🔐 2-Member OTP Requirement Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-purple-300">
                      <th className="text-left py-2 px-3 font-semibold text-purple-900">
                        Action Type
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-purple-900">
                        Approval Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { action: 'Financial Edit', approval: 'All Partners' },
                      { action: 'Entity Change', approval: 'All Partners' },
                      { action: 'Role Assignment', approval: 'All Partners' },
                      { action: 'Share Modification', approval: 'All Partners' },
                      { action: 'Contract Approval', approval: 'All Partners' },
                      { action: 'Operational Change', approval: 'Any 1 Partner' },
                      { action: 'View/Suggest', approval: 'Individual Only' },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-purple-200">
                        <td className="py-2 px-3 text-purple-800">{row.action}</td>
                        <td className="py-2 px-3 font-semibold text-purple-900">
                          {row.approval}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legal Justification */}
        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">
                  ℹ️ {entityData.type === 'Partnership' ? 'PARTNERSHIP ACT 1932 - EQUAL PARTNERS' : 'LEGAL JUSTIFICATION'}
                </h3>
                <div className="space-y-1 text-sm text-blue-800">
                  {entityData.type === 'Partnership' ? (
                    <>
                      <p>• Equal share (50-50) = Equal permissions</p>
                      <p>• Unlimited liability = Full mutual consent</p>
                      <p>• Major decisions require 2-member approval</p>
                      <p>• Financial transactions need dual OTP</p>
                      <p>• Proportionate to stake and liability</p>
                      <p>• Least privilege for staff (ISO 27001)</p>
                    </>
                  ) : (
                    <>
                      <p>• Permissions proportionate to shareholding</p>
                      <p>• Position determines approval hierarchy</p>
                      <p>• Multi-member consent for critical changes</p>
                      <p>• Least privilege principle for staff</p>
                      <p>• Compliance with applicable regulations</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exception Notice for Individual */}
        {isIndividual && (
          <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">
                    ⚠️ EXCEPTION: INDIVIDUAL BUSINESS
                  </h3>
                  <div className="space-y-1 text-sm text-yellow-800">
                    <p>Individual/Sole Proprietor entities:</p>
                    <p>• Single OTP only (owner)</p>
                    <p>• No multi-member approval required</p>
                    <p>• Full control with personal liability</p>
                    <p>• Staff: View-only (no approval rights)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formula Display */}
        <Card className="border-2 border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              📐 PERMISSION CALCULATION FORMULA
            </h3>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 font-mono text-sm">
              <p className="text-gray-900 mb-3">
                Permission_Level = f(Share%, Position, Stake)
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Where:</strong></p>
                <p>• Share% = Ownership percentage</p>
                <p>• Position = Partner/Director/Manager/Staff</p>
                <p>• Stake = Liability level (Unlimited/Limited/None)</p>
              </div>
              <div className="mt-4 space-y-2 text-gray-700">
                <p><strong>Examples:</strong></p>
                <p>• 50% Partner + Unlimited = FULL access</p>
                <p>• 0% Manager + None = Ops-only access</p>
                <p>• 0% Staff + None = View-only access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleSaveClick}
            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:from-[#C19A2E] hover:to-[#D4AF37] text-white shadow-lg py-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
            <Save className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">
              💾 Save Proportionate Permissions ({requiredMembers}-Member OTP)
            </span>
          </Button>

          <Button
            onClick={onProceed}
            variant="outline"
            className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50 py-6"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Proceed to Operations
            <span className="text-sm ml-2 opacity-75">(Permissions Locked)</span>
          </Button>
        </div>
      </div>

      {/* Multi-Member OTP Modal */}
      <MultiMemberOTPModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerified}
        members={members}
        requestType="Save Proportionate Permissions"
        requiredMembers={requiredMembers}
      />
    </div>
  );
}
