import { useState, useEffect } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { Briefcase, Clock, CheckCircle2, MessageSquare, ExternalLink, Shield } from 'lucide-react';
import { apiClient } from '../services/api';
import { Job } from '../data/mockData';

export function MyJobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await apiClient.get<Job[]>('/jobs');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Filter jobs into tabs
  // For demo purposes, we will categorize some jobs as applied, some active, and some completed.
  const appliedJobs = jobs.filter(j => j.status === 'open');
  // If there are no in_progress or completed in the DB, we can display mock/fallback ones or use whatever exists
  const activeJobs = jobs.filter(j => j.status === 'in_progress');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  // Fallbacks for empty states (adds great UX for demo)
  const demoActiveJobs = activeJobs.length > 0 ? activeJobs : [
    {
      id: 'active-1',
      title: 'Emergency Pipe Leak Repair',
      category: 'Plumbing',
      budget: 150,
      budgetType: 'fixed',
      location: 'Brooklyn, NY',
      postedBy: 'Jane Smith (Acme Home Services)',
      postedDate: '2026-07-12',
      status: 'in_progress',
      applicants: 1,
      requiredSkills: ['Plumbing', 'Emergency Repairs'],
      urgency: 'high'
    }
  ];

  const demoCompletedJobs = completedJobs.length > 0 ? completedJobs : [
    {
      id: 'completed-1',
      title: 'Kitchen Sink Drainage Installation',
      category: 'Plumbing',
      budget: 350,
      budgetType: 'fixed',
      location: 'Brooklyn, NY',
      postedBy: 'John Smith',
      postedDate: '2026-06-25',
      status: 'completed',
      applicants: 4,
      requiredSkills: ['Plumbing', 'Sink Installation'],
      urgency: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType="worker" />
      <div className="flex">
        <DashboardSidebar
          userType="worker"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Jobs</h1>
            <p className="text-muted-foreground">Track your applications, active contracts, and completed projects</p>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-3 mb-6">
              <TabsTrigger value="applied" className="relative">
                Applied
                {appliedJobs.length > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs bg-muted">
                    {appliedJobs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {/* APPLIED JOBS */}
            <TabsContent value="applied" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading applied jobs...</div>
              ) : appliedJobs.length === 0 ? (
                <Card className="text-center p-12">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No active applications</CardTitle>
                  <CardDescription className="mb-6">You haven't submitted any job applications yet.</CardDescription>
                  <Button asChild>
                    <Link to="/jobs">Find Jobs</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {appliedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2">{job.category}</Badge>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="mt-1">Client: {job.postedBy}</CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none">
                            Pending Review
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm mb-4">
                          <span className="font-semibold">${job.budget} {job.budgetType === 'hourly' ? '/hr' : 'fixed'}</span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Applied {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link to={`/job/${job.id}`}>
                              <ExternalLink className="w-4 h-4 mr-2" /> View Details
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                            Withdraw
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ACTIVE JOBS */}
            <TabsContent value="active" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {demoActiveJobs.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{job.category}</Badge>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription className="mt-1">Client: {job.postedBy}</CardDescription>
                        </div>
                        <Badge className="bg-blue-600 text-white border-none animate-pulse">
                          In Progress
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="font-semibold text-primary">${job.budget} {job.budgetType === 'hourly' ? '/hr' : 'fixed'}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Shield className="w-4 h-4 text-green-600" /> Milestone Protected
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm" asChild>
                          <Link to="/messages">
                            <MessageSquare className="w-4 h-4 mr-2" /> Message Client
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Submit for Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* COMPLETED JOBS */}
            <TabsContent value="completed" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {demoCompletedJobs.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-green-600 opacity-90 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{job.category}</Badge>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription className="mt-1">Client: {job.postedBy}</CardDescription>
                        </div>
                        <Badge className="bg-green-600 text-white border-none">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="font-semibold">${job.budget} {job.budgetType === 'hourly' ? '/hr' : 'fixed'}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" /> Paid out
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to="/reviews">View Client Feedback</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
