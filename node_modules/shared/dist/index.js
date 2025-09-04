"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInputSchema = exports.registerUserInputSchema = exports.updateEventInputSchema = exports.createEventInputSchema = exports.bookingSchema = exports.eventSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// User schema (for Supabase auth users)
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime().optional(),
    role: zod_1.z.enum(['admin', 'organizer', 'attendee']).default('attendee'),
});
// Event schema
exports.eventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(1, 'Title is required').max(100),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters').max(1000),
    location: zod_1.z.string().min(1, 'Location is required'),
    capacity: zod_1.z.number().int().positive('Capacity must be greater than 0'),
    datetime: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    created_by: zod_1.z.string().uuid(),
    created_at: zod_1.z.string().datetime().optional(),
    updated_at: zod_1.z.string().datetime().optional(),
});
// Booking schema
exports.bookingSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    event_id: zod_1.z.string().uuid(),
    user_id: zod_1.z.string().uuid(),
    status: zod_1.z.enum(['confirmed', 'waitlist', 'cancelled']).default('confirmed'),
    booked_at: zod_1.z.string().datetime().optional(),
});
// Create event input (without server fields)
exports.createEventInputSchema = exports.eventSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
// Update event input
exports.updateEventInputSchema = exports.eventSchema
    .omit({
    created_by: true,
    created_at: true,
    updated_at: true,
})
    .partial();
// User registration input
exports.registerUserInputSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
// Login input
exports.loginInputSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=index.js.map