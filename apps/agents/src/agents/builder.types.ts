import { z } from 'zod';

export const CreateProfileInput = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2).max(100),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().int().min(0).optional(),
});

export const UpdateProfileInput = z.object({
  userId: z.string().uuid(),
  updates: z.object({
    name: z.string().min(2).max(100).optional(),
    bio: z.string().max(1000).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.number().int().min(0).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const GetProfileInput = z.object({
  userId: z.string().uuid(),
});

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBuilderAgent {
  createProfile(input: z.infer<typeof CreateProfileInput>): Promise<Profile>;
  updateProfile(input: z.infer<typeof UpdateProfileInput>): Promise<Profile>;
  getProfile(input: z.infer<typeof GetProfileInput>): Promise<Profile | null>;
}
