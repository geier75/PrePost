import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Globe, Zap, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { analyzeContent } from '@/lib/ai-service';
import Globe3D from '@/components/Globe3D';
import PlatformHub from '@/components/PlatformHub';
import BrowserSimulator from '@/components/BrowserSimulator';
import CyberBackground from '@/components/CyberBackground';
import ComplianceFooter from '@/components/ComplianceFooter';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [country, setCountry] = useState('DE');
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<number | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    const data = await analyzeContent(content, country);
    setResult(data);
    setIsAnalyzing(false);
  };

  // Mock platform selection for demo
  const openSimulator = (platformId: string) => {
    setSelectedPlatform({ id: platformId });
  };

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden flex flex-col">
      <CyberBackground />
      
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md flex items-center px-6 justify-between z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-white" />
          <span className="font-bold tracking-tight">PREPOST <span className="text-[10px] font-normal text-muted-foreground ml-1">ENTERPRISE</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {t('system_online')}
          </div>
          {/* <LanguageSwitcher /> */}
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
            JD
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6 pb-24 z-10 overflow-y-auto">
        
        {/* Top Section: Globe & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> {t('global_jurisdiction')}
            </h2>
            <Globe3D onCountrySelect={setCountry} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> {t('quick_stats')}
            </h2>
            <Card className="p-4 bg-white/5 border-white/10">
              <div className="text-sm text-muted-foreground mb-1">{t('current_jurisdiction')}</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {country} <span className="text-xs font-normal text-muted-foreground bg-white/10 px-2 py-0.5 rounded">EU AI Act Applied</span>
              </div>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10">
              <div className="text-sm text-muted-foreground mb-1">{t('protected_posts')}</div>
              <div className="text-2xl font-bold text-white">1,248</div>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10">
              <div className="text-sm text-muted-foreground mb-1">{t('risk_averted')}</div>
              <div className="text-2xl font-bold text-green-400">98.4%</div>
            </Card>
          </div>
        </div>

        {/* Platform Hub */}
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-400" /> {t('connected_platforms')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['google', 'facebook', 'twitter', 'linkedin', 'instagram'].map(id => (
            <Button 
              key={id}
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
              onClick={() => openSimulator(id)}
            >
              <span className="capitalize">{id}</span>
              <span className="text-[10px] text-muted-foreground">OPEN LIVE BROWSER</span>
            </Button>
          ))}
        </div>

        {/* Classic Analysis (Fallback) */}
        <h2 className="text-lg font-medium mb-4">{t('manual_analysis')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{t('input_parameters')}</h3>
              <span className="text-[10px] text-green-400">{t('secure_channel')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('target_platform')}</label>
                <Select defaultValue="linkedin">
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LINKEDIN</SelectItem>
                    <SelectItem value="twitter">X (TWITTER)</SelectItem>
                    <SelectItem value="facebook">FACEBOOK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('jurisdiction')}</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DE">GERMANY (DE)</SelectItem>
                    <SelectItem value="US">USA (US)</SelectItem>
                    <SelectItem value="GB">UK (GB)</SelectItem>
                    <SelectItem value="CN">CHINA (CN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('content_stream')}</label>
                <span className="text-[10px] text-muted-foreground">{content.length}/5000 CHARS</span>
              </div>
              <Textarea 
                placeholder={t('enter_content')}
                className="min-h-[200px] bg-black/20 border-white/10 font-mono text-sm resize-none focus-visible:ring-1 focus-visible:ring-white/20"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <Button 
              className="w-full bg-white text-background hover:bg-white/90 font-bold tracking-wide"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? t('analyzing') : t('initiate_analysis')}
            </Button>
          </Card>

          {/* Results Panel */}
          <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm flex flex-col justify-center items-center min-h-[400px]">
            {result ? (
              <div className="w-full space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{t('risk_score')}</div>
                  <div className={cn("text-6xl font-black tracking-tighter mb-2", 
                    result.riskScore > 50 ? "text-red-500" : "text-green-500"
                  )}>
                    {result.riskScore}
                  </div>
                  <div className={cn("inline-block px-3 py-1 rounded border text-xs font-bold",
                    result.riskScore > 50 ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-green-500/10 border-green-500/50 text-green-500"
                  )}>
                    {t('verdict')}: {result.verdict}
                  </div>
                </div>

                <div className="space-y-3">
                  {result.suggestions.map((suggestion: string, i: number) => (
                    <div key={i} className="flex gap-3 p-3 rounded bg-white/5 border border-white/10 text-xs">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                      <p className="text-muted-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto animate-spin-slow">
                  <Zap className="w-6 h-6 text-white/20" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">{t('awaiting_data')}</div>
                <p className="text-xs text-muted-foreground/50 max-w-[200px] mx-auto">
                  {t('enter_content')}
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      <ComplianceFooter />

      {/* Browser Simulator Modal */}
      {selectedPlatform && (
        <BrowserSimulator 
          platform={selectedPlatform} 
          onClose={() => setSelectedPlatform(null)}
          onAnalyze={async (text) => {
            const res = await analyzeContent(text, country);
            setRiskScore(res.riskScore);
          }}
          riskScore={riskScore}
        />
      )}
    </div>
  );
}
