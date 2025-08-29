
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building, UserPlus, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim(),
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      }, { merge: true });

      toast({
        title: 'Profile created!',
        description: 'Next, let\'s get you into an organization.',
      });
      
      setStep(2);
    } catch (error) {
      console.error('Error during profile setup:', error);
      toast({
        title: 'Error',
        description: 'Failed to create your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOnboardingComplete = async () => {
     if (!user) return;
     setIsSubmitting(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { onboardedAt: serverTimestamp() }, { merge: true });
        router.push('/dashboard');
      } catch(error) {
         console.error('Error completing onboarding:', error);
         toast({
            title: 'Error',
            description: 'Could not complete onboarding. Please try again.',
            variant: 'destructive',
         });
         setIsSubmitting(false);
      }
  };


  if (authLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!user) {
     router.push('/');
     return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome!</CardTitle>
              <CardDescription>Let's start by setting up your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </>
        )}
        {step === 2 && (
          <>
             <CardHeader>
              <CardTitle className="text-2xl">Join an Organization</CardTitle>
              <CardDescription>How would you like to join your team?</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <Button variant="outline" className="w-full justify-start text-base py-6">
                  <UserPlus className="mr-4 h-5 w-5" />
                  <span>Join with an invite code</span>
               </Button>
                <Button variant="outline" className="w-full justify-start text-base py-6">
                    <Building className="mr-4 h-5 w-5" />
                    <span>Create a new organization</span>
                </Button>
            </CardContent>
            <CardFooter>
                <Button onClick={handleOnboardingComplete} className="w-full" disabled={isSubmitting}>
                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finish Onboarding'}
                </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
