import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROPERTY_TYPES, LOCATIONS } from '@/constants';
import { propertyService } from '@/services/propertyService';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const AMENITIES_LIST = [
  'WiFi', 'Kitchen', 'Air Conditioning', 'Pool', 'Free Parking', 'TV', 'Gym', 'Security', 'Workspace', 'Washer'
];

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerNight: 0,
    location: '',
    address: '',
    type: 'apartment' as any,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    isAvailable: true,
    images: [] as string[],
    amenities: [] as string[]
  });

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchProperty = async () => {
        const property = await propertyService.getPropertyById(id);
        if (property) {
          setFormData({
            title: property.title,
            description: property.description,
            pricePerNight: property.pricePerNight,
            location: property.location,
            address: property.address,
            type: property.type,
            maxGuests: property.maxGuests,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            isAvailable: property.isAvailable,
            images: property.images,
            amenities: property.amenities
          });
        }
      };
      fetchProperty();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await propertyService.updateProperty(id, formData);
        toast.success('Property updated successfully');
      } else {
        await propertyService.createProperty({
          ...formData,
          ownerId: 'admin', // In a real app, this would be the current user's ID
          rating: 5.0,
          reviewCount: 0
        });
        toast.success('Property created successfully');
      }
      navigate('/admin/properties');
    } catch (error) {
      toast.error('Failed to save property');
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: newAmenities });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/properties')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={6}
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <select 
                      id="type"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Night (₦)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={formData.pricePerNight} 
                      onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">City</Label>
                    <select 
                      id="location"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    >
                      <option value="">Select City</option>
                      {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address} 
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guests">Max Guests</Label>
                    <Input 
                      id="guests" 
                      type="number" 
                      value={formData.maxGuests} 
                      onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input 
                      id="bedrooms" 
                      type="number" 
                      value={formData.bedrooms} 
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input 
                      id="bathrooms" 
                      type="number" 
                      value={formData.bathrooms} 
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {AMENITIES_LIST.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity} 
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm font-normal">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Image URL" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                  />
                  <Button type="button" size="icon" onClick={addImage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                      <img src={img} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        type="button"
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                        onClick={() => removeImage(i)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="available" 
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: !!checked })}
                  />
                  <Label htmlFor="available">Available for booking</Label>
                </div>
                <Button className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
