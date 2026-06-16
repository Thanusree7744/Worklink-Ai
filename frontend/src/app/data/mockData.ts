export interface Worker {
  id: string;
  name: string;
  title: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  distance: number;
  verified: boolean;
  availability: 'available' | 'busy' | 'offline';
  profileImage: string;
  skillLevel: 'beginner' | 'intermediate' | 'expert';
  completedJobs: number;
  responseTime: string;
  matchScore?: number;
  bio: string;
  experience: number; // years
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  location: string;
  postedBy: string;
  postedDate: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applicants: number;
  requiredSkills: string[];
  urgency: 'low' | 'medium' | 'high';
  matchScore?: number;
}

export interface Notification {
  id: string;
  type: 'message' | 'application' | 'job_match' | 'review' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface DashboardStats {
  activeJobs: number;
  completedJobs: number;
  earnings: number;
  rating: number;
  profileViews?: number;
  applications?: number;
}

export const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Professional Plumber',
    skills: ['Plumbing', 'Pipe Installation', 'Emergency Repairs'],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 75,
    location: 'Brooklyn, NY',
    distance: 2.3,
    verified: true,
    availability: 'available',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    skillLevel: 'expert',
    completedJobs: 245,
    responseTime: '30 min',
    matchScore: 95,
    bio: 'Licensed plumber with 10+ years of experience. Specialized in residential and commercial plumbing repairs.',
    experience: 10,
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Certified Electrician',
    skills: ['Electrical Wiring', 'Solar Installation', 'Home Automation'],
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 85,
    location: 'Manhattan, NY',
    distance: 5.1,
    verified: true,
    availability: 'available',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    skillLevel: 'expert',
    completedJobs: 189,
    responseTime: '1 hour',
    matchScore: 92,
    bio: 'Master electrician specializing in modern home automation and solar installations.',
    experience: 12,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Interior Painter',
    skills: ['Interior Painting', 'Wallpaper Installation', 'Color Consultation'],
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 55,
    location: 'Queens, NY',
    distance: 3.8,
    verified: true,
    availability: 'busy',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    skillLevel: 'expert',
    completedJobs: 312,
    responseTime: '2 hours',
    matchScore: 88,
    bio: 'Professional painter with an eye for detail and color. Transform your space beautifully.',
    experience: 8,
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'HVAC Technician',
    skills: ['AC Repair', 'Heating Systems', 'Ventilation'],
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 90,
    location: 'Bronx, NY',
    distance: 4.5,
    verified: true,
    availability: 'available',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    skillLevel: 'expert',
    completedJobs: 278,
    responseTime: '45 min',
    matchScore: 94,
    bio: 'EPA certified HVAC specialist. Keep your home comfortable year-round.',
    experience: 15,
  },
  {
    id: '5',
    name: 'Jessica Lee',
    title: 'General Contractor',
    skills: ['Home Renovation', 'Kitchen Remodeling', 'Project Management'],
    rating: 4.6,
    reviewCount: 89,
    hourlyRate: 95,
    location: 'Brooklyn, NY',
    distance: 1.9,
    verified: true,
    availability: 'available',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    skillLevel: 'expert',
    completedJobs: 156,
    responseTime: '1 hour',
    matchScore: 90,
    bio: 'Full-service contractor bringing your dream renovation to life.',
    experience: 11,
  },
  {
    id: '6',
    name: 'Robert Martinez',
    title: 'Landscaper',
    skills: ['Lawn Care', 'Garden Design', 'Tree Trimming'],
    rating: 4.8,
    reviewCount: 134,
    hourlyRate: 60,
    location: 'Staten Island, NY',
    distance: 8.2,
    verified: false,
    availability: 'available',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    skillLevel: 'intermediate',
    completedJobs: 201,
    responseTime: '3 hours',
    matchScore: 85,
    bio: 'Creating beautiful outdoor spaces for over 7 years.',
    experience: 7,
  },
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Kitchen Sink Installation',
    description: 'Need a professional plumber to install a new kitchen sink and connect all plumbing. Must be completed this weekend.',
    category: 'Plumbing',
    budget: 350,
    budgetType: 'fixed',
    location: 'Brooklyn, NY',
    postedBy: 'John Smith',
    postedDate: '2026-06-10',
    status: 'open',
    applicants: 12,
    requiredSkills: ['Plumbing', 'Sink Installation'],
    urgency: 'high',
    matchScore: 96,
  },
  {
    id: '2',
    title: 'Electrical Panel Upgrade',
    description: 'Upgrading from 100A to 200A service panel. Need licensed electrician with city permit experience.',
    category: 'Electrical',
    budget: 120,
    budgetType: 'hourly',
    location: 'Manhattan, NY',
    postedBy: 'Amanda Johnson',
    postedDate: '2026-06-11',
    status: 'open',
    applicants: 8,
    requiredSkills: ['Electrical Wiring', 'Permit Knowledge'],
    urgency: 'medium',
    matchScore: 93,
  },
  {
    id: '3',
    title: 'Interior House Painting',
    description: '3 bedroom apartment needs complete interior painting. Includes living room, kitchen, and hallways.',
    category: 'Painting',
    budget: 2500,
    budgetType: 'fixed',
    location: 'Queens, NY',
    postedBy: 'Michael Brown',
    postedDate: '2026-06-09',
    status: 'in_progress',
    applicants: 23,
    requiredSkills: ['Interior Painting', 'Surface Preparation'],
    urgency: 'low',
    matchScore: 89,
  },
  {
    id: '4',
    title: 'AC Unit Not Cooling',
    description: 'Central AC system not cooling properly. Need urgent diagnostic and repair.',
    category: 'HVAC',
    budget: 85,
    budgetType: 'hourly',
    location: 'Bronx, NY',
    postedBy: 'Sarah Williams',
    postedDate: '2026-06-12',
    status: 'open',
    applicants: 6,
    requiredSkills: ['AC Repair', 'HVAC Diagnostics'],
    urgency: 'high',
    matchScore: 95,
  },
  {
    id: '5',
    title: 'Bathroom Renovation',
    description: 'Complete bathroom remodel including new tiles, fixtures, and vanity installation.',
    category: 'Renovation',
    budget: 8500,
    budgetType: 'fixed',
    location: 'Brooklyn, NY',
    postedBy: 'David Garcia',
    postedDate: '2026-06-08',
    status: 'open',
    applicants: 15,
    requiredSkills: ['Bathroom Remodeling', 'Tile Installation', 'Plumbing'],
    urgency: 'medium',
    matchScore: 91,
  },
  {
    id: '6',
    title: 'Backyard Landscaping',
    description: 'Design and implement new landscape design for 500 sq ft backyard. Include flower beds and stone pathway.',
    category: 'Landscaping',
    budget: 3200,
    budgetType: 'fixed',
    location: 'Staten Island, NY',
    postedBy: 'Lisa Anderson',
    postedDate: '2026-06-11',
    status: 'open',
    applicants: 9,
    requiredSkills: ['Garden Design', 'Hardscaping', 'Plant Installation'],
    urgency: 'low',
    matchScore: 86,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'job_match',
    title: 'New Job Match',
    message: '95% match: Kitchen Sink Installation in Brooklyn',
    timestamp: '5 min ago',
    read: false,
    actionUrl: '/jobs/1',
  },
  {
    id: '2',
    type: 'application',
    title: 'Application Received',
    message: 'Sarah Johnson applied to your Plumbing job',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/applications',
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Michael Chen sent you a message',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'review',
    title: 'New Review',
    message: 'You received a 5-star review from John Smith',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Received',
    message: '$350 payment for Kitchen Renovation job',
    timestamp: '2 days ago',
    read: true,
  },
];

export const workerDashboardStats: DashboardStats = {
  activeJobs: 3,
  completedJobs: 245,
  earnings: 48750,
  rating: 4.9,
  profileViews: 1248,
};

export const customerDashboardStats: DashboardStats = {
  activeJobs: 2,
  completedJobs: 18,
  earnings: 0,
  rating: 4.7,
  applications: 34,
};
