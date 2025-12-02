import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Linkedin, Twitter, Instagram, Facebook, CheckCircle2, Plus } from 'lucide-react';
import { useState } from 'react';

const PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', connected: true },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-white', connected: false },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', connected: false },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', connected: false },
];

export default function PlatformHub() {
  const [platforms, setPlatforms] = useState(PLATFORMS);

  const toggleConnection = (id: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === id ? { ...p, connected: !p.connected } : p
    ));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {platforms.map((platform) => (
        <Card 
          key={platform.id}
          className={`p-4 border transition-all duration-300 cursor-pointer group relative overflow-hidden ${
            platform.connected 
              ? 'bg-white/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => toggleConnection(platform.id)}
        >
          <div className="flex flex-col items-center gap-3 relative z-10">
            <platform.icon className={`w-8 h-8 ${platform.color}`} />
            <span className="text-xs font-medium">{platform.name}</span>
            
            {platform.connected ? (
              <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-white transition-colors">
                <Plus className="w-3 h-3" /> Connect
              </div>
            )}
          </div>
          
          {/* Glass Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </Card>
      ))}
    </div>
  );
}
