
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, KeyRound, LogIn as LogInIcon } from 'lucide-react'; // Import icons

// Mock social login icons (replace with actual SVGs or library if available)
const GoogleIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.59,4.73 17.93,7.55 17.93,7.55L19.81,5.82C19.81,5.82 17.34,3 12.19,3C6.42,3 2.03,7.8 2.03,12C2.03,16.2 6.42,21 12.19,21C18.08,21 21.54,15.97 21.54,11.42C21.54,11.31 21.35,11.1 21.35,11.1V11.1Z" /></svg>;
const FacebookIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H17V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" /></svg>;
const AppleIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M19.2,11.09C19.2,10.06 19.86,9.08 21.36,8.54C21.31,8.5 20.09,7.71 19.38,6.58C18.33,5 17.88,3.33 16.71,3.33C15.27,3.33 14.25,4.31 13.56,4.31C12.83,4.31 11.63,3.33 10.3,3.33C8.56,3.33 7.06,5.31 7.06,7.81C7.06,10.06 8.08,12.68 9.69,12.68C10.45,12.68 11.33,11.91 12.15,11.91C12.95,11.91 13.68,12.68 14.69,12.68C16.14,12.68 16.83,11.41 17.5,10.41C16.19,9.7 15.94,8.26 15.94,7.5C15.94,6.38 16.85,5.68 17.64,5.68C18.31,5.68 18.93,6.05 19.2,6.5V6.5C19.16,6.53 17.79,7.91 17.79,9.53C17.79,10.63 18.31,11.21 19.2,11.09M15.45,2C16.71,1.95 17.88,2.63 18.53,3.45C17.91,3.91 17.21,4.63 17.21,5.53C17.21,6.75 18.25,7.59 19.33,7.59C19.73,7.59 20.13,7.5 20.5,7.3C20.28,8.41 19.25,9.86 17.76,9.86C16.76,9.86 16.11,9.08 15.31,9.08C14.5,9.08 13.68,9.86 12.68,9.86C11.33,9.86 10.08,8.23 10.08,6.46C10.08,4.71 11.13,3.28 12.5,3.28C13.68,3.28 14.59,4 15.45,4V2Z" /></svg>;


export default function LoginPage() {
  const { t } = useLanguage();

  // Mock login handler
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would call Firebase Auth
    alert(t('loginAttemptMessage', 'Login attempt (simulated)'));
    // Potentially redirect or update global state
  };
  
  const handleSocialLogin = (provider: string) => {
    alert(t('socialLoginAttemptMessage', 'Login with {provider} (simulated)', { provider }));
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-headline text-primary">{t('loginPageTitle', 'Welcome Back!')}</CardTitle>
          <CardDescription>{t('loginPageSubtitle', 'Log in to access your account and PRO features.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">{t('emailLabel', 'Email Address')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder={t('emailPlaceholder', 'you@example.com')} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">{t('passwordLabel', 'Password')}</Label>
               <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="pl-10" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              {/* <div className="flex items-center">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="ml-2 block">
                  {t('rememberMeLabel', 'Remember me')}
                </Label>
              </div> */}
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                {t('forgotPasswordLink', 'Forgot your password?')}
              </Link>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <LogInIcon className="mr-2 h-5 w-5" />{t('loginButton', 'Login')}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">{t('orContinueWith', 'Or continue with')}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="outline" onClick={() => handleSocialLogin('Google')}>
                <GoogleIcon /> <span className="sr-only">Google</span>
              </Button>
              <Button variant="outline" onClick={() => handleSocialLogin('Facebook')}>
                <FacebookIcon /> <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="outline" onClick={() => handleSocialLogin('Apple')}>
                <AppleIcon /> <span className="sr-only">Apple</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p className="text-muted-foreground">
            {t('noAccountPrompt', "Don't have an account?")}{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              {t('signUpLink', 'Sign up')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
