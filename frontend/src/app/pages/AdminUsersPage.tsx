import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search, ShieldAlert, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'customer' | 'admin';
  status: 'active' | 'suspended';
  verified: boolean;
  avatar?: string;
  joinedDate: string;
}

export function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo users list
  const [users, setUsers] = useState<AdminUserItem[]>([
    { id: '1', name: 'Sarah Johnson', email: 'worker@example.com', role: 'worker', status: 'active', verified: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', joinedDate: '2025-10-12' },
    { id: '2', name: 'Jane Smith', email: 'customer@example.com', role: 'customer', status: 'active', verified: false, joinedDate: '2025-11-01' },
    { id: '3', name: 'Michael Chen', email: 'michael@example.com', role: 'worker', status: 'active', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', joinedDate: '2025-11-20' },
    { id: '4', name: 'David Thompson', email: 'david@example.com', role: 'worker', status: 'active', verified: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', joinedDate: '2025-12-05' },
    { id: '5', name: 'Emily Rodriguez', email: 'emily@example.com', role: 'worker', status: 'suspended', verified: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', joinedDate: '2025-08-14' },
    { id: '6', name: 'System Admin', email: 'admin@example.com', role: 'admin', status: 'active', verified: true, joinedDate: '2025-01-01' }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const toggleVerification = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, verified: !u.verified };
      }
      return u;
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Monitor and configure platform workers, customers, and admins</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role === 'worker' ? (
                          <Badge variant="outline" className={user.verified ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'}>
                            {user.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.role === 'worker' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleVerification(user.id)}
                            className="h-8"
                          >
                            <UserCheck className="w-3.5 h-3.5 mr-1" />
                            {user.verified ? 'Unverify' : 'Verify'}
                          </Button>
                        )}
                        <Button
                          variant={user.status === 'active' ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => toggleStatus(user.id)}
                          className={user.status === 'active' ? 'border-red-300 text-red-600 hover:bg-red-50 h-8' : 'h-8'}
                        >
                          {user.status === 'active' ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-8 text-muted-foreground">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
