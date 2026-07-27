import { z } from "zod";

/** Shared between the /landing questionnaire (client) and the leads API. */

const OFFER_KEYS = [
  "one_page_600",
  "multi_page_1000",
  "multi_dashboard_1200",
  "unsure",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "booked",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Questionnaire answers: known ids → free-ish strings, tightly capped. */
export const answersSchema = z.record(
  z.string().max(40),
  z.string().max(300),
);

export const leadSubmitSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  businessName: z.string().trim().min(2, "Please enter your business name").max(120),
  email: z.email("Please enter a valid email").max(200),
  phone: z.string().trim().min(7, "Please enter a phone number").max(30),
  city: z.string().trim().max(120).optional().default(""),
  selectedOffer: z.enum(OFFER_KEYS).optional(),
  painPoint: z.string().max(200).optional(),
  answers: answersSchema.optional().default({}),
  // Attribution, captured client-side from the landing URL.
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  fbclid: z.string().max(500).optional(),
  /** Honeypot — humans never see it; bots fill it. Must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});
export type LeadSubmit = z.infer<typeof leadSubmitSchema>;

export const bookingPatchSchema = z.object({
  meetingTime: z.iso.datetime({ offset: true }).optional(),
  meetingRef: z.string().trim().max(300).optional(),
});

export const leadStatusPatchSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});
