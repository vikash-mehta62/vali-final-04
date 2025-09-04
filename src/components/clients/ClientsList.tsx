
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  FileText,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import { Client, formatCurrency, formatDate } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Link, useNavigate } from 'react-router-dom';
import ClientForm from './ClientForm';
import EditClientModal from './EditClientModal';

interface ClientsListProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, onAddClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleEdit = (id: string) => {
    setActiveClientId(id);
    setIsEditModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setActiveClientId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Client Deleted",
        description: `The client has been removed`,
        variant: "destructive",
      });
    }, 1000);
  };
  
  const handleViewOrders = (id: string) => {
    toast({
      title: "View Client Orders",
      description: `Viewing orders for client ${id}`,
    });
    // In a real implementation, this would navigate to the orders page
    // filtered for this client
  };
  
  const handleViewProfile = (id: string) => {
    // Navigate to client profile page
    navigate(`/clients/profile/${id}`);
  };
  
  const handleAddClient = (clientData: Omit<Client, 'id'>) => {
    onAddClient(clientData);
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "New client has been added",
    });
  };
  
  const handleUpdateClient = (clientData: Omit<Client, 'id'>) => {
    // Simulate updating client
    // In a real app, this would call an API endpoint
    toast({
      title: "Client Updated",
      description: "Client information has been updated successfully",
    });
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the active client object if we have an ID
  const activeClient = clients.find(c => c.id === activeClientId);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-10">
              <Plus size={16} className="mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={handleAddClient} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No clients found
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-start justify-between">
                  <div className="cursor-pointer" onClick={() => handleViewProfile(client.id)}>
                    <h3 className="font-medium text-lg hover:text-primary transition-colors">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProfile(client.id)}>
                        <User size={14} className="mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewOrders(client.id)}>
                        <FileText size={14} className="mr-2" />
                        View Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(client.id)}>
                        <Edit size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <Trash size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                </div>
                
                <div className="border-t border-border/50 px-4 py-3 bg-muted/30 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      client.status === 'active' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {client.status === 'active' ? (
                        <span className="flex items-center gap-0.5">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span className="font-medium ml-1">{formatCurrency(client.totalSpent)}</span>
                  </div>
                </div>
                
                <div className="border-t border-border/50 px-4 py-2 text-xs">
                  <span className="text-muted-foreground">Last Order:</span>
                  <span className="ml-1">{formatDate(client.lastOrder)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Client Modal */}
      {activeClient && (
        <EditClientModal
          client={activeClient}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateClient}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsList;
