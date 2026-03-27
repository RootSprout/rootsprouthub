import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-deep text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black-soft p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gold/70">Get started</p>
          <h1 className="mt-2 text-3xl font-bold">Create your account</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs text-white/60">Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black-deep px-4 py-3 text-sm outline-none focus:border-gold"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/60">Email</label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black-deep px-4 py-3 text-sm outline-none focus:border-gold"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/60">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black-deep px-4 py-3 text-sm outline-none focus:border-gold"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gold px-4 py-3 text-sm font-bold text-black-deep glow-gold hover:glow-gold-strong transition-all"
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
