import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { BuyerDashboard } from './BuyerDashboard';
import { BuyerForm } from './BuyerForm';
import { ApprovalQueue } from './ApprovalQueue';
import { AIInsights } from './AIInsights';
import { RoleManagement } from './RoleManagement';
import { WeighingComplete } from './WeighingComplete';
import { PendingAuthorizationTable } from './PendingAuthorizationTable';
import { BuyerApprovalWait } from './BuyerApprovalWait';
import { BillApprovalScreen } from './BillApprovalScreen';
import { ConfirmedAppendLedger } from './ConfirmedAppendLedger';
import { WarningRatingSystem } from './WarningRatingSystem';
import { BuyerInsightsDashboard } from './BuyerInsightsDashboard';
import { AuditorControls } from './AuditorControls';
import { RatingHistoryPanel } from './RatingHistoryPanel';
import { ProfessionalBuyerDatabase } from './ProfessionalBuyerDatabase';
import { Bell, Database, Scale, Clock, Shield, CheckCircle2, AlertTriangle, Brain, Users, Star, FileText } from 'lucide-react';
import { Button } from './ui/button';

export function BuyerBackOffice() {
  const [activeTab, setActiveTab] = useState('weighing');
  const [pendingCount] = useState(12);
  const [aiAlertsCount] = useState(3);
  
  // Mock user role - in production this would come from auth
  const userRole = 'admin'; // admin, manager, operator, auditor

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">TRADIE Buyer Management</h1>
                <p className="text-slate-500 text-sm">Weighing & Bill Approval Workflow (8 Screens)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-amber-500 text-white text-xs">
                    {pendingCount}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  A
                </div>
                <div className="text-sm">
                  <div className="text-slate-900">Admin User</div>
                  <div className="text-slate-500 text-xs">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-md p-1 h-auto flex flex-wrap">
            <TabsTrigger value="weighing" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Scale className="w-4 h-4" />
              1. Weighing
            </TabsTrigger>
            <TabsTrigger value="pending-table" className="gap-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Clock className="w-4 h-4" />
              2. Pending
            </TabsTrigger>
            <TabsTrigger value="buyer-wait" className="gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Clock className="w-4 h-4" />
              3. Wait
            </TabsTrigger>
            <TabsTrigger value="bill-approval" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              4. Approve
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <CheckCircle2 className="w-4 h-4" />
              5. Confirmed
            </TabsTrigger>
            <TabsTrigger value="warnings" className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <AlertTriangle className="w-4 h-4" />
              6. Warnings
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              7. Insights
            </TabsTrigger>
            <TabsTrigger value="professional-db" className="gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              Pro DB
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Database className="w-4 h-4" />
              All Records
              {pendingCount > 0 && (
                <Badge className="bg-amber-500 text-white ml-1">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="auditor" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              Auditor
            </TabsTrigger>
            <TabsTrigger value="ratings" className="gap-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Star className="w-4 h-4" />
              Ratings
            </TabsTrigger>
            {(userRole === 'admin' || userRole === 'manager') && (
              <TabsTrigger value="roles" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                Roles
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="weighing" className="mt-6">
            <WeighingComplete onComplete={() => setActiveTab('pending-table')} />
          </TabsContent>

          <TabsContent value="pending-table" className="mt-6">
            <PendingAuthorizationTable />
          </TabsContent>

          <TabsContent value="buyer-wait" className="mt-6">
            <BuyerApprovalWait />
          </TabsContent>

          <TabsContent value="bill-approval" className="mt-6">
            <BillApprovalScreen onApprove={() => setActiveTab('confirmed')} />
          </TabsContent>

          <TabsContent value="confirmed" className="mt-6">
            <ConfirmedAppendLedger />
          </TabsContent>

          <TabsContent value="warnings" className="mt-6">
            <WarningRatingSystem />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <BuyerInsightsDashboard />
          </TabsContent>

          <TabsContent value="professional-db" className="mt-6">
            <ProfessionalBuyerDatabase />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <BuyerDashboard userRole={userRole} />
          </TabsContent>

          <TabsContent value="auditor" className="mt-6">
            <AuditorControls />
          </TabsContent>

          <TabsContent value="ratings" className="mt-6">
            <RatingHistoryPanel />
          </TabsContent>

          {(userRole === 'admin' || userRole === 'manager') && (
            <TabsContent value="roles" className="mt-6">
              <RoleManagement userRole={userRole} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
