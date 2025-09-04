import { z } from 'zod';

// User schema (for Supabase auth users)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  role: z.enum(['admin', 'organizer', 'attendee']).default('attendee'),
});

// Event schema
export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  location: z.string().min(1, 'Location is required'),
  capacity: z.number().int().positive('Capacity must be greater than 0'),
  datetime: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  created_by: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Event = z.infer<typeof eventSchema>;
export type User = z.infer<typeof userSchema>;

// Booking schema
export const bookingSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['confirmed', 'waitlist', 'cancelled']).default('confirmed'),
  booked_at: z.string().datetime().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

// Create event input (without server fields)
export const createEventInputSchema = eventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;

// Update event input
export const updateEventInputSchema = eventSchema
  .omit({
    created_by: true,
    created_at: true,
    updated_at: true,
  })
  .partial();

export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;

// User registration input
export const registerUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

// Login input
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
