import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Star, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

interface ReviewItem {
  id: string;
  clientName: string;
  companyName?: string;
  projectName: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export function ReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Demo reviews data
  const reviews: ReviewItem[] = [
    {
      id: 'r1',
      clientName: 'Jane Smith',
      companyName: 'Acme Home Services',
      projectName: 'Bathroom Pipe Leak Repair',
      rating: 5,
      date: '2026-07-02',
      comment: 'Sarah was incredibly fast, professional, and courteous! She diagnosed the leaking pipe in minutes and replaced it immediately. The cleanup was immaculate as well. Highly recommended expert plumber.',
      helpfulCount: 12
    },
    {
      id: 'r2',
      clientName: 'John Smith',
      projectName: 'Double Kitchen Sink Installation',
      rating: 5,
      date: '2026-06-25',
      comment: 'Excellent plumbing work. Completed the double drop-in sink installation ahead of schedule and with perfect connection. Quality testing was thorough.',
      helpfulCount: 8
    },
    {
      id: 'r3',
      clientName: 'Amanda Johnson',
      projectName: 'Water Heater Replacement',
      rating: 4.8,
      date: '2026-05-18',
      comment: 'Sarah did a fantastic job replacing our old water heater. Her explanation of the pressure valves was very helpful. She was about 10 minutes late, but she kept me notified. Would hire again.',
      helpfulCount: 4
    },
    {
      id: 'r4',
      clientName: 'Robert Dow',
      projectName: 'Emergency Drain Unclogging',
      rating: 5,
      date: '2026-04-30',
      comment: 'Came out at 10 PM on a Friday to fix a severe backed-up drain. Saved our weekend! Absolutely professional under pressure.',
      helpfulCount: 19
    }
  ];

  // Ratings breakdown
  const ratingBreakdown = [
    { stars: 5, count: 112, percentage: 88 },
    { stars: 4, count: 11, percentage: 9 },
    { stars: 3, count: 3, percentage: 2 },
    { stars: 2, count: 1, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 }
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
            <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
            <p className="text-muted-foreground">See what customers are saying about your craftsmanship and service</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Left: Overall score card */}
            <Card className="flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Rating</CardTitle>
                <CardDescription>Based on 127 verified reviews</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6 flex-1 flex flex-col justify-center items-center">
                <div className="text-6xl font-extrabold text-foreground mb-3">4.9</div>
                <div className="flex gap-1.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Top 5% of Plumbers in the Brooklyn area
                </p>
              </CardContent>
            </Card>

            {/* Middle/Right: Distribution graph */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ratingBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-4">
                    <span className="text-xs font-semibold w-12 flex items-center gap-1">
                      {row.stars} <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    </span>
                    <Progress value={row.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-12 text-right">{row.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Reviews list */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Verified Customer Reviews
            </h2>

            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div>
                      <h4 className="font-semibold text-foreground">{review.clientName}</h4>
                      {review.companyName && (
                        <p className="text-xs text-muted-foreground">{review.companyName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(review.date).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-800">
                        Verified Work
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(review.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold ml-2">{review.rating}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-primary mb-1">Project: {review.projectName}</p>
                    <p className="text-sm text-foreground/90 italic">"{review.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs text-muted-foreground">
                      <ThumbsUp className="w-3.5 h-3.5 mr-1.5" /> Helpful ({review.helpfulCount})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
