import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { Link } from 'wouter';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  // If not authenticated, show profile picture and notifications anyway (for design consistency)
  // In a real app, we'd check isAuthenticated and redirect to login if needed

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}` || user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications icon */}
      <div className="relative mr-2">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </Button>
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
          3
        </span>
      </div>
      
      {/* User profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
            <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
              <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || ''} />
              <AvatarFallback className="bg-primary text-white font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.firstName || 'Student'} {user?.lastName || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || 'student@example.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/app/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/app/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 focus:text-red-500" 
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}