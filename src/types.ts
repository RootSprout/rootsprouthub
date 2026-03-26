import { LucideIcon } from 'lucide-react';

export interface Blog {
  id: string;
  title: string;
  author: string;
  tags: string[];
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  link: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stars?: number;
  contributors?: number;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trending: boolean;
  image?: string;
  link?: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'Hackathon' | 'Meetup' | 'Workshop' | 'Talk' | 'Conference' | 'Collaboration' | 'Recap';
  date: string;
  location: string;
  description: string;
  time?: string;
  link?: string;
  image?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  description: string;
  coverImage: string;
  tags: string[];
  price: string;
  formats: Array<{ label: string; price: string }>;
  buyLink: string;
  rating: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  link: string;
  image: string;
}

export type Topic = 'OS' | 'DB' | 'Networking' | 'Distributed Systems' | 'System Design';

export interface Node {
  id: string;
  title: string;
  topic: Topic;
  status: 'locked' | 'available' | 'completed';
  progress: number;
  position: { x: number; y: number };
}

export interface User {
  name: string;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
}
