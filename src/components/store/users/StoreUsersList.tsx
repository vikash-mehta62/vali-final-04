
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, UserPlus, ShieldCheck, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dummy data for demonstration
const dummyUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@freshmarket.com',
    store: 'Fresh Market Downtown',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-11-15T09:24:00'
  },
  {
    id: '2',
    name: 'Sara Johnson',
    email: 'sara@citysuper.com',
    store: 'City Supermarket',
    role: 'Viewer',
    status: 'Active',
    lastLogin: '2023-11-14T14:30:00'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@greengrocers.com',
    store: 'Green Grocers Uptown',
    role: 'Manager',
    status: 'Inactive',
    lastLogin: '2023-10-28T11:15:00'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@healthfoods.com',
    store: 'Health Foods Co.',
    role: 'Viewer',
    status: 'Pending',
    lastLogin: null
  }
];

const StoreUsersList = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(dummyUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    store: '',
    role: 'Viewer',
    status: 'Pending'
  });
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.store.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.store) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new user
    const user = {
      id: (users.length + 1).toString(),
      ...newUser,
      lastLogin: null
    };
    
    setUsers([...users, user]);
    setIsAddUserDialogOpen(false);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      store: '',
      role: 'Viewer',
      status: 'Pending'
    });
    
    toast({
      title: "User Created",
      description: `${user.name} has been added as a ${user.role.toLowerCase()}.`
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User Removed",
      description: "The user has been removed successfully."
    });
  };
  
  const handleInviteUser = (userId: string) => {
    toast({
      title: "Invitation Sent",
      description: "An invitation email has been sent to the user."
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin': return 'destructive';
      case 'Manager': return 'default';
      case 'Viewer': return 'secondary';
      default: return 'outline';
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      case 'Pending': return 'warning';
      default: return 'outline';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Store Users</CardTitle>
              <CardDescription>
                Manage access to the store portal for your clients.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.store}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role) as any}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status) as any}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.status === 'Pending' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleInviteUser(user.id)}
                            >
                              <Mail className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user with access to the store portal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter user's name"
                  value={newUser.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter user's email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="store" className="text-sm font-medium">Store</label>
                <Input
                  id="store"
                  name="store"
                  placeholder="Enter store name"
                  value={newUser.store}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreUsersList;
