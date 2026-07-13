import { useState, useEffect } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { JobCard } from '../components/worklink/JobCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, SlidersHorizontal, Loader2, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/api';
import { Job } from '../data/mockData';

export function FindJobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [budgetTypeFilter, setBudgetTypeFilter] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Job[]>('/jobs');
      setJobs(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = categoryFilter === 'all' || job.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesUrgency = urgencyFilter === 'all' || job.urgency === urgencyFilter;
    const matchesBudgetType = budgetTypeFilter === 'all' || job.budgetType === budgetTypeFilter;

    return matchesSearch && matchesCategory && matchesUrgency && matchesBudgetType;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setUrgencyFilter('all');
    setBudgetTypeFilter('all');
  };

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
              <h1 className="text-3xl font-bold mb-2">Find Jobs</h1>
              <p className="text-muted-foreground">
                Browse open requests and apply for plumbing, electrical, and other home services jobs
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={fetchJobs} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, description, or skills..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters */}
            {showFilters && (
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="landscaping">Landscaping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Urgency</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetType">Budget Type</Label>
                    <Select value={budgetTypeFilter} onValueChange={setBudgetTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Type</SelectItem>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                  {error}
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} jobs found
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No jobs found matching your criteria</p>
                    <Button variant="link" className="mt-2" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} showMatchScore />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
