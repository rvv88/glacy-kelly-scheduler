
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Home,
  Settings,
  Users,
  FileText,
  FileClock,
  LayoutDashboard,
  Building
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', href: '/calendar', icon: Calendar },
    { name: 'Meus Dados', href: '/patients', icon: Users },
    { name: 'Serviços', href: '/services', icon: FileText },
    { name: 'Clínicas', href: '/clinics', icon: Building },
    { name: 'Histórico', href: '/history', icon: FileClock },
    { name: 'Sobre', href: '/about', icon: Home },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
        </div>
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            
            return (
              <Button
                key={link.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sm font-medium",
                  isActive && "bg-secondary text-secondary-foreground"
                )}
                asChild
              >
                <Link to={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
