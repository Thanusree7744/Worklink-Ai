import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Sparkles, HardHat, Users, ArrowRight, Star } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (userType: 'worker' | 'customer') => {
    navigate(`/${userType}-dashboard`);
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
              "WorkLink AI matched me with 3 steady clients in my first week. The AI actually understands what I'm good at."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format"
                alt="James"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
              <div>
                <p className="text-white font-medium">James Rowe</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-white/70 text-xs ml-1">Electrical Contractor</span>
                </div>
              </div>
            </div>
          </blockquote>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '50K+', label: 'Workers' },
              { value: '100K+', label: 'Jobs Done' },
              { value: '4.9★', label: 'Avg Rating' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-white font-bold text-lg">{s.value}</div>
                <div className="text-white/70 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">W</span>
            </div>
            <span className="font-bold text-lg">WorkLink AI</span>
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your WorkLink AI account</p>

          <Tabs defaultValue="worker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="worker" className="gap-2">
                <HardHat className="w-3.5 h-3.5" /> Worker
              </TabsTrigger>
              <TabsTrigger value="customer" className="gap-2">
                <Users className="w-3.5 h-3.5" /> Customer
              </TabsTrigger>
            </TabsList>

            {(['worker', 'customer'] as const).map((type) => (
              <TabsContent key={type} value={type}>
                <form
                  onSubmit={(e) => { e.preventDefault(); handleLogin(type); }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor={`${type}-email`}>Email</Label>
                    <Input
                      id={`${type}-email`}
                      type="email"
                      placeholder={`${type}@example.com`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${type}-password`}>Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                    </div>
                    <Input
                      id={`${type}-password`}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id={`remember-${type}`} />
                    <label htmlFor={`remember-${type}`} className="text-sm text-muted-foreground">
                      Remember me for 30 days
                    </label>
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    Sign in as {type === 'worker' ? 'Worker' : 'Customer'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="outline" type="button">Google</Button>
            <Button variant="outline" type="button">Apple</Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            No account?{' '}
            <Link to="/worker-signup" className="text-primary hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
