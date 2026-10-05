import { useState, useEffect } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { MapPin, DollarSign, Calendar, Users, Eye, Edit3, CheckCircle2, UserCheck, XCircle, MessageSquare, Loader2 } from 'lucide-react';
import { apiClient } from '../services/api';
import { Job } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { AIMatchBadge } from '../components/worklink/AIMatchBadge';

export function MyPostingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postings, setPostings] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPostings = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Job[]>('/jobs/user/my-postings').catch(() => apiClient.get<Job[]>('/jobs'));
      setPostings(data);
      if (data.length > 0) {
        setSelectedJobId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load postings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!selectedJobId) return;
      try {
        setLoadingApplicants(true);
        const data = await apiClient.get<any[]>(`/jobs/${selectedJobId}/applications`);
        setApplicants(data);
      } catch (err) {
        console.error('Failed to load applicants', err);
        setApplicants([]);
      } finally {
        setLoadingApplicants(false);
      }
    };
    fetchApplicants();
  }, [selectedJobId]);

  const handleStatusUpdate = async (appId: string, status: 'accepted' | 'rejected') => {
    try {
      setActionLoading(appId);
      await apiClient.patch(`/jobs/applications/${appId}/status`, { status });
      // Update applicant state locally
      setApplicants((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status } : app))
      );
      // If hired, update job status
      if (status === 'accepted') {
        setPostings((prev) =>
          prev.map((j) => (j.id === selectedJobId ? { ...j, status: 'in_progress' } : j))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update application status');
    } finally {
      setActionLoading(null);
    }
  };

  const activeJob = postings.find((p) => p.id === selectedJobId) || postings[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType="customer" />
      <div className="flex">
        <DashboardSidebar
          userType="customer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Postings</h1>
              <p className="text-muted-foreground">Manage your posted requests, view matches, and hire experts</p>
            </div>
            <Button asChild>
              <Link to="/post-job">Post a New Job</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              Loading your postings...
            </div>
          ) : postings.length === 0 ? (
            <Card className="text-center p-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No jobs posted yet</CardTitle>
              <CardDescription className="mb-6">
                You haven't posted any job listings. Post a job to start matching with service workers.
              </CardDescription>
              <Button asChild>
                <Link to="/post-job">Post a Job Now</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Postings list */}
              <div className="space-y-4 lg:col-span-1">
                <h3 className="font-bold text-sm text-muted-foreground mb-2">Your Postings ({postings.length})</h3>
                {postings.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedJobId === job.id
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-card border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground">{job.category}</span>
                      <Badge
                        className={
                          job.status === 'open'
                            ? 'bg-green-500 hover:bg-green-600'
                            : job.status === 'in_progress'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        }
                      >
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1 truncate">{job.title}</h4>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-3">
                      <span>${job.budget}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {job.applicants || 0} candidates
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Posting detail and applicant list */}
              <div className="lg:col-span-2 space-y-6">
                {activeJob && (
                  <>
                    {/* Active Job Summary Card */}
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{activeJob.category}</Badge>
                              <Badge
                                className={
                                  activeJob.urgency === 'high'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                    : activeJob.urgency === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                    : 'bg-green-100 text-green-800 hover:bg-green-100'
                                }
                              >
                                {activeJob.urgency} priority
                              </Badge>
                            </div>
                            <CardTitle className="text-xl mb-1">{activeJob.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1.5 mt-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" /> {activeJob.location}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/job/${activeJob.id}`}>
                                <Eye className="w-4 h-4 mr-1.5" /> Public View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed whitespace-pre-line">
                          {activeJob.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm bg-muted/40 p-3 rounded-lg">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">${activeJob.budget}</span>
                            <span className="text-xs text-muted-foreground capitalize">({activeJob.budgetType})</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" /> Posted{' '}
                            {activeJob.postedDate ? new Date(activeJob.postedDate).toLocaleDateString() : 'Recently'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Applicants list for the active job */}
                    <div>
                      <h3 className="font-bold text-sm text-muted-foreground mb-4">
                        Candidates & Proposals ({applicants.length})
                      </h3>
                      {loadingApplicants ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                          Loading applicants...
                        </div>
                      ) : applicants.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No candidates have applied to this posting yet.</p>
                          <p className="text-xs mt-1">Workers matching your requirements will appear here.</p>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {applicants.map((app) => (
                            <Card
                              key={app.id}
                              className={`transition-all border-l-4 ${
                                app.status === 'accepted'
                                  ? 'border-l-green-500 bg-green-50/20'
                                  : app.status === 'rejected'
                                  ? 'border-l-gray-300 opacity-60'
                                  : 'border-l-primary/70'
                              }`}
                            >
                              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start sm:items-center gap-3">
                                  <Avatar className="w-12 h-12 border">
                                    <AvatarImage src={app.workerAvatar} alt={app.workerName} />
                                    <AvatarFallback>{app.workerName ? app.workerName[0] : 'W'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-semibold text-base text-foreground leading-none">
                                        {app.workerName}
                                      </h4>
                                      <Badge
                                        variant="outline"
                                        className={
                                          app.status === 'accepted'
                                            ? 'bg-green-100 text-green-800'
                                            : app.status === 'rejected'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }
                                      >
                                        {app.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1.5">{app.workerTitle}</p>
                                    {app.coverLetter && (
                                      <p className="text-xs text-muted-foreground mt-2 italic bg-muted/50 p-2 rounded">
                                        "{app.coverLetter}"
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2 text-xs">
                                      <span className="font-semibold text-foreground">
                                        Proposed: ${app.proposedRate}
                                      </span>
                                      <span className="text-muted-foreground">•</span>
                                      <span className="text-muted-foreground">
                                        Applied {new Date(app.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                  <Button size="sm" variant="outline" asChild>
                                    <Link to={`/worker/${app.workerId}`}>
                                      <Eye className="w-4 h-4 mr-1.5" /> Profile
                                    </Link>
                                  </Button>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link to="/messages">
                                      <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                                    </Link>
                                  </Button>
                                  {app.status === 'pending' && (
                                    <div className="flex gap-1.5">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                        disabled={actionLoading === app.id}
                                        onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                      >
                                        <UserCheck className="w-4 h-4 mr-1" /> Hire
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:bg-red-50 flex-1"
                                        disabled={actionLoading === app.id}
                                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                      >
                                        <XCircle className="w-4 h-4 mr-1" /> Decline
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
