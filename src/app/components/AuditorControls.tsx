import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Shield, FileText, AlertTriangle, CheckCircle2, XCircle, Download, 
  Lock, Unlock, Eye, Calendar, User, TrendingDown, Star, Brain,
  Filter, Search, Clock, DollarSign, Package
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';

interface AuditRecord {
  id: string;
  recordId: string;
  action: 'created' | 'edited' | 'approved' | 'rejected' | 'locked' | 'flagged';
  performedBy: string;
  role: string;
  timestamp: string;
  details: string;
  ipAddress: string;
  justification?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface FlaggedRecord {
  id: string;
  serialNo: string;
  buyerName: string;
  flagReason: string;
  flaggedBy: string;
  flaggedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

export function AuditorControls() {
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [filterAction, setFilterAction] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const auditTrail: AuditRecord[] = [
    {
      id: '1',
      recordId: 'TRD-2025-B001',
      action: 'edited',
      performedBy: 'Agent C',
      role: 'Agent',
      timestamp: '2025-10-27 14:35:22',
      details: 'Changed weight from 5000kg to 5100kg',
      ipAddress: '192.168.1.45',
      justification: 'Additional bags added after initial weighing',
      riskLevel: 'medium',
    },
    {
      id: '2',
      recordId: 'TRD-2025-B001',
      action: 'approved',
      performedBy: 'Admin User',
      role: 'Admin',
      timestamp: '2025-10-27 14:40:15',
      details: 'Approved bill with 2FA verification',
      ipAddress: '192.168.1.10',
      riskLevel: 'low',
    },
    {
      id: '3',
      recordId: 'TRD-2025-B002',
      action: 'flagged',
      performedBy: 'Auditor Team',
      role: 'Auditor',
      timestamp: '2025-10-27 13:22:10',
      details: 'Flagged for unusual payment pattern',
      ipAddress: '192.168.1.20',
      riskLevel: 'high',
    },
    {
      id: '4',
      recordId: 'TRD-2025-B003',
      action: 'rejected',
      performedBy: 'Manager User',
      role: 'Manager',
      timestamp: '2025-10-26 16:45:30',
      details: 'Rejected due to invalid documentation',
      ipAddress: '192.168.1.15',
      justification: 'GST certificate expired',
      riskLevel: 'high',
    },
    {
      id: '5',
      recordId: 'TRD-2025-B004',
      action: 'locked',
      performedBy: 'Blockchain System',
      role: 'System',
      timestamp: '2025-10-25 10:15:00',
      details: 'Record locked after blockchain confirmation',
      ipAddress: 'System',
      riskLevel: 'low',
    },
  ];

  const flaggedRecords: FlaggedRecord[] = [
    {
      id: '1',
      serialNo: 'TRD-2025-B002',
      buyerName: 'Sunita Reddy',
      flagReason: 'Multiple value changes (5 times)',
      flaggedBy: 'AI System',
      flaggedAt: '2025-10-27 09:00:00',
      status: 'pending',
      severity: 'high',
      notes: 'Pattern detected: Repeated corrections by Agent C',
    },
    {
      id: '2',
      serialNo: 'TRD-2025-B005',
      buyerName: 'Vikram Singh',
      flagReason: 'Unusual payment amount variance',
      flaggedBy: 'Auditor Team',
      flaggedAt: '2025-10-26 15:30:00',
      status: 'reviewed',
      severity: 'medium',
      notes: 'Amount differs significantly from historical average',
    },
    {
      id: '3',
      serialNo: 'TRD-2025-B007',
      buyerName: 'Neha Gupta',
      flagReason: 'Duplicate payment details',
      flaggedBy: 'AI System',
      flaggedAt: '2025-10-25 11:20:00',
      status: 'resolved',
      severity: 'critical',
      notes: 'Same bank account used by different buyer',
    },
  ];

  const getActionBadge = (action: string) => {
    const configs = {
      created: { color: 'bg-blue-500', icon: FileText, label: 'Created' },
      edited: { color: 'bg-amber-500', icon: AlertTriangle, label: 'Edited' },
      approved: { color: 'bg-green-500', icon: CheckCircle2, label: 'Approved' },
      rejected: { color: 'bg-red-500', icon: XCircle, label: 'Rejected' },
      locked: { color: 'bg-slate-500', icon: Lock, label: 'Locked' },
      flagged: { color: 'bg-purple-500', icon: AlertTriangle, label: 'Flagged' },
    };
    const config = configs[action as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
    };
    return <Badge className={`${colors[risk as keyof typeof colors]} text-white`}>{risk.toUpperCase()}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const configs = {
      low: { color: 'bg-green-500', label: 'Low' },
      medium: { color: 'bg-amber-500', label: 'Medium' },
      high: { color: 'bg-red-500', label: 'High' },
      critical: { color: 'bg-red-600 animate-pulse', label: 'Critical' },
    };
    const config = configs[severity as keyof typeof configs];
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-amber-500', label: 'Pending Review' },
      reviewed: { color: 'bg-blue-500', label: 'Reviewed' },
      resolved: { color: 'bg-green-500', label: 'Resolved' },
    };
    const config = configs[status as keyof typeof configs];
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const filteredAuditTrail = auditTrail.filter(record => {
    const matchesAction = filterAction === 'all' || record.action === filterAction;
    const matchesRisk = filterRisk === 'all' || record.riskLevel === filterRisk;
    return matchesAction && matchesRisk;
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Auditor Controls & Compliance Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Advanced audit trail, compliance monitoring, and risk management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Audit Log
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-slate-600">Total Audit Entries</p>
            </div>
            <p className="text-slate-900">{auditTrail.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-slate-600">Flagged Records</p>
            </div>
            <p className="text-slate-900">{flaggedRecords.filter(f => f.status === 'pending').length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-xs text-slate-600">High Risk Actions</p>
            </div>
            <p className="text-slate-900">{auditTrail.filter(a => a.riskLevel === 'high').length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-green-600" />
              <p className="text-xs text-slate-600">Locked Records</p>
            </div>
            <p className="text-slate-900">{auditTrail.filter(a => a.action === 'locked').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="audit-trail" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audit-trail" className="gap-2">
            <FileText className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="flagged" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Flagged Records
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <Shield className="w-4 h-4" />
            Compliance Rules
          </TabsTrigger>
          <TabsTrigger value="controls" className="gap-2">
            <Lock className="w-4 h-4" />
            Access Controls
          </TabsTrigger>
        </TabsList>

        {/* Audit Trail Tab */}
        <TabsContent value="audit-trail" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Action Type</Label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="edited">Edited</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger>
                      <Brain className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search records..." className="pl-10" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Audit Trail</CardTitle>
              <CardDescription>All actions performed on buyer records with timestamps and justifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditTrail.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {record.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.recordId}</Badge>
                      </TableCell>
                      <TableCell>{getActionBadge(record.action)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-900">{record.performedBy}</p>
                            <p className="text-xs text-slate-500">{record.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm max-w-md">
                        <p className="text-slate-700">{record.details}</p>
                        {record.justification && (
                          <p className="text-xs text-slate-500 mt-1">Justification: {record.justification}</p>
                        )}
                      </TableCell>
                      <TableCell>{getRiskBadge(record.riskLevel)}</TableCell>
                      <TableCell>
                        <Dialog open={showAuditDialog && selectedRecord?.id === record.id} onOpenChange={setShowAuditDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Audit Record Details</DialogTitle>
                              <DialogDescription>Complete information for audit entry</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-xs text-slate-500 mb-1">Record ID</p>
                                  <p className="text-slate-900">{record.recordId}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-xs text-slate-500 mb-1">Action</p>
                                  {getActionBadge(record.action)}
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-xs text-slate-500 mb-1">Performed By</p>
                                  <p className="text-slate-900">{record.performedBy}</p>
                                  <p className="text-xs text-slate-500">{record.role}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-xs text-slate-500 mb-1">Timestamp</p>
                                  <p className="text-slate-900 text-sm">{record.timestamp}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-xs text-slate-500 mb-1">IP Address</p>
                                  <p className="text-slate-900">{record.ipAddress}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                                  {getRiskBadge(record.riskLevel)}
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Details</p>
                                <p className="text-slate-900 text-sm">{record.details}</p>
                              </div>
                              {record.justification && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                  <p className="text-xs text-amber-700 mb-1">Justification</p>
                                  <p className="text-amber-900 text-sm">{record.justification}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged Records Tab */}
        <TabsContent value="flagged" className="space-y-4">
          {flaggedRecords.map((record) => (
            <Card 
              key={record.id} 
              className={`border-l-4 ${
                record.severity === 'critical' ? 'border-l-red-600' :
                record.severity === 'high' ? 'border-l-red-500' :
                record.severity === 'medium' ? 'border-l-amber-500' :
                'border-l-green-500'
              }`}
            >
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-slate-900">{record.buyerName}</h3>
                        <Badge variant="outline">{record.serialNo}</Badge>
                        {getSeverityBadge(record.severity)}
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        <strong>Flag Reason:</strong> {record.flagReason}
                      </p>
                      <p className="text-xs text-slate-500">
                        Flagged by {record.flaggedBy} on {record.flaggedAt}
                      </p>
                    </div>
                  </div>

                  <Alert className={`${
                    record.severity === 'critical' ? 'border-red-600 bg-red-50' :
                    record.severity === 'high' ? 'border-red-500 bg-red-50' :
                    record.severity === 'medium' ? 'border-amber-500 bg-amber-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <FileText className={`h-4 w-4 ${
                      record.severity === 'critical' || record.severity === 'high' ? 'text-red-600' :
                      record.severity === 'medium' ? 'text-amber-600' :
                      'text-green-600'
                    }`} />
                    <AlertDescription className={
                      record.severity === 'critical' || record.severity === 'high' ? 'text-red-800' :
                      record.severity === 'medium' ? 'text-amber-800' :
                      'text-green-800'
                    }>
                      <strong>Auditor Notes:</strong> {record.notes}
                    </AlertDescription>
                  </Alert>

                  {record.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 border-green-500 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Reviewed
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View Full Record
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 border-red-500 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        Escalate
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Compliance Rules Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Regulatory Rules</CardTitle>
              <CardDescription>Configure audit thresholds and compliance requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">Require 2FA for all approvals</p>
                    <p className="text-xs text-slate-500">Mandatory dual authentication for bill approval</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">Auto-flag records with 3+ edits</p>
                    <p className="text-xs text-slate-500">Automatic AI flagging for repeated changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">Blockchain verification required</p>
                    <p className="text-xs text-slate-500">Confirm all approved records on Polygon network</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">Daily audit report generation</p>
                    <p className="text-xs text-slate-500">Auto-generate and email audit reports daily</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">AI risk assessment enabled</p>
                    <p className="text-xs text-slate-500">Use machine learning for pattern detection</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-slate-900">Threshold Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Edits Before Review</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>High-Value Transaction (₹)</Label>
                    <Input type="number" defaultValue="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>AI Risk Threshold (%)</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-Lock After (days)</Label>
                    <Input type="number" defaultValue="7" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Controls Tab */}
        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control Matrix</CardTitle>
              <CardDescription>Role-based permissions and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Approve</TableHead>
                    <TableHead>Audit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Admin</TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Manager</TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><XCircle className="w-5 h-5 text-red-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Auditor</TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><XCircle className="w-5 h-5 text-red-500" /></TableCell>
                    <TableCell><XCircle className="w-5 h-5 text-red-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Operator</TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><CheckCircle2 className="w-5 h-5 text-green-500" /></TableCell>
                    <TableCell><XCircle className="w-5 h-5 text-red-500" /></TableCell>
                    <TableCell><XCircle className="w-5 h-5 text-red-500" /></TableCell>
                    <TableCell><XCircle className="w-5 h-5 text-red-500" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
