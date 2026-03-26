import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black-deep text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black-soft p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gold/70">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold">Sign in to Rootsprouthub</h1>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-white/60">Email</label>
            <input
              type="email"
              placeholder="you@domain.com"
              className="w-full rounded-xl border border-white/10 bg-black-deep px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/60">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black-deep px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-gold px-4 py-3 text-sm font-bold text-black-deep glow-gold hover:glow-gold-strong transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/60">
          New here?{' '}
          <Link to="/register" className="text-gold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
