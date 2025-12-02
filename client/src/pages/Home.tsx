import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, AlertOctagon, ChevronRight, Globe, Lock, Activity } from 'lucide-react';
import CyberBackground from '@/components/CyberBackground';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { analyzeContent } from '@/lib/ai-service';

export default function Home() {
  const [content, setContent] = useState('');
  const [country, setCountry] = useState('DE');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    const data = await analyzeContent(content, country);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <CyberBackground />
      
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary rounded-none flex items-center justify-center relative overflow-hidden group">
              <Shield className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-glow">PREPOST</h1>
              <p className="text-[10px] text-primary/60 tracking-[0.2em] uppercase">Legal Risk Analyzer v2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-xs font-mono text-primary">
              <Activity className="w-3 h-3 animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Column: Input */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-1 bg-card/50 border-primary/20 backdrop-blur-sm cyber-border">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  INPUT PARAMETERS
                </h2>
                <span className="text-xs font-mono text-muted-foreground">SECURE CHANNEL</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-primary/80 uppercase">Target Platform</label>
                  <Select defaultValue="linkedin">
                    <SelectTrigger className="bg-background/50 border-primary/30 text-foreground font-mono rounded-none focus:ring-primary/50">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/30 text-foreground">
                      <SelectItem value="linkedin">LINKEDIN</SelectItem>
                      <SelectItem value="twitter">TWITTER / X</SelectItem>
                      <SelectItem value="facebook">FACEBOOK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-primary/80 uppercase">Jurisdiction</label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="bg-background/50 border-primary/30 text-foreground font-mono rounded-none focus:ring-primary/50">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/30 text-foreground">
                      <SelectItem value="DE">GERMANY (DE)</SelectItem>
                      <SelectItem value="US">USA (US)</SelectItem>
                      <SelectItem value="GB">UK (GB)</SelectItem>
                      <SelectItem value="CN">CHINA (CN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-mono text-primary/80 uppercase">Content Stream</label>
                  <span className="text-xs font-mono text-muted-foreground">{content.length}/5000 CHARS</span>
                </div>
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ENTER CONTENT FOR ANALYSIS..."
                  className="min-h-[300px] bg-background/50 border-primary/30 font-mono text-sm resize-none rounded-none focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                />
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content}
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 rounded-none h-12 font-bold tracking-widest relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAnalyzing ? 'ANALYZING DATA STREAM...' : 'INITIATE ANALYSIS'}
                  {!isAnalyzing && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Analysis */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Main Score Card */}
                <Card className={cn(
                  "p-1 backdrop-blur-sm cyber-border",
                  result.verdict === 'SAFE' ? "border-primary/50" : "border-destructive/50"
                )}>
                  <div className="p-8 text-center space-y-4 bg-gradient-to-b from-background/80 to-background/40">
                    <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Risk Assessment Protocol</h3>
                    
                    <div className="relative inline-block">
                      <div className={cn(
                        "text-8xl font-black tracking-tighter",
                        result.verdict === 'SAFE' ? "text-primary text-glow" : "text-destructive text-glow-orange"
                      )}>
                        {result.riskScore}
                      </div>
                      <div className="absolute -top-4 -right-8 text-xs font-mono border border-current px-2 py-0.5 rounded-full opacity-70">
                        /100
                      </div>
                    </div>

                    <div className={cn(
                      "text-2xl font-bold tracking-widest uppercase",
                      result.verdict === 'SAFE' ? "text-primary" : "text-destructive"
                    )}>
                      VERDICT: {result.verdict}
                    </div>
                  </div>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(result.categories).map(([key, value]: [string, any]) => (
                    <Card key={key} className="p-4 bg-card/30 border-white/10 backdrop-blur-sm">
                      <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">{key}</div>
                      <div className="text-2xl font-bold text-foreground">{value}%</div>
                      <div className="h-1 w-full bg-white/10 mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          className={cn(
                            "h-full",
                            value > 50 ? "bg-primary" : "bg-destructive"
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Suggestions */}
                <Card className="p-6 bg-card/30 border-white/10 backdrop-blur-sm space-y-4">
                  <h3 className="text-sm font-mono text-primary uppercase flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Security Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {result.suggestions.map((suggestion: string, i: number) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-1">➜</span>
                        {suggestion}
                      </motion.li>
                    ))}
                  </ul>
                </Card>

              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 p-12 border border-white/5 rounded-lg bg-white/5 backdrop-blur-sm"
              >
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center animate-spin-slow">
                  <Activity className="w-10 h-10 text-white/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white/40">AWAITING DATA STREAM</h3>
                  <p className="text-sm font-mono text-white/20">Enter content to initiate legal risk analysis protocol.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
