import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ManageProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = propertyService.subscribeToProperties((data) => {
      setProperties(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const success = await propertyService.deleteProperty(id);
      if (success) {
        toast.success('Property deleted successfully');
      } else {
        toast.error('Failed to delete property');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Properties</h1>
            <p className="text-muted-foreground">View and manage all property listings.</p>
          </div>
          <Button asChild>
            <Link to="/admin/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>

        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading properties...
                  </TableCell>
                </TableRow>
              ) : properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No properties found.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img 
                          src={property.images[0]} 
                          alt="" 
                          className="h-10 w-10 rounded-md object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span>{property.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell className="capitalize">{property.type}</TableCell>
                    <TableCell>₦{property.pricePerNight.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={property.isAvailable ? "default" : "secondary"}>
                        {property.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="View Listing">
                          <Link to={`/property/${property.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link to={`/admin/properties/edit/${property.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => handleDelete(property.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
