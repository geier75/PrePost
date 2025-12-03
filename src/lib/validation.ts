/**
 * Input Validation Schemas using Zod
 * SOTA Best Practice: Validate all user input
 */

import { z } from 'zod';

// Platform types
export const platformSchema = z.enum([
  'twitter',
  'linkedin',
  'facebook',
  'instagram',
  'tiktok',
  'reddit',
  'other'
]);

export type Platform = z.infer<typeof platformSchema>;

// Content Analysis Request Schema
export const analyzeRequestSchema = z.object({
  content: z.string()
    .min(1, 'Content cannot be empty')
    .max(5000, 'Content too long (max 5000 characters)')
    .transform(str => str.trim()),
  platform: platformSchema.default('other'),
  metadata: z.object({
    url: z.string().url().optional(),
    scheduledTime: z.string().datetime().optional(),
    userAgent: z.string().optional(),
  }).optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

// User Registration Schema
export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(str => str.trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .optional(),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  gdprConsent: z.boolean()
    .refine(val => val === true, 'GDPR consent is required'),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

// User Login Schema
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(str => str.trim()),
  password: z.string()
    .min(1, 'Password is required'),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// User Profile Update Schema
export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .optional(),
  profession: z.string()
    .max(100, 'Profession too long')
    .optional(),
  industry: z.string()
    .max(100, 'Industry too long')
    .optional(),
  avatarUrl: z.string()
    .url('Invalid avatar URL')
    .optional(),
  settings: z.object({
    notifications: z.boolean().optional(),
    emailAlerts: z.boolean().optional(),
    language: z.enum(['de', 'en']).optional(),
  }).optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

// Feedback Schema
export const feedbackSchema = z.object({
  analysisId: z.string().uuid('Invalid analysis ID'),
  rating: z.number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  accuracyRating: z.number()
    .int()
    .min(1, 'Accuracy rating must be at least 1')
    .max(5, 'Accuracy rating must be at most 5')
    .optional(),
  helpful: z.boolean().optional(),
  comment: z.string()
    .max(1000, 'Comment too long')
    .optional(),
});

export type FeedbackRequest = z.infer<typeof feedbackSchema>;

// Privacy Consent Schema
export const consentSchema = z.object({
  userId: z.string().optional(),
  consentTypes: z.object({
    necessary: z.boolean(),
    functional: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean(),
  }),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
});

export type ConsentRequest = z.infer<typeof consentSchema>;

// Data Deletion Request Schema
export const deletionRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  reason: z.string()
    .min(10, 'Please provide a reason (minimum 10 characters)')
    .max(500, 'Reason too long'),
  confirmEmail: z.string().email('Invalid email address'),
}).refine(data => data.email === data.confirmEmail, {
  message: 'Email addresses must match',
  path: ['confirmEmail'],
});

export type DeletionRequest = z.infer<typeof deletionRequestSchema>;

// Stripe Checkout Schema
export const checkoutSchema = z.object({
  priceId: z.string().startsWith('price_', 'Invalid price ID'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
});

export type CheckoutRequest = z.infer<typeof checkoutSchema>;

// Helper function to validate and parse data
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Helper to format Zod errors for API responses
export function formatZodErrors(error: z.ZodError): Array<{
  field: string;
  message: string;
}> {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
