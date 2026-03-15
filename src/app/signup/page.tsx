'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

const AVATARS = ['😎', '🌸', '🔥', '✨', '🚀', '🎯', '💫', '🦋', '🌊', '⚡', '🎸', '🌺', '🦊', '🐬', '🎨'];

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAppStore();

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'normal' | 'atithi'>('normal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('😎');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'atithi') {
      router.push('/atithi-request');
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    signUp({ email, username, displayName, avatar, type: 'normal' }, password);
    router.push('/chats');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-mesh overflow-x-hidden">
      {/* Header Nav */}
      <div className="flex items-center p-4 justify-between lg:max-w-md lg:mx-auto w-full">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-white transition-colors flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div className="size-12 shrink-0"></div>
        )}
        <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">Create Account</h2>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 w-full max-w-md mx-auto">
        {/* Branding */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/20 mb-6 border border-primary/30">
            <span className="material-symbols-outlined text-4xl text-primary">forum</span>
          </div>
          <h1 className="text-slate-100 tracking-tight text-3xl font-bold leading-tight mb-2">Join Chatify</h1>
          <p className="text-slate-400 text-sm font-normal">Connect with the world in professional style</p>
          
          {/* Progress */}
          <div className="flex gap-2 mt-6">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-slate-700/50'}`} />
            ))}
          </div>
        </div>

        {/* Signup Form Glass Card */}
        <div className="glass-card w-full rounded-xl p-8 shadow-2xl">
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
               {/* Account Type Selection */}
               <div className="grid grid-cols-2 gap-3 mb-4">
                  <button type="button" onClick={() => setUserType('normal')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${userType === 'normal' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(36,99,235,0.2)]' : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-800/50'}`}>
                    <span className="text-2xl">👤</span>
                    <span className="text-xs font-bold text-slate-200">Normal</span>
                  </button>
                  <button type="button" onClick={() => setUserType('atithi')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${userType === 'atithi' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(36,99,235,0.2)]' : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-800/50'}`}>
                    <span className="text-2xl">⭐</span>
                    <span className="text-xs font-bold text-slate-200">Atithi</span>
                  </button>
               </div>

              {userType === 'normal' && (
                <>
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Email Address</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">mail</span>
                      <input className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                        placeholder="name@company.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  
                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Password</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">lock</span>
                      <input className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                        placeholder="••••••••" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" type="button" onClick={() => setShowPass(!showPass)}>
                        <span className="material-symbols-outlined text-xl">{showPass ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2" type="submit">
                {userType === 'atithi' ? 'Request Atithi Access' : 'Continue'}
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Display Name */}
               <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">person</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                    placeholder="John Doe" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
                </div>
              </div>

               {/* Username */}
               <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Username</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                    placeholder="unique_username" type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))} required />
                </div>
              </div>

              {/* Avatar */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Choose Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button key={a} type="button" onClick={() => setAvatar(a)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        avatar === a ? 'bg-primary/30 border-2 border-primary scale-110 shadow-[0_0_15px_rgba(36,99,235,0.3)]' : 'bg-slate-900/30 border border-slate-700/50 hover:bg-slate-800/50'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2" type="submit">
                Continue Setup
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col items-center justify-center pt-2">
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-5xl mb-4 shadow-[0_0_30px_rgba(36,99,235,0.2)]">
                    {avatar}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">{displayName}</h3>
                  <span className="text-sm font-medium text-slate-400">@{username}</span>
               </div>

               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                    <span className="material-symbols-outlined text-lg">verified_user</span> Protected Account
                  </div>
                  <ul className="list-disc pl-5 opacity-80 space-y-1 text-xs">
                    <li>End-to-end encrypted messaging</li>
                    <li>Secure vault activated</li>
                    <li>Avatar is permanent</li>
                  </ul>
               </div>

               <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2 disabled:opacity-70" type="submit">
                {loading ? 'Creating Account...' : 'Finish & Enter Chatify'}
                {!loading && <span className="material-symbols-outlined text-xl">login</span>}
              </button>
            </form>
          )}


          {step === 1 && (
            <>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm">
                <span className="text-slate-400">Already have an account?</span>
                <Link className="text-primary font-semibold hover:underline" href="/login">Log In</Link>
              </div>

              {/* Social Signup */}
              <div className="w-full mt-8">
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-slate-700/50"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-widest font-semibold">Or join with</span>
                  <div className="flex-grow border-t border-slate-700/50"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700/50 bg-slate-900/30 hover:bg-slate-800/50 transition-colors text-slate-300 font-medium">
                    <svg className="w-5 h-5 text-slate-200" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="currentColor"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                    </svg>
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700/50 bg-slate-900/30 hover:bg-slate-800/50 transition-colors text-slate-300 font-medium">
                    <svg className="w-5 h-5 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
