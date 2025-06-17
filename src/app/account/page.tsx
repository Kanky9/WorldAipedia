
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { User, ShieldCheck, CreditCard, Settings, LogOut, Star, Pencil, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale'; 
import type { Timestamp } from 'firebase/firestore';

export default function AccountPage() {
  const { t, language } = useLanguage();
  const { currentUser, loading: authLoading, updateUserProfileInFirestore } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);


  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
    if (currentUser) {
      setUsername(currentUser.username || currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser, authLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isUpdatingProfile) return;
    setIsUpdatingProfile(true);
    try {
      await updateUserProfileInFirestore(currentUser.uid, { username });
      toast({ title: t('profileUpdatedSuccessTitle', "Profile Updated"), description: t('profileUpdatedSuccessDesc', "Your profile has been successfully updated.")});
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({ variant: "destructive", title: t('profileUpdateErrorTitle', "Update Failed"), description: error.message || t('profileUpdateErrorDesc', "Could not update profile.")});
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelSubscription = () => {
    toast({ title: t('cancelSubscriptionSimulated', "Subscription cancellation (simulated).") });
  }
  
  const handleUpgradeToPro = () => {
    toast({ title: t('upgradeToProSimulated', "Upgrade to PRO (simulated payment flow).") });
  }

  const getLocaleForDate = () => {
    switch (language) {
      case 'es': return es;
      default: return enUS;
    }
  };

  const formatMemberSince = (memberSince: Timestamp | Date | undefined): string => {
    if (!memberSince) return 'N/A';
    const date = memberSince instanceof Date ? memberSince : memberSince.toDate();
    return format(date, 'PP', { locale: getLocaleForDate() });
  };


  if (authLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-primary">{t('accountPageTitle', 'My Account')}</h1>
        <p className="text-muted-foreground">{t('accountPageSubtitle', 'Manage your profile, subscription, and settings.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-3 border-2 border-primary">
              {currentUser.photoURL ? (
                <AvatarImage src={currentUser.photoURL} alt={currentUser.username || currentUser.displayName || 'User'} data-ai-hint="user profile image"/>
              ) : (
                <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                  {(currentUser.username || currentUser.displayName || 'U').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
             <Button variant="outline" size="sm" className="text-xs mt-2" onClick={() => toast({description: t('profileUpdateSimulated', "Profile picture change via Gravatar/Google (simulated).")})}>
                <Pencil className="mr-1.5 h-3 w-3"/> {t('changeProfilePictureButton', 'Change Picture')}
            </Button>
            <CardTitle className="mt-2">{currentUser.username || currentUser.displayName}</CardTitle>
            <CardDescription>{currentUser.email}</CardDescription>
            {currentUser.isSubscribed && (
              <Badge className="mt-2 bg-primary text-primary-foreground"><Star className="mr-1.5 h-3.5 w-3.5"/> {t('proMemberLabel', 'PRO Member')}</Badge>
            )}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{t('memberSinceLabel', 'Member since')}: {formatMemberSince(currentUser.memberSince)}</p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> {t('profileDetailsTitle', 'Profile Details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">{t('usernameLabel', 'Username')}</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isUpdatingProfile}/>
                  </div>
                  <div>
                    <Label htmlFor="email">{t('emailLabel', 'Email Address')}</Label>
                    <Input id="email" type="email" value={email} readOnly disabled />
                  </div>
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  {t('updateProfileButton', 'Update Profile')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> {t('subscriptionDetailsTitle', 'Subscription Details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentUser.isSubscribed ? (
                <>
                  <p>{t('currentPlanLabel', 'Current Plan')}: <span className="font-semibold text-primary">{currentUser.subscriptionPlan || 'PRO Plan'}</span></p>
                  <p>{t('nextBillingDateLabel', 'Next Billing Date')}: {currentUser.nextBillingDate || "August 15, 2024 (Simulated)"}</p>
                  <p>{t('paymentMethodLabel', 'Payment Method')}: Visa **** 1234 (Simulated)</p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button variant="outline" onClick={() => toast({description: t('paymentMethodLabel', "Payment method update (simulated).") }) }>{t('updatePaymentButton', 'Update Payment Method')}</Button>
                    <Button variant="destructive" onClick={handleCancelSubscription}>{t('cancelSubscriptionButton', 'Cancel Subscription')}</Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">{t('noActiveSubscription', 'You do not have an active PRO subscription.')}</p>
                  <Button onClick={handleUpgradeToPro} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Star className="mr-2 h-4 w-4"/> {t('upgradeToProButton', 'Upgrade to PRO - $1/month')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
