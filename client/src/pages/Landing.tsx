import { Button } from '@/components/ui/button';
import { Shield, Globe, Zap, ChevronRight, Lock } from 'lucide-react';
import { Link } from 'wouter';
import CyberBackground from '@/components/CyberBackground';
import ComplianceFooter from '@/components/ComplianceFooter';

export default function Landing() {
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden flex flex-col">
      <CyberBackground />
      
      {/* Navigation */}
      <nav className="container mx-auto py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-bold tracking-tight">PREPOST</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium hover:bg-white/10">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-white text-background hover:bg-white/90 rounded-full px-6">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto flex flex-col justify-center items-center text-center relative z-10 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          EU AI Act Compliant & GDPR Ready
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 animate-fade-in-up animation-delay-100">
          Post with Confidence in a Complex World.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in-up animation-delay-200">
          The first AI-powered legal risk analyzer that checks your content against local laws, cultural norms, and platform policies in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
          <Link href="/login">
            <Button size="lg" className="bg-white text-background hover:bg-white/90 rounded-full px-8 h-12 text-base">
              Start Free Analysis <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 rounded-full px-8 h-12 text-base">
            View Compliance Report
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl animate-fade-in-up animation-delay-500">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition-colors">
            <Globe className="w-8 h-8 mb-4 text-blue-400" />
            <h3 className="text-lg font-semibold mb-2">Global Jurisdiction</h3>
            <p className="text-sm text-muted-foreground">Real-time analysis against laws in Germany, USA, UK, China, and more.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition-colors">
            <Zap className="w-8 h-8 mb-4 text-yellow-400" />
            <h3 className="text-lg font-semibold mb-2">Instant Feedback</h3>
            <p className="text-sm text-muted-foreground">Get a comprehensive risk score and actionable suggestions in milliseconds.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition-colors">
            <Lock className="w-8 h-8 mb-4 text-green-400" />
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">Your content is analyzed locally. No data is stored on our servers.</p>
          </div>
        </div>
      </main>

      <ComplianceFooter />
    </div>
  );
}
