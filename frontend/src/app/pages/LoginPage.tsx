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
  const { login, isLoading, error, clearError } = useAuth();
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

            <Button type="submit" className="w-full gap-2 mt-2" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...
                </>
              ) : (
                <>
                  Sign in as <span className="capitalize">{selectedRole}</span>
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
