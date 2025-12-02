import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import CyberBackground from '@/components/CyberBackground';
import { useState } from 'react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLocation('/app');
    }, 1500);
  };

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden flex items-center justify-center p-4">
      <CyberBackground />
      
      <Link href="/">
        <Button variant="ghost" className="absolute top-8 left-8 text-muted-foreground hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </Link>

      <Card className="w-full max-w-md p-8 bg-background/50 backdrop-blur-xl border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-white/20">
            <Shield className="w-6 h-6 text-background" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to access your secure analysis dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-muted-foreground">Email Address</label>
            <Input 
              type="email" 
              placeholder="name@company.com" 
              className="bg-white/5 border-white/10 focus:border-white/30 h-11"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-muted-foreground">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="bg-white/5 border-white/10 focus:border-white/30 h-11"
              required 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-background hover:bg-white/90 h-11 font-medium mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our <span className="text-white underline cursor-pointer">Terms of Service</span> and <span className="text-white underline cursor-pointer">Privacy Policy</span>.
        </div>
      </Card>
    </div>
  );
}
