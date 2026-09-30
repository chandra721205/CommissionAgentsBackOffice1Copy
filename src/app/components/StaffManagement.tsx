'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  UserPlus, 
  Search, 
  Users, 
  Shield, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type StaffRole = 'Salesman' | 'Weighing Laborer' | 'Quality Supervisor' | 'Receiver' | 
                 'Watchman' | 'Laborer' | 'Sample Mover' | 'Expense Approver' | 'Supervisor' | 'Other';

type Permission = 'AgentOnly' | 'MarketOnly' | 'AgentAndAdmin' | 'AgentAndExpense' | 'StorageOnly' | 'Flexible';

type ActiveStatus = 'Active' | 'Inactive' | 'Pending';

interface StaffMember {
  staffId: string;
  staffName: string;
  assignedRoles: StaffRole[];
  permissions: Permission[];
  associatedVillage: string;
  activeStatus: ActiveStatus;
  notes: string;
  contactNumber?: string;
  joinDate?: Date;
  lastModified?: Date;
  modifiedBy?: string;
}

// ============================================================================
// ROLE & PERMISSION CONFIGURATIONS
// ============================================================================

const AVAILABLE_ROLES: { role: StaffRole; icon: string; description: string }[] = [
  { role: 'Salesman', icon: '💼', description: 'Bill entry, credit authorization' },
  { role: 'Weighing Laborer', icon: '⚖️', description: 'Weight data entry, verification' },
  { role: 'Quality Supervisor', icon: '✅', description: 'Quality tier verification' },
  { role: 'Receiver', icon: '📦', description: 'QR confirmation, receiving' },
  { role: 'Watchman', icon: '👁️', description: 'Arrival monitoring, security' },
  { role: 'Laborer', icon: '🔨', description: 'Physical handling, loading' },
  { role: 'Sample Mover', icon: '🚚', description: 'Storage-market transfer' },
  { role: 'Expense Approver', icon: '💰', description: 'Expense authorization' },
  { role: 'Supervisor', icon: '👔', description: 'Operations supervision' },
  { role: 'Other', icon: '⚙️', description: 'Custom/undefined roles' }
];

const PERMISSION_LEVELS: { permission: Permission; icon: string; description: string; color: string }[] = [
  { permission: 'AgentOnly', icon: '🔐', description: 'Commission Agent exclusive', color: 'bg-red-100 text-red-800' },
  { permission: 'MarketOnly', icon: '🏪', description: 'Market operations only', color: 'bg-blue-100 text-blue-800' },
  { permission: 'AgentAndAdmin', icon: '👥', description: 'Agent + Admin access', color: 'bg-purple-100 text-purple-800' },
  { permission: 'AgentAndExpense', icon: '💰', description: 'Agent + Expense management', color: 'bg-green-100 text-green-800' },
  { permission: 'StorageOnly', icon: '📦', description: 'Storage operations only', color: 'bg-yellow-100 text-yellow-800' },
  { permission: 'Flexible', icon: '🔄', description: 'Flexible access (to be defined)', color: 'bg-gray-100 text-gray-800' }
];

const VILLAGES = ['Guntur', 'Gurajepalli', 'Bommalapuram', 'Tenali', 'Mangalagiri', 'Chilakaluripet', 'Any'];

// ============================================================================
// MOCK DATA - STAFF MEMBERS
// ============================================================================

const initialStaffData: StaffMember[] = [
  {
    staffId: 'ST101',
    staffName: 'G. Rama Rao',
    assignedRoles: ['Salesman', 'Weighing Laborer'],
    permissions: ['MarketOnly'],
    associatedVillage: 'Guntur',
    activeStatus: 'Active',
    notes: 'Main market handler',
    contactNumber: '+91 98765 43210',
    joinDate: new Date('2024-01-15'),
    lastModified: new Date('2025-03-15'),
    modifiedBy: 'Agent1'
  },
  {
    staffId: 'ST102',
    staffName: 'S. Suresh',
    assignedRoles: ['Quality Supervisor', 'Receiver'],
    permissions: ['AgentAndAdmin'],
    associatedVillage: 'Gurajepalli',
    activeStatus: 'Active',
    notes: 'Quality, receiving',
    contactNumber: '+91 98765 43211',
    joinDate: new Date('2024-02-20'),
    lastModified: new Date('2025-04-01'),
    modifiedBy: 'Agent1'
  },
  {
    staffId: 'ST103',
    staffName: 'A. Sridevi',
    assignedRoles: ['Watchman', 'Laborer', 'Sample Mover'],
    permissions: ['StorageOnly'],
    associatedVillage: 'Bommalapuram',
    activeStatus: 'Active',
    notes: 'Handles movement',
    contactNumber: '+91 98765 43212',
    joinDate: new Date('2024-03-10'),
    lastModified: new Date('2025-03-28'),
    modifiedBy: 'Agent2'
  },
  {
    staffId: 'ST104',
    staffName: 'Unassigned',
    assignedRoles: ['Other'],
    permissions: ['Flexible'],
    associatedVillage: 'Any',
    activeStatus: 'Pending',
    notes: 'For future roles',
    joinDate: new Date('2025-04-01')
  },
  {
    staffId: 'ST105',
    staffName: 'K. Venkat',
    assignedRoles: ['Expense Approver', 'Supervisor'],
    permissions: ['AgentAndExpense', 'AgentAndAdmin'],
    associatedVillage: 'Guntur',
    activeStatus: 'Active',
    notes: 'Senior supervisor, expense authorization',
    contactNumber: '+91 98765 43213',
    joinDate: new Date('2023-11-05'),
    lastModified: new Date('2025-04-05'),
    modifiedBy: 'Agent1'
  },
  {
    staffId: 'ST106',
    staffName: 'M. Lakshmi',
    assignedRoles: ['Receiver', 'Laborer'],
    permissions: ['MarketOnly'],
    associatedVillage: 'Tenali',
    activeStatus: 'Active',
    notes: 'Market receiving, physical handling',
    contactNumber: '+91 98765 43214',
    joinDate: new Date('2024-06-15'),
    lastModified: new Date('2025-03-20'),
    modifiedBy: 'Agent2'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVillage, setFilterVillage] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVillage = filterVillage === 'all' || staff.associatedVillage === filterVillage;
    const matchesStatus = filterStatus === 'all' || staff.activeStatus === filterStatus;
    
    return matchesSearch && matchesVillage && matchesStatus;
  });

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const stats = {
    total: staffMembers.length,
    active: staffMembers.filter(s => s.activeStatus === 'Active').length,
    pending: staffMembers.filter(s => s.activeStatus === 'Pending').length,
    inactive: staffMembers.filter(s => s.activeStatus === 'Inactive').length,
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getRoleIcon = (role: StaffRole): string => {
    return AVAILABLE_ROLES.find(r => r.role === role)?.icon || '⚙️';
  };

  const getPermissionConfig = (permission: Permission) => {
    return PERMISSION_LEVELS.find(p => p.permission === permission) || PERMISSION_LEVELS[5];
  };

  const getStatusIcon = (status: ActiveStatus) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Inactive': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadgeColor = (status: ActiveStatus): string => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-[#EDF2F7] to-[#E2E8F0] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-[#4A5568] to-[#2D3748] rounded-xl shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl text-gray-900">Staff Management</h1>
            <p className="text-gray-600">Separate role & permission assignments for internal operations</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-2 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active</p>
                <p className="text-2xl text-green-700">{stats.active}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl text-yellow-700">{stats.pending}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Inactive</p>
                <p className="text-2xl text-red-700">{stats.inactive}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-xl border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-[#F7FAFC] to-[#D9F2FF] border-b-2 border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-[#D4AF37]" />
                Staff Directory
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage staff roles, permissions, and village assignments
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#9C7A1A] text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-[#D4AF37]"
              />
            </div>

            {/* Village Filter */}
            <Select value={filterVillage} onValueChange={setFilterVillage}>
              <SelectTrigger className="border-2 border-gray-200">
                <SelectValue placeholder="Filter by village" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Villages</SelectItem>
                {VILLAGES.map(village => (
                  <SelectItem key={village} value={village}>{village}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-2 border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Staff Table */}
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableHead className="font-bold text-gray-900">Staff ID</TableHead>
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900">Assigned Roles</TableHead>
                  <TableHead className="font-bold text-gray-900">Permissions</TableHead>
                  <TableHead className="font-bold text-gray-900">Village</TableHead>
                  <TableHead className="font-bold text-gray-900">Status</TableHead>
                  <TableHead className="font-bold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.staffId} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-mono text-sm text-gray-700">{staff.staffId}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium text-gray-900">{staff.staffName}</div>
                      {staff.contactNumber && (
                        <div className="text-sm text-gray-500">{staff.contactNumber}</div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {staff.assignedRoles.slice(0, 2).map((role, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {getRoleIcon(role)} {role}
                          </Badge>
                        ))}
                        {staff.assignedRoles.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-100">
                            +{staff.assignedRoles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {staff.permissions.map((perm, idx) => {
                          const config = getPermissionConfig(perm);
                          return (
                            <Badge key={idx} className={`text-xs ${config.color}`}>
                              {config.icon} {perm}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {staff.associatedVillage}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(staff.activeStatus)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(staff.activeStatus)}
                        {staff.activeStatus}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No staff members found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-[#D4AF37]" />
              Staff Member Details
            </DialogTitle>
            <DialogDescription>
              Complete information for {selectedStaff?.staffName}
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div>
                  <Label className="text-sm text-gray-600">Staff ID</Label>
                  <p className="font-mono text-gray-900">{selectedStaff.staffId}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Name</Label>
                  <p className="text-gray-900">{selectedStaff.staffName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Village</Label>
                  <p className="flex items-center gap-1 text-gray-900">
                    <MapPin className="h-3 w-3" />
                    {selectedStaff.associatedVillage}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <Badge className={`${getStatusBadgeColor(selectedStaff.activeStatus)} flex items-center gap-1 w-fit mt-1`}>
                    {getStatusIcon(selectedStaff.activeStatus)}
                    {selectedStaff.activeStatus}
                  </Badge>
                </div>
              </div>

              {/* Roles */}
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Assigned Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.assignedRoles.map((role, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm py-1 px-3">
                      {getRoleIcon(role)} {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.permissions.map((perm, idx) => {
                    const config = getPermissionConfig(perm);
                    return (
                      <Badge key={idx} className={`${config.color} text-sm py-1 px-3`}>
                        {config.icon} {perm}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Contact & Dates */}
              <div className="grid grid-cols-2 gap-4">
                {selectedStaff.contactNumber && (
                  <div>
                    <Label className="text-sm text-gray-600">Contact Number</Label>
                    <p className="text-gray-900">{selectedStaff.contactNumber}</p>
                  </div>
                )}
                {selectedStaff.joinDate && (
                  <div>
                    <Label className="text-sm text-gray-600">Join Date</Label>
                    <p className="text-gray-900">{selectedStaff.joinDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <Label className="text-sm text-gray-600">Notes</Label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1">
                  {selectedStaff.notes || 'No notes available'}
                </p>
              </div>

              {/* Audit Info */}
              {selectedStaff.lastModified && (
                <div className="text-sm text-gray-500 border-t pt-3">
                  Last modified: {selectedStaff.lastModified.toLocaleString()} by {selectedStaff.modifiedBy}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
