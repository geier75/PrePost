import { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, RotateCw, Lock, Monitor } from 'lucide-react';

interface BrowserSimulatorProps {
  platform: any;
  onClose: () => void;
  onAnalyze: (content: string) => void;
  riskScore?: number;
  analysisResult?: any;
}

export default function BrowserSimulator({ platform, onClose, onAnalyze }: BrowserSimulatorProps) {
  const [vncUrl, setVncUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Construct VNC URL based on current hostname
    // Replace port 3001 with 6081
    const currentHost = window.location.hostname;
    const vncHost = currentHost.replace('3001', '6081');
    const protocol = window.location.protocol;
    
    // Use vnc_lite.html for a cleaner interface, autoconnect=true to skip connection dialog
    const url = `${protocol}//${vncHost}/vnc_lite.html?autoconnect=true&resize=scale`;
    setVncUrl(url);
    
    // Simulate connection delay
    setTimeout(() => setIsConnected(true), 2000);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300 pointer-events-auto">
      <div className="w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Remote Desktop Toolbar */}
        <div className="h-14 bg-[#111] border-b border-white/5 flex items-center px-4 gap-4 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span>Remote Secure Browser</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'}`} />
                {isConnected ? 'Connected to Secure Cloud' : 'Connecting...'}
             </div>
          </div>
        </div>

        {/* VNC Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {!isConnected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Establishing secure remote connection...</p>
            </div>
          )}
          
          <iframe 
            src={vncUrl} 
            className="w-full h-full border-none bg-black"
            title="Remote Browser"
            allow="clipboard-read; clipboard-write"
          />
          
          {/* Overlay Instruction */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white/70 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 text-sm pointer-events-none">
            You are controlling a remote Chrome instance. Type and browse freely.
          </div>
        </div>
      </div>
    </div>
  );
}
