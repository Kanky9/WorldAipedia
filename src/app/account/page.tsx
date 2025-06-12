
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { User, ShieldCheck, CreditCard, Settings, LogOut, Star, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Mock user data - in a real app, this would come from auth context/backend
const mockUser = {
  username: "DemoUserPRO",
  email: "demo.pro@example.com",
  profileImageUrl: "https://placehold.co/100x100.png?text=PRO",
  isSubscribed: true,
  subscriptionPlan: "PRO Monthly",
  nextBillingDate: "August 15, 2024",
  memberSince: "July 1, 2023"
};

// const mockUserBasic = {
//   username: "DemoUserBasic",
//   email: "basic@example.com",
//   profileImageUrl: "",
//   isSubscribed: false,
// };


export default function AccountPage() {
  const { t } = useLanguage();
  // For demo, using mockUser. Replace with actual user state.
  const [currentUser, setCurrentUser] = useState(mockUser); 

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('profileUpdateSimulated', "Profile update (simulated)."));
  };

  const handleCancelSubscription = () => {
    alert(t('cancelSubscriptionSimulated', "Subscription cancellation (simulated)."));
    // setCurrentUser(prev => ({...prev!, isSubscribed: false, subscriptionPlan: undefined, nextBillingDate: undefined}));
  }
  
  const handleUpgradeToPro = () => {
     alert(t('upgradeToProSimulated', "Upgrade to PRO (simulated payment flow)."));
    // setCurrentUser(prev => ({
    //   ...prev!, 
    //   isSubscribed: true, 
    //   subscriptionPlan: "PRO Monthly", 
    //   nextBillingDate: "Next Month", 
    //   profileImageUrl: prev?.profileImageUrl || "https://placehold.co/100x100.png?text=NEW"
    // }));
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-primary">{t('accountPageTitle', 'My Account')}</h1>
        <p className="text-muted-foreground">{t('accountPageSubtitle', 'Manage your profile, subscription, and settings.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-3 border-2 border-primary">
              {currentUser.profileImageUrl ? (
                <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.username} data-ai-hint="user profile image"/>
              ) : (
                <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
             <Button variant="outline" size="sm" className="text-xs mt-2">
                <Pencil className="mr-1.5 h-3 w-3"/> {t('changeProfilePictureButton', 'Change Picture')}
            </Button>
            <CardTitle className="mt-2">{currentUser.username}</CardTitle>
            <CardDescription>{currentUser.email}</CardDescription>
            {currentUser.isSubscribed && (
              <Badge className="mt-2 bg-primary text-primary-foreground"><Star className="mr-1.5 h-3.5 w-3.5"/> PRO Member</Badge>
            )}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{t('memberSinceLabel', 'Member since')}: {currentUser.memberSince || 'N/A'}</p>
          </CardContent>
        </Card>

        {/* Account Details & Subscription Section */}
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
                    <Input id="username" defaultValue={currentUser.username} />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('emailLabel', 'Email Address')}</Label>
                    <Input id="email" type="email" defaultValue={currentUser.email} />
                  </div>
                </div>
                <div>
                    <Label htmlFor="current-password">{t('currentPasswordLabel', 'Current Password')}</Label>
                    <Input id="current-password" type="password" placeholder="********"/>
                </div>
                 <div>
                    <Label htmlFor="new-password">{t('newPasswordLabel', 'New Password (optional)')}</Label>
                    <Input id="new-password" type="password" placeholder={t('leaveBlankNoChange', 'Leave blank to keep current')}/>
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">{t('updateProfileButton', 'Update Profile')}</Button>
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
                  <p>{t('currentPlanLabel', 'Current Plan')}: <span className="font-semibold text-primary">{currentUser.subscriptionPlan}</span></p>
                  <p>{t('nextBillingDateLabel', 'Next Billing Date')}: {currentUser.nextBillingDate}</p>
                  <p>{t('paymentMethodLabel', 'Payment Method')}: Visa **** 1234 (Simulated)</p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button variant="outline">{t('updatePaymentButton', 'Update Payment Method')}</Button>
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
