import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { WorkerCard } from '../components/worklink/WorkerCard';
import { JobCard } from '../components/worklink/JobCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import {
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  MapPin,
  Star,
  Clock,
  Brain,
  RefreshCw,
  Info,
} from 'lucide-react';
import { mockWorkers, mockJobs } from '../data/mockData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const matchFactors = [
  { factor: 'Skills', fullMark: 100, score: 95 },
  { factor: 'Location', fullMark: 100, score: 88 },
  { factor: 'Availability', fullMark: 100, score: 92 },
  { factor: 'Rating', fullMark: 100, score: 98 },
  { factor: 'Experience', fullMark: 100, score: 85 },
  { factor: 'Price Fit', fullMark: 100, score: 90 },
];

const signalWeights = [
  { label: 'Skill alignment', weight: 35, icon: Brain, color: 'text-primary' },
  { label: 'Location proximity', weight: 20, icon: MapPin, color: 'text-secondary' },
  { label: 'Rating & reviews', weight: 20, icon: Star, color: 'text-yellow-500' },
  { label: 'Availability match', weight: 15, icon: Clock, color: 'text-accent' },
  { label: 'Price compatibility', weight: 10, icon: TrendingUp, color: 'text-muted-foreground' },
];

export function AIRecommendationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userType] = useState<'worker' | 'customer'>('worker');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const recommendedJobs = mockJobs.filter((job) => job.matchScore && job.matchScore >= 85);
  const recommendedWorkers = mockWorkers.filter((w) => w.matchScore && w.matchScore >= 85);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType={userType} />
      <div className="flex">
        <DashboardSidebar
          userType={userType}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">AI Recommendations</h1>
              </div>
              <p className="text-muted-foreground text-sm ml-[52px]">
                Personalized matches updated every 2 hours · Last run 34 minutes ago
              </p>
            </div>
            <Button variant="outline" className="gap-2 self-start sm:self-auto" onClick={handleRefresh}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* KPI row */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: Target,
                color: 'bg-primary/10 text-primary',
                value: '95%',
                label: 'Avg. Match Score',
                sub: '+3% vs last week',
                subColor: 'text-green-600',
              },
              {
                icon: Zap,
                color: 'bg-secondary/10 text-secondary',
                value: userType === 'worker' ? recommendedJobs.length : recommendedWorkers.length,
                label: 'New Recommendations',
                sub: 'Across all categories',
                subColor: 'text-muted-foreground',
              },
              {
                icon: TrendingUp,
                color: 'bg-accent/10 text-accent',
                value: '87%',
                label: 'Hire Success Rate',
                sub: 'When using AI matches',
                subColor: 'text-muted-foreground',
              },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <Card key={k.label}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{k.value}</div>
                      <div className="text-sm text-muted-foreground">{k.label}</div>
                      <div className={`text-xs mt-0.5 ${k.subColor}`}>{k.sub}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* How the AI works */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Your Match Profile
                </CardTitle>
                <CardDescription>How well your profile fits the current job pool</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={matchFactors}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <Radar
                      name="Match"
                      dataKey="score"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Signal weights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  How the Score is Calculated
                </CardTitle>
                <CardDescription>Weight of each factor in the AI match algorithm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {signalWeights.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${s.color}`} />
                          <span className="text-sm">{s.label}</span>
                        </div>
                        <span className="text-sm font-semibold">{s.weight}%</span>
                      </div>
                      <Progress value={s.weight} className="h-1.5" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Tabs defaultValue={userType === 'worker' ? 'jobs' : 'workers'}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                {userType === 'worker' ? (
                  <>
                    <TabsTrigger value="jobs">Recommended Jobs</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="workers">Recommended Workers</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                  </>
                )}
              </TabsList>
              <Badge variant="outline" className="text-xs">Updated 34 min ago</Badge>
            </div>

            {userType === 'worker' ? (
              <>
                <TabsContent value="jobs" className="space-y-0">
                  <p className="text-sm text-muted-foreground mb-5">
                    Showing <strong>{recommendedJobs.length}</strong> high-confidence matches (≥85% score)
                  </p>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {recommendedJobs.map((job) => (
                      <JobCard key={job.id} job={job} showMatchScore />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="saved">
                  <Card>
                    <CardContent className="p-16 text-center text-muted-foreground">
                      <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No saved jobs yet. Save jobs from recommendations to revisit them here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="workers">
                  <p className="text-sm text-muted-foreground mb-5">
                    Showing <strong>{recommendedWorkers.length}</strong> top-matched workers for your active jobs
                  </p>
                  <div className="space-y-4">
                    {recommendedWorkers.map((worker) => (
                      <WorkerCard key={worker.id} worker={worker} showMatchScore />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="saved">
                  <Card>
                    <CardContent className="p-16 text-center text-muted-foreground">
                      <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No saved workers yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
}
