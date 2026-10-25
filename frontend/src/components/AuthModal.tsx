import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || 'Candidate',
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMessage('Account created successfully! Signing you in...');
          setTimeout(() => {
            onAuthSuccess();
            onClose();
          }, 600);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          onAuthSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      console.error('[Auth Error]:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-modal border border-[#E2E0D8] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#EAE8E0] bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#080E24] p-1 flex items-center justify-center shadow-xs">
              <img src="/hirepilot-emblem.svg" alt="HirePilot" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-ink-950 tracking-tight">
                {isSignUp ? 'Create HirePilot Account' : 'Welcome to HirePilot'}
              </h3>
              <p className="text-[11px] text-ink-500 font-medium">
                {isSignUp ? 'Save your resumes & interview prep to cloud DB' : 'Sign in to access your cloud applications'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-ink-800 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E0D8] bg-[#FAF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-500/30 focus:border-cobalt-600 transition-all text-ink-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink-800 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E0D8] bg-[#FAF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-500/30 focus:border-cobalt-600 transition-all text-ink-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-800 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E0D8] bg-[#FAF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-500/30 focus:border-cobalt-600 transition-all text-ink-900"
              />
            </div>
            {isSignUp && (
              <span className="text-[10px] text-ink-500 mt-1 block">Minimum 6 characters</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-cobalt-600 hover:bg-cobalt-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? 'Create Cloud Account' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-2 border-t border-[#EAE8E0]">
            <p className="text-xs text-ink-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="font-bold text-cobalt-600 hover:text-cobalt-700 underline cursor-pointer"
              >
                {isSignUp ? 'Sign In here' : 'Create an account'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
