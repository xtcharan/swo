import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["admin", "organizer", "attendee"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    created_at: string;
    role: "admin" | "organizer" | "attendee";
    updated_at?: string | undefined;
}, {
    id: string;
    email: string;
    created_at: string;
    updated_at?: string | undefined;
    role?: "admin" | "organizer" | "attendee" | undefined;
}>;
export declare const eventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    capacity: z.ZodNumber;
    datetime: z.ZodEffects<z.ZodString, string, string>;
    created_by: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    location: string;
    capacity: number;
    datetime: string;
    created_by: string;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}, {
    title: string;
    description: string;
    location: string;
    capacity: number;
    datetime: string;
    created_by: string;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}>;
export type Event = z.infer<typeof eventSchema>;
export type User = z.infer<typeof userSchema>;
export declare const bookingSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    event_id: z.ZodString;
    user_id: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["confirmed", "waitlist", "cancelled"]>>;
    booked_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "confirmed" | "waitlist" | "cancelled";
    event_id: string;
    user_id: string;
    id?: string | undefined;
    booked_at?: string | undefined;
}, {
    event_id: string;
    user_id: string;
    id?: string | undefined;
    status?: "confirmed" | "waitlist" | "cancelled" | undefined;
    booked_at?: string | undefined;
}>;
export type Booking = z.infer<typeof bookingSchema>;
export declare const createEventInputSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    capacity: z.ZodNumber;
    datetime: z.ZodEffects<z.ZodString, string, string>;
    created_by: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    location: string;
    capacity: number;
    datetime: string;
    created_by: string;
}, {
    title: string;
    description: string;
    location: string;
    capacity: number;
    datetime: string;
    created_by: string;
}>;
export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export declare const updateEventInputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
    datetime: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
    datetime?: string | undefined;
}, {
    id?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
    datetime?: string | undefined;
}>;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;
export declare const registerUserInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;
export declare const loginInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof loginInputSchema>;
//# sourceMappingURL=index.d.ts.map