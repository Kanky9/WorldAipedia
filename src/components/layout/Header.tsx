
"use client";

import Link from 'next/link';
import { BrainCircuit, Menu, X, UserCircle, LogOut, Star, Settings, ListOrdered, UserPlus, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { posts as allPosts } from '@/data/posts';
import { isPostNew } from '@/lib/utils';


const Header = () => {
  const { t } = useLanguage();
  const { currentUser, logout, loading } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewPosts, setHasNewPosts] = useState(false);

  useEffect(() => {
    if (!loading) { 
        setIsMobileMenuOpen(false);
    }
  }, [currentUser, loading]);

  useEffect(() => {
    const anyNew = allPosts.some(post => isPostNew(post));
    setHasNewPosts(anyNew);
  }, []); 

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", labelKey: "navHome", icon: ListOrdered },
    { href: "/categories", labelKey: "navCategories", icon: Settings },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-transform group-hover:rotate-[15deg] duration-300" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-headline font-bold text-primary transition-colors group-hover:text-primary/80">World AI</h1>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(link => (
              <Button variant="ghost" asChild key={link.href} className="text-sm sm:text-base hover:bg-accent/50 rounded-md">
                <Link href={link.href}>{t(link.labelKey as any, link.labelKey)}</Link>
              </Button>
            ))}
            {currentUser?.isAdmin && (
              <Button variant="ghost" asChild className="text-sm sm:text-base hover:bg-accent/50 rounded-md">
                  <Link href="/admin">{t('navAdmin', 'Admin')}</Link>
              </Button>
            )}
          </nav>

          <LanguageSwitcher />

          {hasNewPosts && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/categories" className="new-ai-bubble-link hidden sm:block">
                    <div className="new-ai-bubble">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 inline-block text-yellow-300" />
                      {t('newAIsAvailableShort', 'New!')}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('newAIsAvailableTooltip', 'New AI posts available!')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}


          {loading ? (
            <div className="h-10 w-20 flex items-center justify-center"> 
              <Settings className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : currentUser ? (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                          {currentUser.photoURL ? (
                            <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.username || 'User'} data-ai-hint="user profile avatar"/>
                          ) : <AvatarFallback className="bg-muted text-muted-foreground text-xs sm:text-sm">{(currentUser.displayName || currentUser.username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>}
                        </Avatar>
                        {currentUser.isSubscribed && (
                          <Badge variant="default" className="absolute -bottom-1 -right-1 text-[8px] px-1 py-0.5 leading-none border-2 border-background bg-primary text-primary-foreground shadow-md">
                            PRO
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('myProfileTooltip', 'My Account')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm">
                <Link href="/login">{t('loginButton', 'Login')}</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90">
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
            {hasNewPosts && (
                 <Link href="/categories" className="text-base font-medium py-2 px-3 rounded-md bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Sparkles className="h-4 w-4 text-primary"/>{t('newAIsAvailableShort', 'New AIs!')}
                  </Link>
            )}
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
