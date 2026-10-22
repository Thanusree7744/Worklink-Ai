import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Sparkles, HardHat, Users, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('securepassword123');
  const [selectedRole, setSelectedRole] = useState<'worker' | 'customer' | 'admin'>('customer');
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname as string | undefined;

  const handleRoleSelect = (role: 'worker' | 'customer' | 'admin') => {
    setSelectedRole(role);
    if (role === 'worker') {
      setEmail('worker@example.com');
      setPassword('securepassword123');
    } else if (role === 'customer') {
      setEmail('customer@example.com');
      setPassword('securepassword123');
    } else if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('securepassword123');
    }
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password, selectedRole);
      const dest = fromPath ?? `/${user.role}-dashboard`;
      navigate(dest);
    } catch {
      // error is managed in AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle(selectedRole);
      if (user) {
        const dest = fromPath ?? `/${user.role}-dashboard`;
        navigate(dest);
      }
    } catch {
      // error is managed in AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — decorative */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary p-12">
        <img
          src="https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?w=900&h=1200&fit=crop&auto=format"
          alt="Professional worker"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">WorkLink AI</span>
          </Link>
        </div>

        <div className="relative z-10">
          <blockquote className="mb-8">
            <p className="text-white/90 text-xl leading-relaxed mb-4">
              "WorkLink AI matched me with steady clients in my first week. The AI matching makes finding jobs effortless."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format"
                alt="Sarah Johnson"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
              <div>
                <p className="text-white font-medium">Sarah Johnson</p>
                <p className="text-white/70 text-sm">Professional Plumber · Brooklyn, NY</p>
              </div>
            </div>
          </blockquote>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-white/70 text-xs mt-0.5">Match Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">&lt; 1 hr</p>
              <p className="text-white/70 text-xs mt-0.5">Avg. Response Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9 ★</p>
              <p className="text-white/70 text-xs mt-0.5">Platform Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 max-w-md mx-auto w-full">
        {/* Mobile brand header */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">WorkLink AI</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your WorkLink AI account</p>

          {/* Role selector buttons */}
          <div className="mb-6">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Select Demo Role Preset:
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('worker')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedRole === 'worker'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card hover:bg-muted text-foreground border-border'
                }`}
              >
                <HardHat className="w-4 h-4" /> Worker
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('customer')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedRole === 'customer'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card hover:bg-muted text-foreground border-border'
                }`}
              >
                <Users className="w-4 h-4" /> Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card hover:bg-muted text-foreground border-border'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>

          {/* Quick 1-Click Google Sign-In */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 border-2 border-primary/20 hover:border-primary/50 hover:bg-muted/70 font-semibold text-base shadow-sm transition-all rounded-xl"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                    {selectedRole}
                  </span>
                </>
              )}
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">Or sign in with email / demo</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <span className="text-xs text-muted-foreground">Demo: securepassword123</span>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember-me" defaultChecked />
              <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full gap-2 mt-2" size="lg" disabled={isLoading || isGoogleLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...
                </>
              ) : (
                <>
                  Sign in with Email as <span className="capitalize">{selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/worker-signup" className="text-primary font-medium hover:underline">
              Sign up as Worker
            </Link>
            {' or '}
            <Link to="/customer-signup" className="text-primary font-medium hover:underline">
              Customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
