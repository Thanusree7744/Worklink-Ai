import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const userRegistrationData = [
  { month: 'Jan', Workers: 120, Customers: 80 },
  { month: 'Feb', Workers: 210, Customers: 140 },
  { month: 'Mar', Workers: 340, Customers: 190 },
  { month: 'Apr', Workers: 410, Customers: 280 },
  { month: 'May', Workers: 590, Customers: 390 },
  { month: 'Jun', Workers: 780, Customers: 490 },
  { month: 'Jul', Workers: 980, Customers: 610 }
];

const transactionVolumeData = [
  { month: 'Jan', Volume: 15000 },
  { month: 'Feb', Volume: 28000 },
  { month: 'Mar', Volume: 42000 },
  { month: 'Apr', Volume: 51000 },
  { month: 'May', Volume: 79000 },
  { month: 'Jun', Volume: 92000 },
  { month: 'Jul', Volume: 110000 }
];

const categoryDistribution = [
  { name: 'Plumbing', value: 400 },
  { name: 'Electrical', value: 300 },
  { name: 'Painting', value: 250 },
  { name: 'HVAC', value: 180 },
  { name: 'Renovation', value: 160 },
  { name: 'Landscaping', value: 120 }
];

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

export function AdminAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
            <p className="text-muted-foreground">In-depth overview of users, request counts, categories, and payment volumes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* User growth Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Monthly growth of registered Workers vs Customers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={userRegistrationData}>
                    <defs>
                      <linearGradient id="colorWorkers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Workers" stroke="#2563EB" fillOpacity={1} fill="url(#colorWorkers)" />
                    <Area type="monotone" dataKey="Customers" stroke="#10B981" fillOpacity={1} fill="url(#colorCustomers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial transaction volume Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Volume (USD)</CardTitle>
                <CardDescription>Monthly total transaction volume flowing through escrow</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={transactionVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip formatter={(value) => [`$${value}`, 'Transaction Volume']} />
                    <Legend />
                    <Bar dataKey="Volume" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      {transactionVolumeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563EB' : '#60A5FA'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Job Category Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Job Request Distribution</CardTitle>
                <CardDescription>Percentage distribution of posted requests by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform statistics summary card */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics Summary</CardTitle>
                <CardDescription>Overall platform totals to date</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-semibold">Average Match Score</p>
                  <p className="text-2xl font-bold text-primary mt-1">92.4%</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-semibold">Average Ticket Size</p>
                  <p className="text-2xl font-bold text-primary mt-1">$412.50</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-semibold">Total Escrow Processed</p>
                  <p className="text-2xl font-bold text-primary mt-1">$417,000</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-semibold">Active Contractors</p>
                  <p className="text-2xl font-bold text-primary mt-1">1,780</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
