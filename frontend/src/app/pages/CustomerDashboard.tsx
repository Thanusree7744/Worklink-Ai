import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { WorkerCard } from '../components/worklink/WorkerCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  PlusCircle,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Search,
} from 'lucide-react';
import { mockWorkers, mockJobs, customerDashboardStats } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';

const applicationsData = [
  { week: 'Week 1', applications: 12 },
  { week: 'Week 2', applications: 19 },
  { week: 'Week 3', applications: 15 },
  { week: 'Week 4', applications: 24 },
];

export function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const myJobs = mockJobs.slice(0, 3);
  const recommendedWorkers = mockWorkers.filter((worker) => worker.matchScore && worker.matchScore >= 90).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType="customer" />
      <div className="flex">
        <DashboardSidebar
          userType="customer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-muted-foreground">Manage your jobs and find the perfect workers.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Jobs
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerDashboardStats.activeJobs}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {customerDashboardStats.completedJobs} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerDashboardStats.applications}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+8</span> new today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground mt-1">Above average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerDashboardStats.rating}</div>
                <p className="text-xs text-muted-foreground mt-1">From workers</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Applications Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Applications This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#2563EB" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/post-job">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Post a New Job
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/find-workers">
                    <Search className="w-4 h-4 mr-2" />
                    Find Workers
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/ai-recommendations">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    AI Recommendations
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Workers */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  AI Recommended Workers
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Perfect matches for your active jobs
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
              <div className="space-y-4">
                {recommendedWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} showMatchScore />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Active Jobs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{job.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-muted-foreground">{job.applicants} applicants</span>
                        <span className="text-muted-foreground">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/job/${job.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/my-postings">View All Jobs</Link>
              </Button>
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
                    <p className="font-medium">New Application</p>
                    <p className="text-sm text-muted-foreground">
                      Sarah Johnson applied to "Kitchen Sink Installation" - 1 hour ago
                    </p>
                  </div>
                  <Badge>New</Badge>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Job Posted</p>
                    <p className="text-sm text-muted-foreground">
                      "AC Unit Not Cooling" was posted successfully - 3 hours ago
                    </p>
                  </div>
                  <Badge variant="secondary">Posted</Badge>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Worker Hired</p>
                    <p className="text-sm text-muted-foreground">
                      You hired Michael Chen for "Electrical Panel Upgrade" - 1 day ago
                    </p>
                  </div>
                  <Badge variant="outline">Hired</Badge>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Job Completed</p>
                    <p className="text-sm text-muted-foreground">
                      "Interior House Painting" was marked as complete - 2 days ago
                    </p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
