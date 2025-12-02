import { useState, useEffect } from 'react';
import { X, Minimize2, Maximize2, ArrowLeft, ArrowRight, RotateCw, Lock, ShieldCheck, AlertTriangle, Image, Smile, Calendar, MapPin, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface BrowserSimulatorProps {
  platform: any;
  onClose: () => void;
  onAnalyze: (content: string) => void;
  riskScore?: number;
  analysisResult?: any;
}

export default function BrowserSimulator({ platform, onClose, onAnalyze, riskScore, analysisResult }: BrowserSimulatorProps) {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState(`https://www.${platform.id}.com/compose/post`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounce analysis
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content.length > 5) {
        setIsAnalyzing(true);
        onAnalyze(content);
        // Simulate analysis delay for realism
        setTimeout(() => setIsAnalyzing(false), 800);
      }
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [content, onAnalyze]);

  const isTwitter = platform.id === 'twitter' || platform.id === 'x';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-5xl h-[85vh] bg-background border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Browser Toolbar */}
        <div className="h-12 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          
          <div className="flex gap-4 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            <ArrowRight className="w-4 h-4" />
            <RotateCw className="w-4 h-4" />
          </div>

          <div className="flex-1 h-8 bg-[#0a0a0a] rounded-md flex items-center px-3 gap-2 text-xs text-muted-foreground border border-white/5">
            <Lock className="w-3 h-3 text-green-500" />
            <span className="text-white">{url}</span>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="flex-1 bg-black relative flex overflow-hidden">
          
          {/* Platform UI Simulation */}
          <div className={`flex-1 overflow-y-auto ${isTwitter ? 'bg-black text-white' : 'bg-[#f0f2f5]'}`}>
            <div className={`max-w-xl mx-auto mt-8 ${isTwitter ? 'bg-black' : 'bg-white rounded-lg shadow-sm border border-gray-200 p-4'}`}>
              
              {isTwitter ? (
                // Twitter/X Specific UI
                <div className="p-4 border-b border-gray-800">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea 
                        placeholder="What is happening?!"
                        className="min-h-[120px] border-none resize-none text-xl text-white placeholder:text-gray-500 focus-visible:ring-0 p-0 bg-transparent"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      
                      {/* Twitter specific warning overlay if high risk */}
                      <AnimatePresence>
                        {riskScore && riskScore > 50 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3"
                          >
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <div className="text-sm text-red-200">
                              <span className="font-bold block text-red-400">Wait! This might be risky.</span>
                              PREPOST detected potential legal issues with this tweet. Check the sidebar for details.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                        <div className="flex gap-2 text-[#1d9bf0]">
                          <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><Image className="w-5 h-5" /></div>
                          <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><BarChart2 className="w-5 h-5" /></div>
                          <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><Smile className="w-5 h-5" /></div>
                          <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><Calendar className="w-5 h-5" /></div>
                          <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><MapPin className="w-5 h-5" /></div>
                        </div>
                        <Button 
                          className={`px-6 rounded-full font-bold ${content ? 'bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white' : 'bg-[#0f4e78] text-gray-400 hover:bg-[#0f4e78]'}`}
                          disabled={!content}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Generic/Facebook UI
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">John Doe</div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">Public</div>
                    </div>
                  </div>

                  <Textarea 
                    placeholder={`What's on your mind, John?`}
                    className="min-h-[200px] border-none resize-none text-lg text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 p-0 bg-transparent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-400">Add to your post</div>
                    <Button 
                      className={`px-8 ${content ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 text-gray-400 hover:bg-gray-200'}`}
                      disabled={!content}
                    >
                      Post
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* PREPOST AI Overlay - Dynamic Side Panel */}
          <div className="w-96 bg-[#0a0a0a] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl z-10 relative">
            {/* Glassmorphism background effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none" />
            <div className="p-4 border-b border-white/10 bg-[#0f0f0f]">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className={`w-5 h-5 ${isAnalyzing ? 'animate-pulse text-blue-500' : 'text-green-500'}`} />
                PREPOST Analysis
                {isAnalyzing && <span className="text-xs font-normal text-muted-foreground ml-auto">Analyzing...</span>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {content.length < 5 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <RotateCw className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm max-w-[200px]">Start typing in the simulator to get real-time legal risk analysis.</p>
                </div>
              ) : (
                <>
                  {/* Risk Score Card */}
                  <div className={`p-5 rounded-xl border transition-colors duration-500 ${
                    riskScore && riskScore > 50 
                      ? 'bg-red-500/5 border-red-500/30' 
                      : riskScore && riskScore > 20 
                        ? 'bg-yellow-500/5 border-yellow-500/30'
                        : 'bg-green-500/5 border-green-500/30'
                  }`}>
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Legal Risk Score</span>
                      <span className={`text-3xl font-black tracking-tighter ${
                        riskScore && riskScore > 50 ? 'text-red-500' : riskScore && riskScore > 20 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {riskScore || 0}
                      </span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${riskScore || 0}%` }}
                        className={`h-full ${
                          riskScore && riskScore > 50 ? 'bg-red-500' : riskScore && riskScore > 20 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Analysis Details */}
                  {analysisResult && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {analysisResult.verdict && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase">Verdict</h4>
                          <p className="text-sm text-white leading-relaxed">{analysisResult.verdict}</p>
                        </div>
                      )}

                      {analysisResult.risks && analysisResult.risks.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-red-400 uppercase">Identified Risks</h4>
                          <ul className="space-y-2">
                            {analysisResult.risks.map((risk: string, i: number) => (
                              <li key={i} className="flex gap-2 text-sm text-red-200 bg-red-500/10 p-2 rounded border border-red-500/20">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-400 uppercase">Safe Alternatives</h4>
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                            <p className="text-sm text-blue-100 italic">"{analysisResult.suggestions[0]}"</p>
                            <Button size="sm" variant="ghost" className="mt-2 h-6 text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 w-full">
                              Apply Suggestion
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
