import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the contact type
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: 'lead' | 'customer' | 'partner';
  status: 'active' | 'inactive' | 'new';
  tags: string[];
  lastContactDate: string;
  businessCategory?: string;
  businessSubcategory?: string;
  purchaseVolume?: string;
  preferredDeliveryDay?: string;
  notes?: string; // Added notes field to support lead conversion
}

interface ContactsContextType {
  contacts: Contact[];
  isLoading: boolean;
  error: Error | null;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactById: (id: string) => Contact | undefined;
  filteredContacts: (searchQuery: string) => Contact[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

// Sample data - in a real app, this would come from an API
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acmecorp.com',
    phone: '(555) 123-4567',
    company: 'Acme Corp',
    type: 'customer',
    status: 'active',
    tags: ['VIP', 'Decision Maker'],
    lastContactDate: '2024-05-01',
    businessCategory: 'wholesale',
    businessSubcategory: 'large',
    purchaseVolume: 'high',
    preferredDeliveryDay: 'monday',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techinnovations.com',
    phone: '(555) 987-6543',
    company: 'Tech Innovations',
    type: 'lead',
    status: 'new',
    tags: ['Potential', 'Marketing'],
    lastContactDate: '2024-05-10',
    businessCategory: 'restaurant',
    businessSubcategory: 'indian',
    purchaseVolume: 'medium',
    preferredDeliveryDay: 'wednesday',
  },
  {
    id: '3',
    name: 'Michael Wong',
    email: 'michael@globalsolutions.com',
    phone: '(555) 456-7890',
    company: 'Global Solutions',
    type: 'partner',
    status: 'active',
    tags: ['Referral Partner'],
    lastContactDate: '2024-04-28',
    businessCategory: 'distributor',
    businessSubcategory: 'regional',
    purchaseVolume: 'high',
    preferredDeliveryDay: 'flexible',
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa.brown@cityretail.com',
    phone: '(555) 234-5678',
    company: 'City Retail Group',
    type: 'customer',
    status: 'inactive',
    tags: ['Enterprise'],
    lastContactDate: '2024-03-15',
    businessCategory: 'store',
    businessSubcategory: 'a',
    purchaseVolume: 'high',
    preferredDeliveryDay: 'tuesday',
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'dchen@innovatemanufacturing.com',
    phone: '(555) 876-5432',
    company: 'Innovate Manufacturing',
    type: 'lead',
    status: 'new',
    tags: ['Manufacturing', 'New Lead'],
    lastContactDate: '2024-05-12',
    businessCategory: 'wholesale',
    businessSubcategory: 'medium',
    purchaseVolume: 'medium',
    preferredDeliveryDay: 'friday',
  },
];

interface ContactsProviderProps {
  children: ReactNode;
}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // In a real app, you would fetch contacts from an API here
  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    setTimeout(() => {
      setContacts(mockContacts);
      setIsLoading(false);
    }, 500);
  }, []);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    try {
      const newContact = {
        ...contact,
        id: String(Date.now()),
        lastContactDate: new Date().toISOString().split('T')[0],
      };
      
      setContacts(prev => [...prev, newContact as Contact]);
      
      toast({
        title: "Contact added",
        description: `${contact.name} has been added successfully.`,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error adding contact",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    try {
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id 
            ? { ...contact, ...updatedFields } 
            : contact
        )
      );
      
      toast({
        title: "Contact updated",
        description: "Contact has been updated successfully.",
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error updating contact",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteContact = (id: string) => {
    try {
      const contactToDelete = contacts.find(contact => contact.id === id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      toast({
        title: "Contact deleted",
        description: `${contactToDelete?.name} has been removed.`,
        variant: "destructive",
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error deleting contact",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const filteredContacts = (searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    ));
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        isLoading,
        error,
        addContact,
        updateContact,
        deleteContact,
        getContactById,
        filteredContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};
