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
      {/* Notifications icon (extremely large size) */}
      <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-gray-100 h-20 w-20 p-0">
        <Bell className="h-16 w-16" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-8 w-8 flex items-center justify-center shadow-sm font-bold">
          3
        </span>
      </Button>
      
      {/* User profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-20 w-20 rounded-full hover:bg-gray-100 p-0">
            <Avatar className="h-16 w-16 border-2 border-gray-200 shadow-md">
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