import { useState, useEffect } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { Briefcase, Clock, CheckCircle2, MessageSquare, ExternalLink, Loader2, MapPin, DollarSign } from 'lucide-react';
import { apiClient } from '../services/api';

export function MyJobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMyApplications = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get<any[]>('/jobs/user/my-applications');
        setApplications(data);
      } catch (err) {
        console.error('Failed to fetch worker applications', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMyApplications();
  }, []);

  const appliedList = applications.filter((a) => a.status === 'pending' || a.status === 'rejected');
  const activeList = applications.filter((a) => a.status === 'accepted');

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
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Jobs & Applications</h1>
              <p className="text-muted-foreground">Track your proposals, active contracts, and work history</p>
            </div>
            <Button asChild>
              <Link to="/jobs">Find New Jobs</Link>
            </Button>
          </div>

          <Tabs defaultValue="applied" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
              <TabsTrigger value="applied" className="relative">
                Applications ({appliedList.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active Contracts ({activeList.length})
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                Loading your applications...
              </div>
            ) : (
              <>
                {/* Applied Tab */}
                <TabsContent value="applied" className="space-y-4">
                  {appliedList.length === 0 ? (
                    <Card className="text-center p-12">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <CardTitle className="mb-2">No active applications</CardTitle>
                      <CardDescription className="mb-6">
                        You haven't submitted any job proposals yet. Browse available jobs to find opportunities.
                      </CardDescription>
                      <Button asChild>
                        <Link to="/jobs">Explore Open Jobs</Link>
                      </Button>
                    </Card>
                  ) : (
                    appliedList.map((app) => (
                      <Card key={app.id} className="hover:shadow-sm transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{app.job?.category || 'Service'}</Badge>
                                <Badge
                                  className={
                                    app.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {app.status}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold">{app.job?.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Posted by {app.job?.postedBy} • {app.job?.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Your Proposed Rate</p>
                              <p className="text-xl font-bold text-primary">${app.proposedRate}</p>
                            </div>
                          </div>

                          {app.coverLetter && (
                            <div className="bg-muted/40 p-3 rounded-lg text-sm text-muted-foreground mb-4">
                              <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wider">Your Proposal:</p>
                              <p className="italic">"{app.coverLetter}"</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                            <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/job/${app.jobId}`}>
                                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Job
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Active Contracts Tab */}
                <TabsContent value="active" className="space-y-4">
                  {activeList.length === 0 ? (
                    <Card className="text-center p-12">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <CardTitle className="mb-2">No active contracts right now</CardTitle>
                      <CardDescription className="mb-6">
                        Once a client accepts your proposal, the active project and communication link will appear here.
                      </CardDescription>
                      <Button asChild>
                        <Link to="/jobs">Find More Jobs</Link>
                      </Button>
                    </Card>
                  ) : (
                    activeList.map((app) => (
                      <Card key={app.id} className="border-l-4 border-l-green-500 hover:shadow-sm transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-green-600">Hired / In Progress</Badge>
                                <Badge variant="outline">{app.job?.category}</Badge>
                              </div>
                              <h3 className="text-xl font-bold">{app.job?.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Client: {app.job?.postedBy} • {app.job?.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Agreed Rate</p>
                              <p className="text-xl font-bold text-green-600">${app.proposedRate}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-end pt-3 border-t">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/job/${app.jobId}`}>
                                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Job Details
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link to="/messages">
                                <MessageSquare className="w-3.5 h-3.5 mr-1" /> Open Chat with Client
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
}
