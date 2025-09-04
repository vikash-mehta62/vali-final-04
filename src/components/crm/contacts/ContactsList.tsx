import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  UserPlus,
  Building,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ContactForm from "./ContactForm";
import { useContacts, Contact } from "@/contexts/ContactsContext";
import {
  createContactCrmAPI,
  getAllContactCrmAPI,
  updateContactCrmAPI,
  deleteContactCrmAPI,
} from "@/services2/operations/crm";
import { toast } from "react-toastify";
const ContactsList = () => {
  const { isLoading, error, deleteContact, filteredContacts } = useContacts();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filtered = filteredContacts(searchQuery);

  const handleAddEdit = async (data: any) => {
    if (data.id) {
      // Edit existing contact
      const response = await updateContactCrmAPI(data.id, data);
      console.log(response);
      if (response) {
        toast.success(response?.message);
        setIsDialogOpen(false);
        setEditingContact(null);
        fetchContactCrm();
      }
    } else {
      const response = await createContactCrmAPI(data);
      if (response?.data?.success) {
        setIsDialogOpen(false);
        setEditingContact(null);
        fetchContactCrm();
      }
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const fetchContactCrm = async () => {
    const response = await getAllContactCrmAPI();
    const modifiedResponse = response.map((item) => ({
      ...item,
      id: item._id,
    }));
    setContacts(modifiedResponse);
  };

  const handleDelete = async (id) => {
    const response = await deleteContactCrmAPI(id);
    if (response?.success) {
      fetchContactCrm();
    }
  };
  useEffect(() => {
    fetchContactCrm();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lead":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      case "partner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pb-2">
        <CardTitle>Contacts</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContact(null)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Contact" : "Add Contact"}
              </DialogTitle>
            </DialogHeader>
            <ContactForm contact={editingContact} onSubmit={handleAddEdit} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading contacts...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-destructive/15 p-4 text-center">
            <p className="text-destructive">
              Error loading contacts: {error.message}
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Company
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Tags</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Type/Status
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-32 text-muted-foreground"
                    >
                      No contacts found
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {contact.company}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            {contact.email}
                          </a>
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center text-blue-600 hover:underline mt-1"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            {contact.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="whitespace-nowrap"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <Badge className={getTypeColor(contact.type)}>
                            {contact.type}
                          </Badge>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                        </div>
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
                            <DropdownMenuItem
                              onClick={() => handleEdit(contact)}
                            >
                              Edit
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Add Activity</DropdownMenuItem> */}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(contact.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsList;
