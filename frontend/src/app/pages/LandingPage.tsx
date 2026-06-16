import { Link } from 'react-router';
import { Navbar } from '../components/worklink/Navbar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Sparkles,
  MapPin,
  Shield,
  Zap,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

const testimonials = [
  {
    name: 'Amanda Torres',
    role: 'Homeowner',
    text: 'Found an expert plumber within 20 minutes. The AI match was spot-on — 97% score and he was just 1.2 miles away.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format',
  },
  {
    name: 'James Rowe',
    role: 'Electrical Contractor',
    text: "WorkLink AI tripled my monthly jobs. The platform's smart matching sends me only the jobs that fit my expertise.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format',
  },
  {
    name: 'Maria Nguyen',
    role: 'Property Manager',
    text: 'Managing 30+ units is effortless now. I post a job and have verified, rated workers applying within the hour.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&auto=format',
  },
];

const workerAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=48&h=48&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&auto=format',
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5 pointer-events-none" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Matching Platform</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
                The Smartest Way to Hire<br />
                <span className="text-primary">Skilled Workers</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                WorkLink AI connects you with verified, skilled professionals using real-time AI matching based on expertise, location, availability, and ratings. Find your perfect match in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button size="lg" asChild className="h-12 px-8">
                  <Link to="/worker-signup">
                    Join as Worker
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8">
                  <Link to="/customer-signup">
                    Post a Job
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {workerAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Worker"
                      className="w-9 h-9 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm font-semibold ml-1">4.9</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by 50,000+ workers & clients</p>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&h=520&fit=crop&auto=format"
                  alt="Electrician installing wiring professionally"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>

              {/* Floating AI match card */}
              <div className="absolute -left-8 top-1/3 bg-card rounded-xl shadow-xl p-4 border border-border max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">AI Match</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">98%</div>
                <p className="text-xs text-muted-foreground">Sarah Johnson · 0.8 mi</p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-600 font-medium">Available now</span>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -right-6 bottom-16 bg-card rounded-xl shadow-xl p-4 border border-border">
                <div className="text-2xl font-bold text-foreground">2 min</div>
                <p className="text-xs text-muted-foreground">Avg. response time</p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Workers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">100K+</div>
              <div className="text-sm text-muted-foreground mt-1">Jobs Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">4.9★</div>
              <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mb-14">
            <Badge variant="secondary" className="mb-4">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Built for speed, trust, and precision
            </h2>
            <p className="text-muted-foreground text-lg">
              Every feature is designed to reduce friction between finding work and getting it done.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                color: 'text-primary bg-primary/10',
                title: 'AI Match Score',
                desc: 'Algorithms analyze 40+ signals — skills, experience, history, location — to surface your best matches first.',
              },
              {
                icon: MapPin,
                color: 'text-secondary bg-secondary/10',
                title: 'Location-Based',
                desc: 'Real-time distance calculation pinpoints workers within minutes of the job site, reducing travel time.',
              },
              {
                icon: Shield,
                color: 'text-accent bg-accent/10',
                title: 'Verified Workers',
                desc: 'Every professional passes background checks, license validation, and insurance verification.',
              },
              {
                icon: Zap,
                color: 'text-primary bg-primary/10',
                title: 'Instant Matching',
                desc: 'Post a job and get matched with qualified workers in under 60 seconds — not days.',
              },
              {
                icon: Star,
                color: 'text-secondary bg-secondary/10',
                title: 'Transparent Ratings',
                desc: 'Verified review system with detailed breakdowns across punctuality, quality, and communication.',
              },
              {
                icon: Clock,
                color: 'text-accent bg-accent/10',
                title: 'Live Availability',
                desc: 'Real-time status updates and calendar integration show who can actually start today.',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-xl border border-border bg-background hover:shadow-md transition-shadow duration-200">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              From posting to hired in minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-border" />

            {[
              { n: '01', title: 'Create Your Profile', desc: 'Sign up in 2 minutes. Add your skills, location, portfolio, and set your availability.' },
              { n: '02', title: 'Get AI Recommendations', desc: 'Our AI scans thousands of matches and surfaces the best-fit opportunities immediately.' },
              { n: '03', title: 'Connect & Get Paid', desc: 'Chat, agree terms, complete the work, and get paid securely through the platform.' },
            ].map((step) => (
              <div key={step.n} className="text-center relative">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 font-bold text-lg">
                  {step.n}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Trusted by professionals across 200+ cities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-5 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two CTA tracks */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-primary p-10 text-primary-foreground">
              <Users className="w-10 h-10 mb-5 opacity-90" />
              <h3 className="text-2xl font-bold mb-3">Looking for work?</h3>
              <p className="text-primary-foreground/80 mb-6 text-sm leading-relaxed">
                Join 50,000+ skilled workers earning more with AI-matched job opportunities near them.
              </p>
              <div className="space-y-2 mb-7">
                {['Free to sign up', 'Set your own rates', 'Work when you want'].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/worker-signup">Join as Worker <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="rounded-2xl bg-foreground p-10 text-background">
              <TrendingUp className="w-10 h-10 mb-5 opacity-90" />
              <h3 className="text-2xl font-bold mb-3">Need skilled workers?</h3>
              <p className="text-background/70 mb-6 text-sm leading-relaxed">
                Post a job in 60 seconds and get matched with verified local workers — with AI doing the vetting for you.
              </p>
              <div className="space-y-2 mb-7">
                {['Post jobs for free', 'AI-verified workers only', 'Pay only when satisfied'].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/customer-signup">Post a Job <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">W</span>
                </div>
                <span className="font-bold text-lg">WorkLink AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered platform connecting skilled workers with customers across 200+ cities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">For Workers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/worker-signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link to="/worker-dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">For Customers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/customer-signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link to="/post-job" className="hover:text-foreground transition-colors">Post a Job</Link></li>
                <li><Link to="/find-workers" className="hover:text-foreground transition-colors">Browse Workers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><Link to="/admin-dashboard" className="hover:text-foreground transition-colors">Admin</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 WorkLink AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
