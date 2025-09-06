"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

function WaitlistDemo() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const waitlistMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join waitlist');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: 'Success!', description: data.message });
      setEmail(''); // Clear the input
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: 'Error', description: 'Please enter your email address', variant: 'destructive' });
      return;
    }
    waitlistMutation.mutate(email);
  };

  return (
    <div className="h-[35rem] sm:h-[40rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
          Join the waitlist
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto my-3 sm:my-2 text-sm sm:text-base text-center relative z-10 px-2">
          Be the first to experience CaptchaRizz - the AI-powered CAPTCHA alternative that uses culture-savvy challenges to distinguish humans from bots. Get early access to our revolutionary security solution.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-2 mt-6 sm:mt-4 w-full">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 relative z-10 h-12 sm:h-auto text-base"
            data-testid="input-waitlist-email"
          />
          <Button 
            type="submit"
            disabled={waitlistMutation.isPending}
            className="relative z-10 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold transition-all duration-300 disabled:opacity-50 h-12 sm:h-auto touch-manipulation"
            data-testid="button-join-waitlist"
          >
            {waitlistMutation.isPending ? 'Joining...' : 'Join Waitlist'}
          </Button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
}

export { WaitlistDemo };