import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  Users, Shield, Edit, Trash2, Plus, Search, 
  Eye, FileEdit, CheckCircle, XCircle, Database
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';

interface RoleManagementProps {
  userRole: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator' | 'auditor';
  permissions: {
    viewRecords: boolean;
    createRecords: boolean;
    editRecords: boolean;
    deleteRecords: boolean;
    approveRecords: boolean;
    viewInsights: boolean;
    manageUsers: boolean;
    exportData: boolean;
  };
  status: 'active' | 'inactive';
  lastActive: string;
}

export function RoleManagement({ userRole }: RoleManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const canManageRoles = userRole === 'admin';

  const roleDefinitions = {
    admin: {
      label: 'Administrator',
      color: 'bg-purple-500',
      description: 'Full system access with all permissions',
      permissions: ['All Permissions'],
    },
    manager: {
      label: 'Manager',
      color: 'bg-blue-500',
      description: 'Can manage records, approve transactions, and view insights',
      permissions: ['View', 'Create', 'Edit', 'Approve', 'Insights'],
    },
    operator: {
      label: 'Operator',
      color: 'bg-green-500',
      description: 'Can create and view records',
      permissions: ['View', 'Create'],
    },
    auditor: {
      label: 'Auditor',
      color: 'bg-amber-500',
      description: 'Can view all records and insights, approve transactions',
      permissions: ['View', 'Approve', 'Insights'],
    },
  };

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@tradie.com',
      role: 'admin',
      permissions: {
        viewRecords: true,
        createRecords: true,
        editRecords: true,
        deleteRecords: true,
        approveRecords: true,
        viewInsights: true,
        manageUsers: true,
        exportData: true,
      },
      status: 'active',
      lastActive: '2025-10-27 10:30 AM',
    },
    {
      id: '2',
      name: 'Priya Verma',
      email: 'priya.verma@tradie.com',
      role: 'manager',
      permissions: {
        viewRecords: true,
        createRecords: true,
        editRecords: true,
        deleteRecords: false,
        approveRecords: true,
        viewInsights: true,
        manageUsers: false,
        exportData: true,
      },
      status: 'active',
      lastActive: '2025-10-27 09:15 AM',
    },
    {
      id: '3',
      name: 'Rahul Singh',
      email: 'rahul.singh@tradie.com',
      role: 'operator',
      permissions: {
        viewRecords: true,
        createRecords: true,
        editRecords: false,
        deleteRecords: false,
        approveRecords: false,
        viewInsights: false,
        manageUsers: false,
        exportData: false,
      },
      status: 'active',
      lastActive: '2025-10-27 08:45 AM',
    },
    {
      id: '4',
      name: 'Anjali Desai',
      email: 'anjali.desai@tradie.com',
      role: 'auditor',
      permissions: {
        viewRecords: true,
        createRecords: false,
        editRecords: false,
        deleteRecords: false,
        approveRecords: true,
        viewInsights: true,
        manageUsers: false,
        exportData: true,
      },
      status: 'active',
      lastActive: '2025-10-26 05:30 PM',
    },
    {
      id: '5',
      name: 'Vikram Mehta',
      email: 'vikram.mehta@tradie.com',
      role: 'operator',
      permissions: {
        viewRecords: true,
        createRecords: true,
        editRecords: false,
        deleteRecords: false,
        approveRecords: false,
        viewInsights: false,
        manageUsers: false,
        exportData: false,
      },
      status: 'inactive',
      lastActive: '2025-10-20 02:15 PM',
    },
  ];

  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!canManageRoles && userRole !== 'manager') {
    return (
      <Alert className="border-amber-500 bg-amber-50">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          You don't have permission to manage roles. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(roleDefinitions).map(([key, role]) => (
          <Card key={key} className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`${role.color} p-2 rounded-lg`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 mb-1">{role.label}</h3>
                  <p className="text-xs text-slate-600 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((perm, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Management */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Staff Members
              </CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </div>
            {canManageRoles && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                      Create a new user account with specific role and permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newName">Full Name</Label>
                        <Input id="newName" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Email</Label>
                        <Input id="newEmail" type="email" placeholder="email@tradie.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newRole">Role</Label>
                      <Select>
                        <SelectTrigger id="newRole">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="operator">Operator</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">Create User</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search staff by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Staff List */}
          <div className="space-y-3">
            {filteredStaff.map((staff) => (
              <Card key={staff.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-slate-900">{staff.name}</h3>
                        <Badge className={`${roleDefinitions[staff.role].color} text-white`}>
                          {roleDefinitions[staff.role].label}
                        </Badge>
                        <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                          {staff.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{staff.email}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {staff.permissions.viewRecords && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Eye className="w-3 h-3" />
                            View
                          </Badge>
                        )}
                        {staff.permissions.createRecords && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Plus className="w-3 h-3" />
                            Create
                          </Badge>
                        )}
                        {staff.permissions.editRecords && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Edit className="w-3 h-3" />
                            Edit
                          </Badge>
                        )}
                        {staff.permissions.deleteRecords && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Badge>
                        )}
                        {staff.permissions.approveRecords && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </Badge>
                        )}
                        {staff.permissions.viewInsights && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Database className="w-3 h-3" />
                            Insights
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        Last active: {staff.lastActive}
                      </p>
                    </div>

                    {canManageRoles && (
                      <div className="flex items-center gap-2">
                        <Dialog open={isEditDialogOpen && selectedStaff?.id === staff.id} 
                                onOpenChange={(open) => {
                                  setIsEditDialogOpen(open);
                                  if (!open) setSelectedStaff(null);
                                }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedStaff(staff)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Staff Permissions</DialogTitle>
                              <DialogDescription>
                                Manage role and individual permissions for {staff.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="editRole">Role</Label>
                                <Select defaultValue={staff.role}>
                                  <SelectTrigger id="editRole">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="operator">Operator</SelectItem>
                                    <SelectItem value="auditor">Auditor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Separator />

                              <div>
                                <h3 className="text-slate-900 mb-4">Individual Permissions</h3>
                                <div className="space-y-4">
                                  {Object.entries({
                                    viewRecords: 'View Records',
                                    createRecords: 'Create Records',
                                    editRecords: 'Edit Records',
                                    deleteRecords: 'Delete Records',
                                    approveRecords: 'Approve Records',
                                    viewInsights: 'View AI Insights',
                                    manageUsers: 'Manage Users',
                                    exportData: 'Export Data',
                                  }).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                      <Label htmlFor={key} className="cursor-pointer">
                                        {label}
                                      </Label>
                                      <Switch 
                                        id={key}
                                        defaultChecked={staff.permissions[key as keyof typeof staff.permissions]}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-2">
                                <Label htmlFor="status">Account Status</Label>
                                <Select defaultValue={staff.status}>
                                  <SelectTrigger id="status">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {staff.role !== 'admin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
