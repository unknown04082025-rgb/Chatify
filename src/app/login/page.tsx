'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));
    const result = login(email, password);

    if (result === 'error') {
      setError('Invalid email or password. Try priya@chatify.io / demo123');
      setLoading(false);
      return;
    }

    if (result === 'needs-otp') {
      router.push('/verify');
      return;
    }

    router.push('/chats');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Top Navigation (Mobile/Simple) */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between p-6 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-white text-2xl">chat_bubble</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Chatify</h2>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="text-sm font-medium">English</span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </div>
      </div>

      {/* Main Login Card */}
      <main className="w-full max-w-[480px] z-10">
        <div className="glass-card rounded-xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">lock_open</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">Enter your workspace credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-100 placeholder:text-slate-500" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link className="text-sm font-semibold text-primary hover:underline transition-all" href="#">Forgot?</Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">key</span>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-100 placeholder:text-slate-500" 
                  placeholder="••••••••" 
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="appearance-none"
                >
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background-dark px-2 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 hover:bg-white/5 transition-all text-slate-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="currentColor"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
              </svg>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 hover:bg-white/5 transition-all text-slate-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              <span className="text-sm font-semibold">GitHub</span>
            </button>
          </div>

          {/* Bottom Link */}
          <p className="text-center mt-10 text-slate-500 dark:text-slate-400 font-medium">
            Don&apos;t have an account? 
            <Link className="text-primary hover:text-blue-400 font-bold transition-colors ml-1" href="/signup">Create an account</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 flex flex-col items-center gap-4 text-slate-500 text-xs">
        <div className="flex gap-6 uppercase tracking-widest font-semibold flex-wrap justify-center">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-primary transition-colors" href="#">Contact Support</Link>
        </div>
        <p>© 2024 Chatify Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
