import { MapPin, Star, Clock, CheckCircle2, DollarSign, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AIMatchBadge } from './AIMatchBadge';
import { Worker } from '../../data/mockData';
import { Link } from 'react-router';

interface WorkerCardProps {
  worker: Worker;
  showMatchScore?: boolean;
}

export function WorkerCard({ worker, showMatchScore = false }: WorkerCardProps) {
  const getAvailabilityColor = () => {
    if (worker.availability === 'available') return 'bg-green-500';
    if (worker.availability === 'busy') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getSkillLevelColor = () => {
    if (worker.skillLevel === 'expert') return 'bg-purple-100 text-purple-800';
    if (worker.skillLevel === 'intermediate') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={worker.profileImage}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 ${getAvailabilityColor()} border-2 border-white rounded-full`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{worker.name}</h3>
                  {worker.verified && (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{worker.title}</p>
              </div>
              {showMatchScore && worker.matchScore && (
                <AIMatchBadge score={worker.matchScore} size="sm" />
              )}
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{worker.rating}</span>
                <span>({worker.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{worker.distance} mi away</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {worker.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              <Badge className={`text-xs ${getSkillLevelColor()}`}>
                {worker.skillLevel}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-foreground">${worker.hourlyRate}/hr</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{worker.completedJobs} jobs</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{worker.responseTime}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to={`/worker/${worker.id}`}>View Profile</Link>
              </Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
