import { z } from 'zod';

export const ProfileDataSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export type ProfileData = z.infer<typeof ProfileDataSchema>;

export interface BuilderAgentResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export interface BuilderAgentInterface {
  createProfile(profileData: ProfileData): Promise<BuilderAgentResponse>;
  updateProfile(userId: string, updates: Partial<ProfileData>): Promise<BuilderAgentResponse>;
  getProfile(userId: string): Promise<BuilderAgentResponse>;
}
