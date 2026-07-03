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
    path: '/admin-dashboard',
    Component: () => (
      <RequireAuth requiredRole="admin">
        <AdminDashboard />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
