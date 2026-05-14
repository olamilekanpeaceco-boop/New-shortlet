import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { PROPERTY_TYPES, LOCATIONS } from '@/constants';
import { propertyService } from '@/services/propertyService';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = propertyService.subscribeToProperties((data) => {
      setProperties(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden rounded-3xl mt-4">
        <img
          src="https://picsum.photos/seed/travel/1920/1080"
          alt="Hero"
          className="h-full w-full object-cover brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Discover premium short-term rentals across Nigeria. From luxury villas to cozy studios, we have it all.
          </p>
          
          {/* Search Box */}
          <div className="mt-8 w-full max-w-4xl rounded-2xl bg-background p-2 shadow-2xl md:rounded-full">
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <div className="flex w-full items-center gap-2 px-4 py-2 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Location</span>
                  <select className="w-full bg-transparent text-sm font-medium focus:outline-none">
                    <option value="">Where are you going?</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
              <div className="hidden h-10 w-px bg-border md:block" />
              <div className="flex w-full items-center gap-2 px-4 py-2 text-foreground">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Dates</span>
                  <span className="text-sm font-medium">Add dates</span>
                </div>
              </div>
              <div className="hidden h-10 w-px bg-border md:block" />
              <div className="flex w-full items-center gap-2 px-4 py-2 text-foreground">
                <Users className="h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Guests</span>
                  <span className="text-sm font-medium">Add guests</span>
                </div>
              </div>
              <Button size="lg" className="h-12 w-full rounded-xl md:h-14 md:w-auto md:rounded-full md:px-8">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
          <Button variant="outline" className="rounded-full border-primary bg-primary/5 text-primary">
            All Stays
          </Button>
          {PROPERTY_TYPES.map((type) => (
            <Button key={type.value} variant="outline" className="rounded-full hover:border-primary hover:text-primary">
              {type.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Stays</h2>
            <p className="text-muted-foreground">Hand-picked premium properties for you.</p>
          </div>
          <Button variant="link" className="text-primary">View all</Button>
        </div>
        <PropertyGrid properties={properties} isLoading={isLoading} />
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Shortlet?</h2>
            <p className="mt-4 text-muted-foreground">We provide the best experience for both guests and hosts.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Verified Properties',
                description: 'Every listing on our platform is manually verified for quality and accuracy.',
                icon: '✅'
              },
              {
                title: 'Secure Payments',
                description: 'Your payments are protected and only released to hosts after you check in.',
                icon: '🔒'
              },
              {
                title: '24/7 Support',
                description: 'Our dedicated support team is always available to help you with any issues.',
                icon: '📞'
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl bg-background p-8 text-center shadow-sm">
                <span className="mb-4 text-4xl">{item.icon}</span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
