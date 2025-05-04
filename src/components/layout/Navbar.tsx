
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCurrentUser } from '@/models/user';

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  // Get user from mock data (would come from auth context in a real app)
  const user = mockCurrentUser;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-xl text-primary"
          >
            <span className="hidden md:block">Dra. Glacy Kelly Bisaggio</span>
            <span className="md:hidden">Dra. Glacy</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-4 w-4 text-primary/80" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex w-full">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/appointments" className="cursor-pointer flex w-full">
                  Meus Agendamentos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex w-full">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
