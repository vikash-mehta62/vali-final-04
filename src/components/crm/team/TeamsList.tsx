
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, UserPlus, Users, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {createTeamCrmAPI,getAllTeamCrmAPI,updateTeamCrmAPI} from "@/services2/operations/crm"
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { TaskForm } from '../tasks/TasksManager';
// Sample data
const mockTeamMembers = [
  {
    id: '1',
    name: 'John Davis',
    email: 'john.davis@produceco.com',
    phone: '(555) 123-4567',
    role: 'Sales Manager',
    department: 'Sales',
    status: 'active',
    assignedTasks: 5
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@produceco.com',
    phone: '(555) 987-6543',
    role: 'Account Executive',
    department: 'Sales',
    status: 'active',
    assignedTasks: 8
  },
  {
    id: '3',
    name: 'Robert Kim',
    email: 'robert.kim@produceco.com',
    phone: '(555) 456-7890',
    role: 'Logistics Coordinator',
    department: 'Operations',
    status: 'active',
    assignedTasks: 3
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@produceco.com',
    phone: '(555) 234-5678',
    role: 'Customer Support',
    department: 'Support',
    status: 'on-leave',
    assignedTasks: 0
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'david.chen@produceco.com',
    phone: '(555) 876-5432',
    role: 'Delivery Driver',
    department: 'Logistics',
    status: 'active',
    assignedTasks: 2
  },
];

const TeamMemberForm = ({ member, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    id: member?.id || '',
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    role: member?.role || '',
    department: member?.department || '',
    status: member?.status || 'active',
    assignedTasks: member?.assignedTasks || 0
  });

  const token = useSelector((state: RootState) => state.auth?.token ?? null);
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData.id)
    if(formData.id){
await updateTeamCrmAPI(formData.id,formData)
    }else{
      await createTeamCrmAPI(formData,token)

    }
 
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium">Role</label>
          <Input 
            id="role" 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="department" className="block text-sm font-medium">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Department</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Support">Support</option>
            <option value="Logistics">Logistics</option>
            <option value="Administration">Administration</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {member ? 'Update Team Member' : 'Add Team Member'}
        </Button>
      </div>
    </form>
  );
};

const TeamsList = () => {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const { toast } = useToast();
  const[memberId,setMemberId] = useState(null)

  useEffect(() => {
    const fetchTeamAll = async () => {
      try {
        const res = await getAllTeamCrmAPI();
        if (res && Array.isArray(res)) {
          // _id ko id me map karna
          const formattedData = res.map(member => ({
            ...member,
            id: member._id, // _id ko id me convert karna
          }));
  
          setTeamMembers(formattedData); // setTeamMembers me save karna
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
  
    fetchTeamAll(); // Function ko call karna zaroori hai
  
  }, []);
  
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredTeamMembers = teamMembers.filter(member => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchTerms) ||
      member.email.toLowerCase().includes(searchTerms) ||
      member.role.toLowerCase().includes(searchTerms) ||
      member.department.toLowerCase().includes(searchTerms)
    );
  });
  
  const handleAddEdit = (data: any) => {
    if (data.id) {
      // Edit existing team member
      setTeamMembers(prev => 
        prev.map(member => member.id === data.id ? data : member)
      );
      
      toast({
        title: "Team member updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new team member
      const newMember = {
        ...data,
        id: String(teamMembers.length + 1),
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      
      toast({
        title: "Team member added",
        description: `${data.name} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingMember(null);
  };
  
  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    const memberToDelete = teamMembers.find(member => member.id === id);
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    
    toast({
      title: "Team member removed",
      description: `${memberToDelete?.name} has been removed.`,
      variant: "destructive",
    });
  };


  const assignTask = (id: string) => {

    toast({
      title: "Assign Task TEST",
      description: `Assign Task TEST`,
      variant: "destructive",
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pb-2">
        <CardTitle>Team Members</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            </DialogHeader>
            <TeamMemberForm 
              member={editingMember} 
              onSubmit={handleAddEdit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Role/Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Tasks</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeamMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    No team members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <span>{member.role}</span>
                        <span className="text-sm text-muted-foreground">{member.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <a href={`mailto:${member.email}`} className="flex items-center text-blue-600 hover:underline">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </a>
                        <a href={`tel:${member.phone}`} className="flex items-center text-blue-600 hover:underline mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {member.assignedTasks}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {handleEdit(member)}}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem
                          onClick={()=> {setMemberId(member.id);setIsTaskDialogOpen(true)}}
                          >Assign Tasks</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() =>{ handleDelete(member.id)}}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            {/* <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{`Assign Task to ${member?.name}`}</DialogTitle>
              </DialogHeader>
              <TaskForm 
                task={null} 
                onSubmit={assignTask} 
                onCancel={() => setIsTaskDialogOpen(false)}
                memberId={memberId}
              />
            </DialogContent>
          </Dialog>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

            
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamsList;
