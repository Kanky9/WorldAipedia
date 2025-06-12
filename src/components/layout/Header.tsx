
"use client";

import Link from 'next/link';
import { BrainCircuit, Menu, X, UserCircle, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface MockUser {
  username: string;
  isSubscribed: boolean;
  profileImageUrl?: string; // For PRO users
}

const Header = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);

  // Simulate login/logout (in a real app, this would use an auth provider)
  const handleLogin = () => {
    // Simulate a PRO user for demonstration
    setUser({ username: "UsuarioDemo", isSubscribed: true, profileImageUrl: "https://placehold.co/40x40.png" }); 
    // To simulate a non-PRO user:
    // setUser({ username: "UsuarioComun", isSubscribed: false });
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Close mobile menu if user state changes (e.g., logs in/out while mobile menu is open)
    setIsMobileMenuOpen(false);
  }, [user]);

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-transform group-hover:rotate-[15deg] duration-300" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-headline font-bold text-primary transition-colors group-hover:text-primary/80">World AI</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" asChild className="text-sm sm:text-base hover:bg-accent/50 rounded-md">
              <Link href="/">{t('navHome', 'Home')}</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm sm:text-base hover:bg-accent/50 rounded-md">
              <Link href="/categories">{t('navCategories', 'Categories')}</Link>
            </Button>
          </nav>

          {user ? (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                          {user.isSubscribed && user.profileImageUrl ? (
                            <AvatarImage src={user.profileImageUrl} alt={user.username} data-ai-hint="user profile avatar"/>
                          ) : null}
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs sm:text-sm">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.isSubscribed && (
                          <Badge variant="default" className="absolute bottom-0 right-0 text-[8px] px-1 py-0.5 leading-none border-2 border-background bg-primary text-primary-foreground">
                            PRO
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('myProfileTooltip', 'My Profile')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.isSubscribed ? "PRO Account" : "Standard Account"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Future items: My Profile, Settings */}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logoutButton', 'Logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} variant="outline" size="sm" className="text-xs sm:text-sm">
              {t('loginButton', 'Login')}
            </Button>
          )}

          <div className="sm:hidden">
            <Button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              variant="ghost" 
              size="icon"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-20 left-0 right-0 w-full bg-card shadow-lg p-4 z-40 border-b border-t border-border">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="text-lg font-medium hover:text-primary py-2 text-center" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navHome', 'Home')}
            </Link>
            <Link 
              href="/categories" 
              className="text-lg font-medium hover:text-primary py-2 text-center" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navCategories', 'Categories')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
