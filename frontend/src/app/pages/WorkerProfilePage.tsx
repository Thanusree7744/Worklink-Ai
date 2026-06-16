import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Navbar } from '../components/worklink/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import {
  Star,
  MapPin,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Clock,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Share2,
  Heart,
  Shield,
  Award,
  TrendingUp,
  ThumbsUp,
} from 'lucide-react';
import { mockWorkers } from '../data/mockData';
import { AIMatchBadge } from '../components/worklink/AIMatchBadge';

const portfolioImages = [
  {
    url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&auto=format',
    caption: 'Bathroom renovation — complete remodel',
  },
  {
    url: 'https://images.unsplash.com/photo-1661107259637-4e1c55462428?w=400&h=300&fit=crop&auto=format',
    caption: 'Luxury master bath — full plumbing install',
  },
  {
    url: 'https://images.unsplash.com/photo-1587527901949-ab0341697c1e?w=400&h=300&fit=crop&auto=format',
    caption: 'Commercial restroom upgrade',
  },
  {
    url: 'https://images.unsplash.com/photo-1586798271654-0471bb1b0517?w=400&h=300&fit=crop&auto=format',
    caption: 'Freestanding tub installation',
  },
  {
    url: 'https://images.unsplash.com/photo-1631048499052-e6d9f305d2c0?w=400&h=300&fit=crop&auto=format',
    caption: 'Sink & faucet replacement',
  },
  {
    url: 'https://images.unsplash.com/photo-1696987007764-7f8b85dd3033?w=400&h=300&fit=crop&auto=format',
    caption: 'Full bathroom suite — new build',
  },
];

const reviews = [
  {
    name: 'Amanda Torres',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=48&h=48&fit=crop&auto=format',
    date: '2 weeks ago',
    rating: 5,
    job: 'Kitchen sink replacement',
    text: 'Absolutely excellent work. Arrived on time, diagnosed the issue immediately, and completed everything in under 2 hours. The kitchen looks brand new. 10/10 would hire again.',
  },
  {
    name: 'Robert Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format',
    date: '1 month ago',
    rating: 5,
    job: 'Bathroom renovation',
    text: 'Sarah handled a complex bathroom remodel beautifully. She caught issues that two previous contractors missed, and her attention to detail saved us thousands. Highly professional.',
  },
  {
    name: 'Lisa Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format',
    date: '2 months ago',
    rating: 5,
    job: 'Emergency pipe repair',
    text: 'Called at 10pm for a burst pipe. Sarah responded within 30 minutes and had the situation under control in an hour. Lifesaver!',
  },
  {
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&auto=format',
    date: '3 months ago',
    rating: 4,
    job: 'Water heater installation',
    text: 'Great work overall. New water heater installed cleanly with no mess left behind. Only minor issue was scheduling took a day longer than expected — but the quality made up for it.',
  },
];

const ratingBreakdown = [
  { label: 'Quality of Work', score: 4.9 },
  { label: 'Punctuality', score: 4.8 },
  { label: 'Communication', score: 4.9 },
  { label: 'Value for Money', score: 4.7 },
];

export function WorkerProfilePage() {
  const { id } = useParams();
  const worker = mockWorkers.find((w) => w.id === id) || mockWorkers[0];
  const [saved, setSaved] = useState(false);

  const availColor =
    worker.availability === 'available'
      ? 'bg-green-500'
      : worker.availability === 'busy'
      ? 'bg-yellow-500'
      : 'bg-gray-400';
  const availLabel =
    worker.availability === 'available'
      ? 'Available Now'
      : worker.availability === 'busy'
      ? 'Busy'
      : 'Offline';
  const availTextColor =
    worker.availability === 'available'
      ? 'text-green-600'
      : worker.availability === 'busy'
      ? 'text-yellow-600'
      : 'text-muted-foreground';

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="customer" />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back link */}
        <Link
          to="/find-workers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search
        </Link>

        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Cover strip */}
          <div className="h-24 bg-gradient-to-r from-primary via-secondary to-accent" />
          <CardContent className="px-8 pb-8 -mt-12">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                  <AvatarImage src={worker.profileImage} alt={worker.name} />
                  <AvatarFallback>{worker.name[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-1 right-1 w-5 h-5 ${availColor} border-2 border-card rounded-full`}
                />
              </div>

              <div className="flex-1 pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{worker.name}</h1>
                      {worker.verified && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className={`gap-1 ${availTextColor} border-current`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${availColor}`} />
                        {availLabel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{worker.title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-foreground">{worker.rating}</span>
                        <span>({worker.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {worker.location} · {worker.distance} mi away
                      </div>
                    </div>
                  </div>
                  {worker.matchScore && <AIMatchBadge score={worker.matchScore} size="lg" />}
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-xl mb-5">
                  {[
                    { icon: DollarSign, label: 'Hourly Rate', value: `$${worker.hourlyRate}/hr` },
                    { icon: Briefcase, label: 'Jobs Done', value: worker.completedJobs.toString() },
                    { icon: Clock, label: 'Response', value: worker.responseTime },
                    { icon: Calendar, label: 'Experience', value: `${worker.experience} yrs` },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="text-center">
                        <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                        <div className="font-semibold text-sm">{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Briefcase className="w-4 h-4" /> Hire Now
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setSaved(!saved)}
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({worker.reviewCount})</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{worker.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {worker.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium capitalize">{worker.skillLevel} level</span>
                      <Badge
                        className={
                          worker.skillLevel === 'expert'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : worker.skillLevel === 'intermediate'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {worker.skillLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Rating breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Rating Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ratingBreakdown.map((r) => (
                      <div key={r.label} className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-36 shrink-0">{r.label}</span>
                        <Progress value={r.score * 20} className="flex-1 h-2" />
                        <span className="text-sm font-semibold w-8 text-right">{r.score}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Credentials */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Verified Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'State Licensed Plumber', sub: 'Valid until Dec 2027' },
                      { label: 'Background Check', sub: 'Completed March 2026' },
                      { label: '$1M Liability Insurance', sub: 'Active coverage' },
                      { label: 'Identity Verified', sub: 'Government ID confirmed' },
                    ].map((c) => (
                      <div key={c.label} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{c.label}</p>
                          <p className="text-xs text-muted-foreground">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'Repeat Hire Rate', value: '78%' },
                      { label: 'On-Time Arrival', value: '96%' },
                      { label: 'Job Completion', value: '99%' },
                      { label: 'Response Rate', value: '100%' },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                        <span className="text-sm font-semibold text-primary">{s.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── Reviews ── */}
          <TabsContent value="reviews">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Summary */}
              <Card className="h-fit">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-foreground mb-1">{worker.rating}</div>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">{worker.reviewCount} reviews</p>
                  <div className="space-y-2">
                    {[
                      { stars: 5, pct: 87 },
                      { stars: 4, pct: 10 },
                      { stars: 3, pct: 3 },
                      { stars: 2, pct: 0 },
                      { stars: 1, pct: 0 },
                    ].map((r) => (
                      <div key={r.stars} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-right text-muted-foreground">{r.stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                        <Progress value={r.pct} className="flex-1 h-1.5" />
                        <span className="w-8 text-muted-foreground">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review list */}
              <div className="md:col-span-2 space-y-4">
                {reviews.map((r) => (
                  <Card key={r.name}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.avatar}
                            alt={r.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.date} · {r.job}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors">
                        <ThumbsUp className="w-3 h-3" /> Helpful
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Portfolio ── */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolioImages.map((img, i) => (
                    <div key={i} className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-muted">
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-200 flex items-end">
                        <p className="text-primary-foreground text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {img.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
