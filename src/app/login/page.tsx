
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, KeyRound, LogIn as LogInIcon, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.59,4.73 17.93,7.55 17.93,7.55L19.81,5.82C19.81,5.82 17.34,3 12.19,3C6.42,3 2.03,7.8 2.03,12C2.03,16.2 6.42,21 12.19,21C18.08,21 21.54,15.97 21.54,11.42C21.54,11.31 21.35,11.1 21.35,11.1V11.1Z" /></svg>;

export default function LoginPage() {
  const { t } = useLanguage();
  const { signInWithEmail, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || authLoading) return;
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      toast({ title: t('loginPageTitle', 'Welcome Back!'), description: t('loginAttemptMessage', "Successfully logged in!")});
      router.push('/account'); 
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({ variant: "destructive", title: t('errorDefaultTitle', "Login Failed"), description: error.message || t('errorDefaultDesc', "An unknown error occurred.") });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    if (isSubmitting || authLoading) return;
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      toast({ title: t('loginPageTitle', 'Welcome Back!'), description: t('socialLoginAttemptMessage', "Successfully logged in with Google!", {provider: "Google"})});
      router.push('/account');
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast({ variant: "destructive", title: t('errorDefaultTitle', "Google Login Failed"), description: error.message || t('errorDefaultDesc', "An unknown error occurred.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || authLoading;

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
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder={t('emailPlaceholder', 'you@example.com')} className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
              </div>
            </div>
            <div>
              <Label htmlFor="password">{t('passwordLabel', 'Password')}</Label>
               <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                {t('forgotPasswordLink', 'Forgot your password?')}
              </Link>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogInIcon className="mr-2 h-5 w-5" />}
              {t('loginButton', 'Login')}
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
            <div className="mt-6 grid grid-cols-1 gap-3">
              <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />} 
                <span className="ml-2">Google</span>
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
