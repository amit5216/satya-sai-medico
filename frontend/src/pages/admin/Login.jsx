import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input, Label } from '../../components/ui/input';

/**
 * ============================================================
 * ADMIN LOGIN PAGE — Premium SaaS-style authentication
 * ============================================================
 *
 * 🎓 DESIGN DECISIONS:
 * - Animated gradient mesh background for visual depth
 * - Glassmorphism card for premium feel
 * - Shake animation on error for immediate feedback
 * - Loading spinner integrated into button
 * - Password visibility toggle for UX
 *
 * 🎓 INTERVIEW: "Walk me through the login flow"
 * → "User submits credentials → React calls AuthContext.login()
 *    → login() calls POST /api/auth/login → Backend validates
 *    with Spring Security → Returns JWT → We store in localStorage
 *    → Set user state in context → Navigate to /admin dashboard.
 *    On error, we show inline error with shake animation."
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password.';
      setError(msg);
      // Trigger shake animation
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* ── Animated Background ── */}
      {/* Gradient orbs create a premium, living background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-chart-4/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4 fade-in-up">
        {/* ── Login Card ── */}
        <div className={`bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl ${shakeError ? 'animate-shake' : ''}`}>
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
              <HeartPulse className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to Satya Sai Medico Admin
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center fade-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="login-username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="pl-10 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-11"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer hint */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground text-xs">
              Default credentials: <code className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">admin</code> / <code className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">admin123</code>
            </p>
          </div>
        </div>

        {/* Subtle branding */}
        <p className="text-center text-muted-foreground/50 text-xs mt-6">
          Satya Sai Medico · Hospital Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
