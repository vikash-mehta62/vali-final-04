
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Save, FileText, Package, ShoppingCart, DollarSign } from 'lucide-react';

// Define permission sets
const permissionSets = [
  { id: 'basic', name: 'Basic Access' },
  { id: 'standard', name: 'Standard Access' },
  { id: 'full', name: 'Full Access' }
];

const AccessPermissionsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Permission Management
          </CardTitle>
          <CardDescription>
            Configure access permissions for store portal users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Permission Template</h3>
              <p className="text-sm text-muted-foreground">
                Apply a predefined set of permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="basic">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {permissionSets.map(set => (
                    <SelectItem key={set.id} value={set.id}>{set.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Feature</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>Price Lists</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    Access to view and use store price lists
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch defaultChecked id="price-list-view" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="price-list-create" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="price-list-edit" />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-green-500" />
                    <span>Orders</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    Access to place and manage orders
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch defaultChecked id="orders-view" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch defaultChecked id="orders-create" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="orders-edit" />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-purple-500" />
                    <span>Inventory</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    Access to view inventory information
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch defaultChecked id="inventory-view" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="inventory-create" disabled />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="inventory-edit" disabled />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span>Invoices & Payments</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    Access to view and manage payments
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch defaultChecked id="payments-view" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="payments-create" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch id="payments-edit" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessPermissionsTab;
