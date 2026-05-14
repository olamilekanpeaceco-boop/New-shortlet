import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  Calendar, 
  Users, 
  Settings, 
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
  key?: string;
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <Link to={href}>
      <Button
        variant={active ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-3 px-3',
          active ? 'bg-secondary font-semibold' : 'text-muted-foreground'
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: HomeIcon, label: 'Properties', href: '/admin/properties' },
    { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 border-right bg-background md:block">
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
              />
            ))}
          </div>
          <div className="mt-auto">
            <Button variant="outline" className="w-full justify-start gap-3 px-3" onClick={() => window.location.href = '/'}>
              <ChevronRight className="h-5 w-5 rotate-180" />
              Back to Site
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
