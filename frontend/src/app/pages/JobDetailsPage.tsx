import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Navbar } from '../components/worklink/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { WorkerCard } from '../components/worklink/WorkerCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from 'lucide-react';
import { apiClient } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AIMatchBadge } from '../components/worklink/AIMatchBadge';

export function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [recommendedWorkers, setRecommendedWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [proposedRate, setProposedRate] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [myApplication, setMyApplication] = useState<any>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const [jobData, recsData] = await Promise.all([
          apiClient.get<any>(`/jobs/${id}`),
          apiClient.get<any>(`/recommendations/job/${id}`).catch(() => ({ recommendations: [] }))
        ]);
        setJob(jobData);
        setProposedRate(jobData.budget?.toString() || '');
        setRecommendedWorkers((recsData.recommendations || []).map((r: any) => r.worker));
        
        // If worker is logged in, check if they already applied
        if (user?.role === 'worker') {
          try {
            const checkData = await apiClient.get<any>(`/jobs/${id}/my-application`);
            if (checkData.applied) {
              setHasApplied(true);
              setMyApplication(checkData.application);
            }
          } catch {
            // Ignore check failure
          }
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchJobDetails();
    }
  }, [id, user]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsSubmitting(true);
      const app = await apiClient.post<any>(`/jobs/${id}/apply`, {
        proposed_rate: parseFloat(proposedRate) || job.budget,
        cover_letter: coverLetter,
      });
      setHasApplied(true);
      setMyApplication(app);
      setIsApplyOpen(false);
      // Increment applicant count on UI
      setJob((prev: any) => prev ? { ...prev, applicants: (prev.applicants || 0) + 1 } : prev);
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar userType={user?.role === 'customer' ? 'customer' : 'worker'} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar userType={user?.role === 'customer' ? 'customer' : 'worker'} />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-semibold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-4">{error || 'Could not load details'}</p>
          <Link to="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getUrgencyColor = () => {
    if (job.urgency === 'high') return 'bg-red-100 text-red-800';
    if (job.urgency === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = () => {
    if (job.status === 'open') return 'bg-green-500';
    if (job.status === 'in_progress') return 'bg-blue-500';
    if (job.status === 'completed') return 'bg-gray-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType={user?.role === 'customer' ? 'customer' : 'worker'} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 ${getStatusColor()} rounded-full`} />
                      <span className="text-sm font-medium capitalize">{job.status.replace('_', ' ')}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{job.category}</Badge>
                      <Badge className={getUrgencyColor()}>{job.urgency} priority</Badge>
                      {job.matchScore && <AIMatchBadge score={job.matchScore} size="sm" />}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Info */}
                <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold">
                        ${job.budget} {job.budgetType === 'hourly' ? '/hr' : 'fixed'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <p className="font-semibold">{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applicants</p>
                      <p className="font-semibold">{job.applicants} workers</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills && job.requiredSkills.length > 0 ? (
                      job.requiredSkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No specific skills listed</span>
                    )}
                  </div>
                </div>

                {/* Posted By */}
                <div>
                  <h3 className="font-semibold mb-3">Posted By</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{job.postedBy ? job.postedBy[0] : 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{job.postedBy}</p>
                      <p className="text-sm text-muted-foreground">Verified Client</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommended Workers */}
            {recommendedWorkers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    AI Recommended Workers for This Job
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedWorkers.map((worker) => (
                    <WorkerCard key={worker.id} worker={worker} showMatchScore />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                {hasApplied ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="font-semibold text-green-900">Application Submitted</p>
                    <p className="text-sm text-green-700">
                      Status: <span className="capitalize font-medium">{myApplication?.status || 'Pending'}</span>
                    </p>
                    <Link to="/my-jobs">
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        View in My Jobs
                      </Button>
                    </Link>
                  </div>
                ) : user?.role === 'worker' ? (
                  job.status === 'open' ? (
                    <>
                      <Button className="w-full" size="lg" onClick={() => setIsApplyOpen(true)}>
                        <Send className="w-5 h-5 mr-2" />
                        Apply for This Job
                      </Button>
                      <Link to="/jobs">
                        <Button variant="outline" className="w-full mt-2">
                          Browse More Jobs
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-medium">This job is {job.status.replace('_', ' ')}</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Logged in as {user?.role || 'Guest'}</p>
                    {user?.role === 'customer' ? (
                      <Link to="/my-postings">
                        <Button className="w-full">Manage My Postings</Button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <Button className="w-full">Sign in to Apply</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Applicant Activity</p>
                    <p className="text-sm text-muted-foreground">
                      {job.applicants} {job.applicants === 1 ? 'worker has' : 'workers have'} applied
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Verified Posting</p>
                    <p className="text-sm text-muted-foreground">
                      Client identity and payment method confirmed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleApplySubmit}>
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription>
                Submit your proposed rate and a short note to the client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="proposedRate">Your Proposed Rate ($)</Label>
                <Input
                  id="proposedRate"
                  type="number"
                  placeholder={`Client budget: $${job.budget}`}
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Note / Message to Client</Label>
                <Textarea
                  id="coverLetter"
                  rows={4}
                  placeholder="Explain your relevant experience and availability..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Send Proposal'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
