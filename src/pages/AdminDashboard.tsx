import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Home as HomeIcon, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { propertyService } from '@/services/propertyService';
import { bookingService } from '@/services/bookingService';
import { Property, Booking } from '@/types';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeProps = propertyService.subscribeToProperties(setProperties);
    const unsubscribeBookings = bookingService.subscribeToBookings(setBookings);

    return () => {
      unsubscribeProps();
      unsubscribeBookings();
    };
  }, []);

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + b.totalPrice, 0);

  const stats = [
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      title: 'Total Bookings',
      value: bookings.length.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      title: 'Active Properties',
      value: properties.length.toString(),
      change: '+2',
      trend: 'up',
      icon: HomeIcon,
      color: 'text-orange-500'
    },
    {
      title: 'New Users',
      value: '85', // This would come from a userService
      change: '-3.1%',
      trend: 'down',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
          </div>
          <Button asChild>
            <Link to="/admin/properties/new">Add New Property</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    stat.trend === 'up' ? "text-emerald-500" : "text-destructive"
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {booking.userId.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Booking {booking.id.slice(-4)}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} • {booking.guestCount} guests
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₦{booking.totalPrice.toLocaleString()}</p>
                      <p className={cn(
                        "text-xs font-medium",
                        booking.status === 'confirmed' ? "text-emerald-500" : "text-muted-foreground"
                      )}>
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">No bookings yet.</p>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary" asChild>
                <Link to="/admin/bookings">View All Bookings</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Top Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img 
                        src={property.images[0]} 
                        alt="" 
                        className="h-10 w-10 rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-medium">{property.title}</p>
                        <p className="text-xs text-muted-foreground">{property.location} • {property.reviewCount} reviews</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₦{property.pricePerNight.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-medium">{property.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">No properties yet.</p>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary" asChild>
                <Link to="/admin/properties">Manage Properties</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
