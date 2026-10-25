import React from 'react';
import { 
  FileText, 
  Search, 
  HelpCircle, 
  CheckSquare, 
  Layers, 
  PlusCircle, 
  ExternalLink,
  Briefcase,
  User,
  LogOut
} from 'lucide-react';
import { StepId, SystemHealth, ApplicationSession } from '../types';

interface NavbarProps {
  currentStep: StepId;
  onNavigate: (step: StepId) => void;
  systemHealth: SystemHealth | null;
  activeSession: ApplicationSession | null;
  onNewSession: () => void;
  onOpenHealthModal: () => void;
  user?: any;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onNavigate,
  systemHealth,
  activeSession,
  onNewSession,
  onOpenHealthModal,
  user,
  onOpenAuthModal,
  onSignOut,
}) => {
  const steps: { 
    id: StepId; 
    shortLabel: string; 
    fullLabel: string; 
    icon: React.ReactNode; 
    requiresSession: boolean 
  }[] = [
    { 
      id: 'setup', 
      shortLabel: '1. Setup', 
      fullLabel: '1. Setup', 
      icon: <Layers className="w-3.5 h-3.5 shrink-0" />, 
      requiresSession: false 
    },
    { 
      id: 'analysis', 
      shortLabel: '2. Analysis', 
      fullLabel: '2. Analysis & Gaps', 
      icon: <Search className="w-3.5 h-3.5 shrink-0" />, 
      requiresSession: true 
    },
    { 
      id: 'studio', 
      shortLabel: '3. Resume', 
      fullLabel: '3. Tailored Resume', 
      icon: <FileText className="w-3.5 h-3.5 shrink-0" />, 
      requiresSession: true 
    },
    { 
      id: 'interview', 
      shortLabel: '4. Interview', 
      fullLabel: '4. Interview Prep', 
      icon: <HelpCircle className="w-3.5 h-3.5 shrink-0" />, 
      requiresSession: true 
    },
    { 
      id: 'checklist', 
      shortLabel: '5. Plan', 
      fullLabel: '5. Prep Plan', 
      icon: <CheckSquare className="w-3.5 h-3.5 shrink-0" />, 
      requiresSession: true 
    },
  ];

  const isModelReady = systemHealth?.ollama?.model_available;
  const isOllamaConnected = systemHealth?.ollama?.connected;

  // Calculate checklist progress if available
  const totalItems = activeSession?.checklist?.length || 0;
  const completedItems = activeSession?.checklist?.filter((c) => c.completed).length || 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E2E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Wordmark & HirePilot Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500/40 rounded-lg p-1 -m-1 text-left"
              title="HirePilot AI — Career Intelligence Platform"
            >
              {/* HirePilot Brand Emblem */}
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#080E24] p-0.5 border border-[#080E24]/20 shadow-xs group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
                <img 
                  src="/hirepilot-emblem.svg" 
                  alt="HirePilot AI Emblem" 
                  className="w-full h-full object-contain rounded-md"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-base sm:text-lg text-ink-950 tracking-tight leading-none">
                    HirePilot
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cobalt-50 text-cobalt-700 border border-cobalt-200">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-ink-500 font-medium tracking-tight">Career Intelligence</span>
                </div>
              </div>
            </button>

            {/* Active Job Context Chip (Compact and non-colliding) */}
            {activeSession && activeSession.job_title && (
              <div className="hidden 2xl:flex items-center gap-1.5 pl-3 border-l border-[#E2E0D8] text-xs text-ink-700">
                <Briefcase className="w-3.5 h-3.5 text-ink-400 shrink-0" />
                <span className="truncate max-w-[140px] font-medium text-ink-800">
                  {activeSession.company_name || activeSession.job_title}
                </span>
              </div>
            )}
          </div>

          {/* Step Workflow Navigation: Unified Segmented Pill Track */}
          {currentStep !== 'landing' && (
            <nav 
              aria-label="Workflow progress"
              className="hidden lg:flex items-center bg-[#EFECE6]/80 p-1 rounded-xl border border-[#E2E0D8] shadow-inner-sm shrink-0"
            >
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isDisabled = step.requiresSession && !activeSession?.analysis;
                return (
                  <button
                    key={step.id}
                    onClick={() => !isDisabled && onNavigate(step.id)}
                    disabled={isDisabled}
                    title={step.fullLabel}
                    className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all select-none ${
                      isActive
                        ? 'bg-ink-950 text-white shadow-xs'
                        : isDisabled
                        ? 'text-ink-400 cursor-not-allowed opacity-50'
                        : 'text-ink-700 hover:text-ink-950 hover:bg-white/70'
                    }`}
                  >
                    {step.icon}
                    <span className="hidden xl:inline">{step.fullLabel}</span>
                    <span className="inline xl:hidden">{step.shortLabel}</span>

                    {/* Step 5 Checklist completion badge */}
                    {step.id === 'checklist' && totalItems > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 leading-tight ${
                        isActive 
                          ? 'bg-cobalt-500 text-white' 
                          : 'bg-cobalt-100 text-cobalt-800'
                      }`}>
                        {progressPercent}%
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Model Health Badge and New Job CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Ollama Local Health Pill */}
            <button
              onClick={onOpenHealthModal}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-xs ${
                isModelReady
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : isOllamaConnected
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
              title="Click to view local model status & privacy diagnostics"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isModelReady ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isModelReady ? 'bg-emerald-500' : isOllamaConnected ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
              </span>
              <span className="font-mono text-[11px] font-semibold">
                {isModelReady
                  ? (systemHealth?.ollama?.provider === 'openrouter' ? 'Gemma 4 · Online' : `${systemHealth?.ollama?.target_model || 'Gemma'} · Ready`)
                  : isOllamaConnected ? 'Model Missing' : 'Engine Offline'}
              </span>
            </button>


            {/* Supabase User Cloud Auth Chip */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1.5 pr-1.5 py-1 rounded-lg border border-[#E2E0D8] bg-white text-xs shadow-xs">
                <div className="w-5 h-5 rounded-full bg-cobalt-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate text-ink-800 font-medium text-[11px] hidden md:inline">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1 text-ink-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cobalt-700 bg-cobalt-50 hover:bg-cobalt-100 border border-cobalt-200 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* New Application CTA */}
            <button
              onClick={onNewSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-ink-950 border border-[#E2E0D8] hover:bg-[#F4F3EE] hover:border-ink-400 shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cobalt-600" />
              <span>New Job</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
