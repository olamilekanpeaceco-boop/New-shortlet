import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Tv, 
  Wind, 
  Car, 
  Shield, 
  ArrowLeft,
  Share2,
  Heart,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { propertyService } from '@/services/propertyService';

import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, firebaseUser } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!id) return;
    
    const fetchProperty = async () => {
      setIsLoading(true);
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
      setIsLoading(false);
    };

    fetchProperty();
  }, [id]);

  const handleBooking = async () => {
    if (!firebaseUser) {
      toast.error('Please login to book this property');
      navigate('/auth');
      return;
    }

    if (!property || !date) return;

    setIsBooking(true);
    try {
      const bookingId = await bookingService.createBooking({
        propertyId: property.id,
        userId: firebaseUser.uid,
        startDate: date.toISOString(),
        endDate: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Default 1 night for now
        totalPrice: property.pricePerNight,
        status: 'pending',
        guestCount: 1
      });

      if (bookingId) {
        toast.success('Booking request sent successfully!');
        // In a real app, you might navigate to a booking confirmation page
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      toast.error('An error occurred while booking');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
          <Skeleton className="h-full w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-full w-full rounded-xl" />
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!property) return <div>Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 font-medium">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{property.rating}</span>
                <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground underline">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[500px]">
          <div className="md:col-span-2 h-full overflow-hidden rounded-2xl">
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4 h-full">
            {property.images.slice(1, 5).map((img, i) => (
              <div key={i} className="h-full overflow-hidden rounded-2xl">
                <img 
                  src={img} 
                  alt={`${property.title} ${i + 2}`} 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-medium text-foreground">{property.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                <span className="font-medium text-foreground">{property.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5" />
                <span className="font-medium text-foreground">{property.bathrooms} bathrooms</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About this place</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-muted-foreground">
                    {amenity === 'WiFi' && <Wifi className="h-5 w-5" />}
                    {amenity === 'TV' && <Tv className="h-5 w-5" />}
                    {amenity === 'Air Conditioning' && <Wind className="h-5 w-5" />}
                    {amenity === 'Free Parking' && <Car className="h-5 w-5" />}
                    {amenity === 'Security' && <Shield className="h-5 w-5" />}
                    {!['WiFi', 'TV', 'Air Conditioning', 'Free Parking', 'Security'].includes(amenity) && (
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-none ring-1 ring-border">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">₦{property.pricePerNight.toLocaleString()}</span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{property.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="rounded-xl border p-3">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Check-in / Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            "w-full justify-start text-left font-normal p-0 h-auto hover:bg-transparent",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="rounded-xl border p-3">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Guests</Label>
                    <select className="w-full bg-transparent text-sm font-medium focus:outline-none appearance-none">
                      {Array.from({ length: property.maxGuests }).map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg font-bold" 
                  onClick={handleBooking}
                  disabled={isBooking}
                >
                  {isBooking ? 'Processing...' : 'Reserve Now'}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  You won't be charged yet
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="underline">₦{property.pricePerNight.toLocaleString()} x 5 nights</span>
                    <span>₦{(property.pricePerNight * 5).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="underline">Service fee</span>
                    <span>₦15,000</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₦{(property.pricePerNight * 5 + 15000).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
