import { z } from "zod";

/** Shared between the lead forms (client) and /api/lead (server). */

export const auditLeadSchema = z.object({
  type: z.literal("audit"),
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email"),
  business: z.string().min(2, "Please enter your business name").max(120),
  website: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  location: z.string().min(2, "Where do you operate?").max(120),
  /** Honeypot — must stay empty. Bots fill it, humans never see it. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export const callLeadSchema = z.object({
  type: z.literal("call"),
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a phone number").max(30),
  goal: z.string().min(2, "Tell us what you want to achieve").max(1000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export const leadSchema = z.discriminatedUnion("type", [
  auditLeadSchema,
  callLeadSchema,
]);

export type AuditLead = z.infer<typeof auditLeadSchema>;
export type CallLead = z.infer<typeof callLeadSchema>;
export type Lead = z.infer<typeof leadSchema>;
