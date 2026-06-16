import { useParams } from 'react-router';
import { Navbar } from '../components/worklink/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { WorkerCard } from '../components/worklink/WorkerCard';
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { mockJobs, mockWorkers } from '../data/mockData';
import { AIMatchBadge } from '../components/worklink/AIMatchBadge';

export function JobDetailsPage() {
  const { id } = useParams();
  const job = mockJobs.find((j) => j.id === id) || mockJobs[0];
  const recommendedWorkers = mockWorkers.slice(0, 3);

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
      <Navbar userType="worker" />
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
                      <p className="font-semibold">{new Date(job.postedDate).toLocaleDateString()}</p>
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
                  <p className="text-muted-foreground">{job.description}</p>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Posted By */}
                <div>
                  <h3 className="font-semibold mb-3">Posted By</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{job.postedBy[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{job.postedBy}</p>
                      <p className="text-sm text-muted-foreground">Member since 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommended Workers */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                {job.status === 'open' && (
                  <>
                    <Button className="w-full" size="lg">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Apply for This Job
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save Job
                    </Button>
                  </>
                )}
                {job.status === 'in_progress' && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Job In Progress</p>
                    <p className="text-sm text-blue-700 mt-1">This job is currently being worked on</p>
                  </div>
                )}
                {job.status === 'completed' && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Job Completed</p>
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
                    <p className="font-medium">High Competition</p>
                    <p className="text-sm text-muted-foreground">
                      {job.applicants} workers have applied
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Good Match</p>
                    <p className="text-sm text-muted-foreground">
                      Your skills align well with this job
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Close Location</p>
                    <p className="text-sm text-muted-foreground">
                      Job is in your service area
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Always meet in a public place first</p>
                <p>• Get clear job requirements in writing</p>
                <p>• Use WorkLink's messaging system</p>
                <p>• Report suspicious activity</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
