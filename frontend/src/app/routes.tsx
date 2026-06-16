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
    Component: WorkerDashboard,
  },
  {
    path: '/customer-dashboard',
    Component: CustomerDashboard,
  },
  {
    path: '/post-job',
    Component: JobPostingPage,
  },
  {
    path: '/find-workers',
    Component: WorkerSearchPage,
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
    Component: AIRecommendationsPage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
  {
    path: '/admin-dashboard',
    Component: AdminDashboard,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
