
"use client";

import Link from 'next/link';
import { BrainCircuit, Menu, X, UserCircle, LogOut, Star, Settings, ListOrdered, UserPlus, LogIn, ShieldCheck, ShoppingCart, Share2, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext'; 
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
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


const Header = () => {
  const { t } = useLanguage();
  const { currentUser, logout, loading } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) { 
        setIsMobileMenuOpen(false);
    }
  }, [currentUser, loading, pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { href: "/", labelKey: "navHome", icon: ListOrdered },
    { href: "/categories", labelKey: "navCategories", icon: Settings },
    { href: "/store", labelKey: "navStore", icon: ShoppingCart },
    { href: "/publications", labelKey: "navPublications", icon: Share2 },
    { href: "/donations", labelKey: "navDonations", icon: HandHeart },
  ];

  return (
    <header className="py-3 sm:py-4">
      <div className="container mx-auto flex h-16 items-center justify-between px-4
                      md:max-w-4xl lg:max-w-5xl md:rounded-full md:border md:bg-card/80 md:px-6 md:shadow-lg md:backdrop-blur-md">
        
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <BrainCircuit className="h-8 w-8 text-primary transition-transform group-hover:rotate-[15deg] duration-300" />
          <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary transition-colors group-hover:text-primary/80 hidden sm:block">World AI</h1>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = (link.href === '/' && pathname === '/') || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Button variant="ghost" asChild key={link.href} className={cn("text-muted-foreground hover:text-foreground", isActive && "font-semibold text-foreground")}>
                  <Link href={link.href}>{t(link.labelKey as any, link.labelKey)}</Link>
                </Button>
              )
            })}
            {currentUser?.isAdmin && (
              <Button variant="ghost" asChild className={cn("text-muted-foreground hover:text-foreground", pathname.startsWith('/admin') && "font-semibold text-foreground")}>
                  <Link href="/admin">{t('navAdmin', 'Admin')}</Link>
              </Button>
            )}
          </nav>

          <LanguageSwitcher />

          {loading ? (
            <div className="h-10 w-20 flex items-center justify-center"> 
              <Settings className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : currentUser ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      {currentUser.photoURL ? (
                        <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.username || 'User'} data-ai-hint="user profile avatar"/>
                      ) : <AvatarFallback className="bg-muted text-muted-foreground">{(currentUser.displayName || currentUser.username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>}
                    </Avatar>
                    {currentUser.isSubscribed && (
                      <Badge variant="default" className="absolute -bottom-1 -right-1 text-[8px] px-1 py-0.5 leading-none border-2 border-background bg-primary text-primary-foreground shadow-md">
                        PRO
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.displayName || currentUser.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/account"><UserCircle className="mr-2 h-4 w-4" />{t('navAccount', 'My Account')}</Link>
                </DropdownMenuItem>
                {currentUser.isSubscribed && (
                  <DropdownMenuItem className="cursor-default text-accent">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>{t('proMemberLabel', 'PRO Member')}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logoutButton', 'Logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="outline" className="rounded-full">
                 <Link href="/register">{t('registerButton', 'Sign Up')}</Link>
              </Button>
            </div>
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
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
               <Link 
                href={link.href} 
                key={link.href} 
                className="text-base font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-accent/50 flex items-center gap-2" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4"/>{t(link.labelKey as any, link.labelKey)}
              </Link>
            ))}
            {currentUser?.isAdmin && (
              <Link 
                  href="/admin" 
                  className="text-base font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-accent/50 flex items-center gap-2" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4"/>{t('navAdmin', 'Admin')}
              </Link>
            )}
            <DropdownMenuSeparator />
            {loading ? <div className="p-2 text-center">Loading...</div> : currentUser ? (
              <>
                <Link href="/account" className="text-base font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-accent/50 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <UserCircle className="h-4 w-4"/>{t('navAccount', 'My Account')}
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-base font-medium text-destructive hover:text-destructive-foreground hover:bg-destructive py-2 px-3 flex items-center gap-2">
                  <LogOut className="h-4 w-4"/>{t('logoutButton', 'Logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-base font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-accent/50 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogIn className="h-4 w-4"/>{t('loginButton', 'Login')}
                </Link>
                <Link href="/register" className="text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-3 rounded-md flex items-center gap-2 justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <UserPlus className="h-4 w-4"/>{t('registerButton', 'Sign Up')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
