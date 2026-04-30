// lib/types.ts — Shared TypeScript types (updated from src/types.ts)
// Key change: _id? is replaced with id (Firestore string IDs)

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super-Admin',
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Teaching {
  id?: string;
  created_at: string;
  title: string;
  speaker: string;
  preached_at: string;
  category: string;
  youtube_url: string;
  description: string;
}

export interface Event {
  id?: string;
  created_at: string;
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  max_attendees?: number;
  registration_required: boolean;
  description: string;
  image_base64?: string | null;
}

export enum PrayerRequestStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface PrayerRequest {
  id?: string;
  created_at: string;
  name: string;
  email: string;
  request_text: string;
  is_private: boolean;
  is_answered: boolean;
  user_id?: string;
  avatar_url?: string | null;
}

export interface SiteContent {
  id?: string;
  page: 'home' | 'give' | 'contact';
  elements: { [key: string]: string };
}

export interface ChatMessage {
  id?: string;
  created_at: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  recipientId?: string | null;
  chatType?: 'community' | 'admin' | 'private';
  delivered?: boolean;
  read?: boolean;
  isImage?: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    authorName: string;
  };
  reactions?: {
    [emoji: string]: {
      count: number;
      users: string[];
    };
  };
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Leader {
  id?: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  youtubeUrl: string;
  createdAt: string;
}

export interface Testimony {
  id?: string;
  created_at: string;
  name: string;
  title: string;
  story_text: string;
  is_approved: boolean;
}

export interface MinistryTeam {
  id?: string;
  name: string;
  description: string;
  leaderName: string;
  contactEmail: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface VolunteerApplication {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  teamId: string;
  teamName: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  authorId: string;
  featureImageUrl: string;
  status: 'draft' | 'published';
  createdAt: string;
  publishedAt?: string;
}

export interface MediaAsset {
  url: string;
  publicId: string;
  alt?: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface LightCampus {
  id?: string;
  name: string;
  location: string;
  leaderName: string;
  contactInfo: string;
  meetingSchedule: string;
  imageUrl?: string;
  images?: MediaAsset[];
  isActive: boolean;
  createdAt: string;
}

export interface LightCampusApplication {
  id?: string;
  applicantUserId: string;
  applicantName: string;
  applicantEmail: string;
  avatarUrl?: string;
  name: string;
  location: string;
  description: string;
  proposedLeaderName: string;
  contactInfo: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface TorchKidsContent {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  safetyText: string;
  experienceText: string;
  groupsText: string;
}
