import { useState, useEffect } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Search, Loader2, RefreshCw, XCircle, Eye } from 'lucide-react';
import { apiClient } from '../services/api';
import { Job } from '../data/mockData';
import { Link } from 'react-router';

export function AdminJobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllJobs = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Job[]>('/jobs');
      setJobs(data);
    } catch (err) {
      console.error('Failed to load platform jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.postedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cancelJob = async (id: string) => {
    // For demo purposes, we will update the state locally
    setJobs(jobs.map(j => {
      if (j.id === id) {
        return { ...j, status: 'cancelled' };
      }
      return j;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType="customer" />
      <div className="flex">
        <DashboardSidebar
          userType="admin"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Job Management</h1>
              <p className="text-muted-foreground">Monitor and manage all job requests and contract states across the platform</p>
            </div>
            <Button variant="outline" size="icon" onClick={fetchAllJobs} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, category, or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-semibold">{job.title}</TableCell>
                        <TableCell>{job.postedBy}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${job.budget} <span className="text-xs text-muted-foreground">({job.budgetType})</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            job.status === 'open' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                            job.status === 'in_progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                            job.status === 'completed' ? 'bg-slate-100 text-slate-800 hover:bg-slate-100' :
                            'bg-red-100 text-red-800 hover:bg-red-100'
                          }>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(job.postedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" asChild className="h-8">
                            <Link to={`/job/${job.id}`}>
                              <Eye className="w-3.5 h-3.5 mr-1" /> View
                            </Link>
                          </Button>
                          {job.status !== 'completed' && job.status !== 'cancelled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelJob(job.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 h-8"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredJobs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center p-8 text-muted-foreground">
                          No jobs found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
