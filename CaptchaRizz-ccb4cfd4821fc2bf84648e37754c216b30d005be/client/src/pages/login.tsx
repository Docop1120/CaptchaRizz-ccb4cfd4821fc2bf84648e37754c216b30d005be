import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import { Waves } from "@/components/ui/waves-background"

export default function LoginPage() {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast({ title: 'Success!', description: data.message })
      setLocation('/')
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const waitlistMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to join waitlist')
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast({ title: 'Success!', description: data.message })
      setEmail('')
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showWaitlist) {
      if (!email.trim()) {
        toast({ title: 'Error', description: 'Email is required', variant: 'destructive' })
        return
      }
      waitlistMutation.mutate(email)
    } else {
      loginMutation.mutate({ email, password })
    }
  }

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
      {/* Background Waves */}
      <div className="absolute inset-0">
        <Waves 
          lineColor="rgba(122, 44, 255, 0.08)"
          backgroundColor="black"
          waveSpeedX={0.006}
          waveSpeedY={0.008}
          waveAmpX={20}
          waveAmpY={12}
          friction={0.95}
          tension={0.005}
          maxCursorMove={60}
          xGap={18}
          yGap={45}
          className="animate-wave-pulse"
        />
      </div>

      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 z-20">
        <Button 
          variant="outline" 
          size="sm"
          className="glass-card hover:bg-white/5 text-foreground border border-white/10 hover:border-primary/30"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      {/* Login Card */}
      <Card className="relative z-10 glass-card w-full max-w-md" data-testid="login-card">
        <CardHeader className="text-center pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">{showWaitlist ? 'Join the Waitlist' : 'Welcome back'}</h1>
          <p className="text-muted-foreground">{showWaitlist ? 'Be the first to experience CaptchaRizz when it launches' : 'Sign in to your account to continue'}</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass-card bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                  placeholder="Enter your email"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            {!showWaitlist && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 glass-card bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                    placeholder="Enter your password"
                    required={!showWaitlist}
                    data-testid="input-password"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit"
              disabled={loginMutation.isPending || waitlistMutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-3 font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              data-testid={showWaitlist ? "button-join-waitlist" : "button-sign-in"}
            >
              {(loginMutation.isPending || waitlistMutation.isPending) ? 'Please wait...' : (showWaitlist ? 'Join Waitlist' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {showWaitlist ? 'Already have an account?' : "Want early access?"}{' '}
              <button 
                type="button"
                onClick={() => setShowWaitlist(!showWaitlist)}
                className="text-primary hover:text-accent transition-colors font-medium" 
                data-testid={showWaitlist ? "link-sign-in" : "link-waitlist"}
              >
                {showWaitlist ? 'Sign in' : 'Join the waitlist'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground/80">
              By signing in, you agree to our{' '}
              <button className="text-primary hover:text-accent transition-colors" data-testid="link-terms">
                Terms
              </button>
              {' '}and{' '}
              <button className="text-primary hover:text-accent transition-colors" data-testid="link-privacy">
                Privacy Policy
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}