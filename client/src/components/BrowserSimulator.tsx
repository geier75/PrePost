import { useState } from 'react';
import { X, Minimize2, Maximize2, ArrowLeft, ArrowRight, RotateCw, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BrowserSimulatorProps {
  platform: any;
  onClose: () => void;
  onAnalyze: (content: string) => void;
  riskScore?: number;
}

export default function BrowserSimulator({ platform, onClose, onAnalyze, riskScore }: BrowserSimulatorProps) {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState(`https://www.${platform.id}.com/compose/post`);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Debounce analysis
    const timeoutId = setTimeout(() => onAnalyze(newContent), 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-4xl h-[80vh] bg-background border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Browser Toolbar */}
        <div className="h-12 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-4">
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
        <div className="flex-1 bg-[#f0f2f5] relative flex">
          
          {/* Platform UI Simulation */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              
              {/* Platform Header Simulation */}
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

              {/* Native-like Editor */}
              <Textarea 
                placeholder={`What's on your mind, John?`}
                className="min-h-[200px] border-none resize-none text-lg text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 p-0 bg-transparent"
                value={content}
                onChange={handleContentChange}
              />

              {/* Platform Footer Simulation */}
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <div className="text-xs text-gray-400">Add to your post</div>
                <Button 
                  className={`px-8 ${content ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 text-gray-400 hover:bg-gray-200'}`}
                  disabled={!content}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* PREPOST AI Overlay */}
          <div className="w-80 bg-[#0a0a0a] border-l border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              PREPOST Analysis
            </div>

            {riskScore !== undefined && (
              <div className={`p-4 rounded-lg border ${
                riskScore > 50 ? 'bg-red-500/10 border-red-500/50' : 'bg-green-500/10 border-green-500/50'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Risk Score</span>
                  <span className={`text-xl font-bold ${riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                    {riskScore}/100
                  </span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-3">
              {riskScore && riskScore > 50 ? (
                <div className="flex gap-3 p-3 rounded bg-white/5 border border-white/10 text-xs">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p className="text-muted-foreground">
                    This post may violate <span className="text-white font-medium">German Hate Speech Laws (NetzDG)</span>. Consider rephrasing.
                  </p>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground mt-10">
                  Start typing to get real-time legal risk analysis...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
