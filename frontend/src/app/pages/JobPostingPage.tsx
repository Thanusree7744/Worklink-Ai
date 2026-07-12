import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Badge } from '../components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { apiClient } from '../services/api';

export function JobPostingPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formEl = e.currentTarget as HTMLFormElement;
    const title = (formEl.querySelector('#title') as HTMLInputElement).value;
    const description = (formEl.querySelector('#description') as HTMLTextAreaElement).value;
    const budget = parseFloat((formEl.querySelector('#budget') as HTMLInputElement).value) || 0.0;
    const location = (formEl.querySelector('#location') as HTMLInputElement).value;
    const startDateVal = (formEl.querySelector('#startDate') as HTMLInputElement).value;

    const locParts = location.split(',');
    const city = locParts[1]?.trim() || 'Brooklyn';
    const state = locParts[2]?.trim().split(' ')[0] || 'NY';
    const zipCode = locParts[2]?.trim().split(' ')[1] || '11201';

    const payload = {
      title,
      description,
      category,
      budget_type: budgetType,
      budget_amount: budget,
      location,
      city,
      state,
      zip_code: zipCode,
      urgency,
      start_date: startDateVal ? new Date(startDateVal).toISOString() : new Date().toISOString(),
      skills
    };

    try {
      await apiClient.post('/jobs/', payload);
      navigate('/customer-dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to post job');
      setIsSubmitting(false);
    }
  };


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
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
              <p className="text-muted-foreground">
                Provide details about your job to get matched with the right workers
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Fill in the information about your job</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Kitchen Sink Installation"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select required value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="painting">Painting</SelectItem>
                          <SelectItem value="hvac">HVAC</SelectItem>
                          <SelectItem value="renovation">Renovation</SelectItem>
                          <SelectItem value="landscaping">Landscaping</SelectItem>
                          <SelectItem value="carpentry">Carpentry</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the work that needs to be done..."
                        rows={5}
                        required
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Budget Type</Label>
                      <RadioGroup value={budgetType} onValueChange={(value) => setBudgetType(value as 'fixed' | 'hourly')}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed">Fixed Price</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hourly" id="hourly" />
                          <Label htmlFor="hourly">Hourly Rate</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">
                        {budgetType === 'fixed' ? 'Fixed Budget ($)' : 'Hourly Rate ($)'}
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder={budgetType === 'fixed' ? '500' : '75'}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Job Location</Label>
                      <Input
                        id="location"
                        placeholder="123 Main St, New York, NY 10001"
                        required
                      />
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Required Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          placeholder="Add a required skill"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill} variant="secondary">
                          Add
                        </Button>
                      </div>
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select required value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Can wait</SelectItem>
                          <SelectItem value="medium">Medium - Within a week</SelectItem>
                          <SelectItem value="high">High - Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Preferred Start Date</Label>
                      <Input id="startDate" type="date" required />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {error && (
                      <div className="text-red-500 text-sm w-full mb-4">
                        {error}
                      </div>
                    )}
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post Job'
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
