import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { WorkerSignup } from './pages/WorkerSignup';
import { CustomerSignup } from './pages/CustomerSignup';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { JobPostingPage } from './pages/JobPostingPage';
import { WorkerSearchPage } from './pages/WorkerSearchPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';
import RequireAuth from './components/RequireAuth';

// New missing tab pages
import { FindJobsPage } from './pages/FindJobsPage';
import { MyJobsPage } from './pages/MyJobsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { MyPostingsPage } from './pages/MyPostingsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminJobsPage } from './pages/AdminJobsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/worker-signup',
    Component: WorkerSignup,
  },
  {
    path: '/customer-signup',
    Component: CustomerSignup,
  },
  {
    path: '/worker-dashboard',
    Component: () => (
      <RequireAuth requiredRole="worker">
        <WorkerDashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/customer-dashboard',
    Component: () => (
      <RequireAuth requiredRole="customer">
        <CustomerDashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/post-job',
    Component: () => (
      <RequireAuth>
        <JobPostingPage />
      </RequireAuth>
    ),
  },
  {
    path: '/find-workers',
    Component: () => (
      <RequireAuth>
        <WorkerSearchPage />
      </RequireAuth>
    ),
  },
  {
    path: '/worker/:id',
    Component: WorkerProfilePage,
  },
  {
    path: '/job/:id',
    Component: JobDetailsPage,
  },
  {
    path: '/ai-recommendations',
    Component: () => (
      <RequireAuth>
        <AIRecommendationsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/settings',
    Component: () => (
      <RequireAuth>
        <SettingsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/jobs',
    Component: () => (
      <RequireAuth requiredRole="worker">
        <FindJobsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/my-jobs',
    Component: () => (
      <RequireAuth requiredRole="worker">
        <MyJobsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/messages',
    Component: () => (
      <RequireAuth>
        <MessagesPage />
      </RequireAuth>
    ),
  },
  {
    path: '/reviews',
    Component: () => (
      <RequireAuth requiredRole="worker">
        <ReviewsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/my-postings',
    Component: () => (
      <RequireAuth requiredRole="customer">
        <MyPostingsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin-dashboard',
    Component: () => (
      <RequireAuth requiredRole="admin">
        <AdminDashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/users',
    Component: () => (
      <RequireAuth requiredRole="admin">
        <AdminUsersPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/jobs',
    Component: () => (
      <RequireAuth requiredRole="admin">
        <AdminJobsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/analytics',
    Component: () => (
      <RequireAuth requiredRole="admin">
        <AdminAnalyticsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/settings',
    Component: () => (
      <RequireAuth requiredRole="admin">
        <AdminSettingsPage />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    Component: NotFound,
  },
]);

