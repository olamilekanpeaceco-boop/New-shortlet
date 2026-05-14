import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { Property } from '@/types';
import { PROPERTY_TYPES, LOCATIONS } from '@/constants';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { propertyService } from '@/services/propertyService';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [type, setType] = useState(searchParams.get('type') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      let data: Property[] = [];
      
      if (type) {
        data = await propertyService.getPropertiesByType(type);
      } else {
        data = await propertyService.getAllProperties();
      }

      // Client-side filtering for location and price (could be improved with more Firestore queries)
      let filtered = [...data];
      if (location) filtered = filtered.filter(p => p.location === location);
      if (minPrice) filtered = filtered.filter(p => p.pricePerNight >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.pricePerNight <= Number(maxPrice));

      setProperties(filtered);
      setIsLoading(false);
    };

    fetchProperties();
  }, [type, location, minPrice, maxPrice]);

  const handleApplyFilters = () => {
    const params: any = {};
    if (type) params.type = type;
    if (location) params.location = location;
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Search Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {properties.length} stays found
              {location && ` in ${location}`}
            </h1>
            <p className="text-muted-foreground">Explore the best stays for your next trip.</p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your search results.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="">All Locations</option>
                      {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Price (₦)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Price (₦)</Label>
                      <Input 
                        type="number" 
                        placeholder="Any" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-6">
                  <Button className="w-full" onClick={handleApplyFilters}>Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Button 
            variant={!type ? "secondary" : "outline"} 
            size="sm" 
            className="rounded-full"
            onClick={() => setType('')}
          >
            All
          </Button>
          {PROPERTY_TYPES.map((t) => (
            <Button 
              key={t.value} 
              variant={type === t.value ? "secondary" : "outline"} 
              size="sm" 
              className="rounded-full"
              onClick={() => setType(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Results */}
        <PropertyGrid properties={properties} isLoading={isLoading} />
      </div>
    </div>
  );
}
