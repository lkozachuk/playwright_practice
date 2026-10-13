import { z } from 'zod';

// Shared shape for createAccount, deleteAccount, updateAccount, and verifyLogin -
// all four return just { responseCode, message } per the API docs.
export const ApiResponseSchema = z.object({
    responseCode: z.number(),
    message: z.string(),
});

// API 14: getUserDetailByEmail's nested "user" object.
// NOTE: field names below are a best guess pending confirmation against the
// real response (see the earlier debug-test discussion) - adjust if the
// actual payload uses different field names (e.g. birth_date vs birth_day).
export const UserDetailSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    title: z.string(),
    birth_day: z.string(),
    birth_month: z.string(),
    birth_year: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    company: z.string(),
    address1: z.string(),
    address2: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    zipcode: z.string(),
});

export const GetUserDetailResponseSchema = z.object({
    responseCode: z.number(),
    user: UserDetailSchema,
});