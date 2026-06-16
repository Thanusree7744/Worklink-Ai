import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { JobCard } from '../components/worklink/JobCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
} from 'lucide-react';
import { mockJobs, workerDashboardStats } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';

const earningsData = [
  { month: 'Jan', earnings: 3200 },
  { month: 'Feb', earnings: 4100 },
  { month: 'Mar', earnings: 3800 },
  { month: 'Apr', earnings: 5200 },
  { month: 'May', earnings: 4600 },
  { month: 'Jun', earnings: 6100 },
];

export function WorkerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const recommendedJobs = mockJobs.filter((job) => job.matchScore && job.matchScore >= 90).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType="worker" />
      <div className="flex">
        <DashboardSidebar
          userType="worker"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
            <p className="text-muted-foreground">Here's what's happening with your work today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${workerDashboardStats.earnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Jobs
                </CardTitle>
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workerDashboardStats.activeJobs}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {workerDashboardStats.completedJobs} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rating
                </CardTitle>
                <Star className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {workerDashboardStats.rating}
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">From 127 reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Profile Views
                </CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workerDashboardStats.profileViews}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+24%</span> this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Earnings Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#2563EB"
                      fillOpacity={1}
                      fill="url(#colorEarnings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start gap-2" variant="outline" asChild>
                    <Link to="/find-workers">
                      <Search className="w-4 h-4" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline" asChild>
                    <Link to="/ai-recommendations">
                      <TrendingUp className="w-4 h-4" />
                      AI Recommendations
                    </Link>
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Clock className="w-4 h-4" />
                    Update Availability
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Availability status */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-800">Available for Work</span>
                  </div>
                  <p className="text-xs text-green-700 mb-3">You're currently showing as available. Workers who are available get 3x more views.</p>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-800 hover:bg-green-100 w-full">
                    Update Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended Jobs */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  AI Recommended Jobs
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Jobs that match your skills and preferences
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/ai-recommendations">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-4">
                {recommendedJobs.map((job) => (
                  <JobCard key={job.id} job={job} showMatchScore />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Job Application Sent</p>
                    <p className="text-sm text-muted-foreground">
                      You applied for "Kitchen Sink Installation" - 2 hours ago
                    </p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">New Message</p>
                    <p className="text-sm text-muted-foreground">
                      John Smith sent you a message - 5 hours ago
                    </p>
                  </div>
                  <Badge>New</Badge>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Job Completed</p>
                    <p className="text-sm text-muted-foreground">
                      "Bathroom Renovation" marked as complete - 1 day ago
                    </p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">New Review</p>
                    <p className="text-sm text-muted-foreground">
                      You received a 5-star review from Amanda Johnson - 2 days ago
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
