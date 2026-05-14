import { Star, MapPin, Users, Bed, Bath } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
  key?: string;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group overflow-hidden border-none bg-transparent shadow-none transition-all hover:translate-y-[-4px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <img
            src={property.images[0] || 'https://picsum.photos/seed/house/800/600'}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <Badge className="absolute right-3 top-3 bg-background/80 text-foreground backdrop-blur-sm">
            {property.type}
          </Badge>
          {property.rating > 4.5 && (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
              Guest Favorite
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold text-lg">{property.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{property.rating}</span>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{property.location}</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{property.maxGuests}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">₦{property.pricePerNight.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
