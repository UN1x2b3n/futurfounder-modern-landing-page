import { 
  BookOpen, 
  Rocket, 
  Globe, 
  TrendingUp, 
  Users, 
  Code
} from 'lucide-react';
import { FeatureItem } from '../types/feature';

export const featuresData: FeatureItem[] = [
  {
    icon: BookOpen,
    title: "Learn & Master",
    description: "Master AI/ML & fullstack development through hands-on projects and expert guidance from industry professionals.",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Rocket,
    title: "Build & Create",
    description: "Transform your projects into minimum viable products with real startup potential and market validation.",
    gradient: "from-orange-400 to-pink-500"
  },
  {
    icon: Globe,
    title: "Launch & Showcase",
    description: "Showcase your work in demo days and participate in startup challenges with global reach.",
    gradient: "from-pink-500 to-red-500"
  },
  {
    icon: TrendingUp,
    title: "Scale & Grow",
    description: "Get mentorship and community support to grow into a successful founder with proven strategies.",
    gradient: "from-red-500 to-rose-600"
  },
  {
    icon: Users,
    title: "Community Network",
    description: "Connect with like-minded founders, mentors, and industry experts in our thriving ecosystem.",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    icon: Code,
    title: "Technical Excellence",
    description: "Build with cutting-edge technologies and best practices that scale from prototype to production.",
    gradient: "from-blue-500 to-cyan-600"
  }
];