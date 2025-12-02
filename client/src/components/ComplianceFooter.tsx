import { ShieldCheck, Leaf, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ComplianceFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-white/5 z-50 flex justify-between items-center text-[10px] text-muted-foreground">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1 hover:text-primary transition-colors">
              <ShieldCheck className="w-3 h-3" />
              <span>EU AI Act Compliant</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>This system is classified as a Limited Risk AI system under the EU AI Act.<br/>Transparency obligations are fully met.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1 hover:text-primary transition-colors">
              <ShieldCheck className="w-3 h-3" />
              <span>GDPR Ready</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data is processed locally in your browser session.<br/>No personal data is stored on our servers.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <Leaf className="w-3 h-3" />
              <span>Sustainable AI</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Optimized for low energy consumption.<br/>Green IT principles applied.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span>v2.1.0 (Stable)</span>
      </div>
    </footer>
  );
}
