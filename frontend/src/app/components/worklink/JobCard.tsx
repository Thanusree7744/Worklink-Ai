import { MapPin, DollarSign, Clock, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AIMatchBadge } from './AIMatchBadge';
import { Job } from '../../data/mockData';
import { Link } from 'react-router';

interface JobCardProps {
  job: Job;
  showMatchScore?: boolean;
}

export function JobCard({ job, showMatchScore = false }: JobCardProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{job.category}</Badge>
              <Badge className={getUrgencyColor()}>{job.urgency} priority</Badge>
              <div className={`w-2 h-2 ${getStatusColor()} rounded-full`} />
              <span className="text-sm text-muted-foreground capitalize">{job.status.replace('_', ' ')}</span>
            </div>
          </div>
          {showMatchScore && job.matchScore && (
            <AIMatchBadge score={job.matchScore} size="sm" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              ${job.budget} {job.budgetType === 'hourly' ? '/hr' : 'fixed'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Posted {formatDate(job.postedDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{job.applicants} applicants</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to={`/job/${job.id}`}>View Details</Link>
          </Button>
          {job.status === 'open' && (
            <Button variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
