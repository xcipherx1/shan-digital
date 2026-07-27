/**
 * All copy, offers and trust content for the /landing roofing funnel.
 * Everything the owner may want to edit lives here — no layout changes
 * needed to swap copy, add real testimonials, or fill in stats.
 *
 * TRUTHFULNESS RULES (UK ASA/CAP + Meta ad policies):
 * - `clients` are real past clients and may be displayed as a roster.
 * - `testimonials` ship as clearly-labelled placeholders. NEVER invent
 *   quote text — leave `quote` empty until a genuine quote is supplied.
 * - `stats` renders ONLY if filled with real figures; empty = omitted.
 */

export const funnel: {
  brand: string;
  email: string;
  /** Displayed in the funnel footer when set, e.g. "+44 7445 159260". */
  phone: string;
  bookingUrl: string;
  metaPixelId: string;
} = {
  brand: "Shan Digital Marketing",
  email: "info@shandigitalmarketing.com",
  phone: "",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
};

export const hero = {
  eyebrow: "For UK roofing companies",
  /** ?h=b / ?h=c on the URL switches variants for Meta A/B tests. */
  headlines: {
    a: "Become the roofing company homeowners call first, not third.",
    b: "Your competitors are booking the jobs you're losing to a better website.",
    c: "A roofing website that brings you jobs while you're on the ladder.",
  },
  subhead:
    "We build lead-generating websites that rank your roofing business at the top of Google in your town, and turn visitors into booked jobs. Live in days, not months.",
  cta: "Get my free website plan",
  trustStrip: [
    "Built for UK trades",
    "Ranks locally",
    "No long contracts",
  ],
} as const;

export type OfferKey =
  | "one_page_600"
  | "multi_page_1000"
  | "multi_dashboard_1200"
  | "unsure";

export const offers: {
  key: Exclude<OfferKey, "unsure">;
  name: string;
  price: string;
  tagline: string;
  includes: string[];
  highlight: boolean;
}[] = [
  {
    key: "one_page_600",
    name: "Starter Site",
    price: "£600",
    tagline: "One job pays for it many times over.",
    includes: ["1-page website", "Custom enquiry form", "Local SEO foundations", "Mobile-first build"],
    highlight: false,
  },
  {
    key: "multi_page_1000",
    name: "Growth Site",
    price: "£1,000",
    tagline: "Own every service you offer, in every area you cover.",
    includes: [
      "Multi-page website",
      "Custom enquiry form",
      "Service & area pages that rank",
      "Google Business Profile setup",
    ],
    highlight: true,
  },
  {
    key: "multi_dashboard_1200",
    name: "Lead Machine",
    price: "£1,200",
    tagline: "Every enquiry captured, tracked and followed up.",
    includes: [
      "Multi-page website",
      "Custom enquiry form",
      "Custom lead-management dashboard",
      "Enquiry alerts to your phone",
    ],
    highlight: false,
  },
];

/** Questionnaire — answers are stored verbatim under these ids. */
export const questions = [
  {
    id: "work_type",
    label: "What kind of roofing work do you do?",
    options: ["Residential", "Commercial", "Both", "New builds"],
  },
  {
    id: "location",
    label: "Where's your business based?",
    input: "text" as const,
    placeholder: "Town or postcode, e.g. Bristol",
  },
  {
    id: "lead_source",
    label: "How do you get most of your leads right now?",
    options: [
      "Word of mouth",
      "Checkatrade or MyBuilder",
      "Facebook",
      "Google",
      "Honestly, I struggle",
    ],
  },
  {
    id: "has_website",
    label: "Do you have a website today?",
    options: ["No", "Yes, but it's outdated", "Yes, but it brings me nothing"],
  },
  {
    id: "pain_point",
    label: "What's your biggest headache?",
    options: [
      "Not enough leads",
      "Leads are poor quality",
      "Can't compete online",
      "No time to chase enquiries",
    ],
  },
  {
    id: "extra_jobs",
    label: "How many extra jobs a month would change things for you?",
    options: ["1-3", "4-8", "8+", "As many as possible"],
  },
  {
    id: "selected_offer",
    label: "Which sounds right for you?",
    options: [
      "Starter Site — £600 one-page site",
      "Growth Site — £1,000 multi-page site",
      "Lead Machine — £1,200 site + dashboard",
      "Not sure, help me choose",
    ],
    /** Maps the option index to the stored offer key. */
    offerKeys: [
      "one_page_600",
      "multi_page_1000",
      "multi_dashboard_1200",
      "unsure",
    ] as OfferKey[],
  },
  {
    id: "timeline",
    label: "When do you want this sorted?",
    options: ["ASAP", "This month", "1-3 months", "Just exploring"],
  },
] as const;

export const problem = {
  heading: "Homeowners don't scroll. They call whoever they find first.",
  lines: [
    "If you're not on page one for \"roofer near me\", you don't exist to them.",
    "You do brilliant work, but a tired, slow website makes you look like the risky choice.",
    "Every week without a proper site is jobs handed to the roofer down the road.",
  ],
} as const;

export const steps = [
  {
    title: "Quick call",
    body: "15 minutes. We learn your area, your services and where your next jobs should come from.",
  },
  {
    title: "We build",
    body: "A fast, local-SEO website designed to turn visitors into enquiries, built around your business.",
  },
  {
    title: "You get jobs",
    body: "Go live in days and start capturing the enquiries your competitors are winning today.",
  },
] as const;

/** Real client roster — display as names only. No invented results. */
export const clients = {
  roofing: [
    "Roof King Bristol",
    "London Roofing",
    "Jade Roofing",
    "Leicester Roofing",
    "Birmingham Roofing",
    "Quality Roofing",
    "Master Roofing",
    "Roofing Company Liverpool",
  ],
  other: [
    "SWHP Plumbers Bristol",
    "Zoom Cars Bristol",
    "QN Foods",
    "Roger Land Surveyor",
    "A.M Driving School",
    "NMP Pakistan",
    "Brand Axis",
  ],
} as const;

/**
 * Real quotes only. While `quote` is empty the card renders a
 * clearly-labelled "real quote pending" placeholder state.
 */
export const testimonials: { quote: string; name: string; company: string; town: string }[] = [
  { quote: "", name: "", company: "Roof King Bristol", town: "Bristol" },
  { quote: "", name: "", company: "Leicester Roofing", town: "Leicester" },
  { quote: "", name: "", company: "London Roofing", town: "London" },
];

/** Render only when filled with REAL figures. Empty array = strip omitted. */
export const stats: { value: string; label: string }[] = [];

/** Leave empty to omit the guarantee block entirely. */
export const guarantee = "";

export const faqs = [
  {
    q: "How fast will my website be live?",
    a: "Most roofing sites go live within days of our call, not months. The Starter Site is usually the fastest; the Lead Machine takes a little longer because of the dashboard build.",
  },
  {
    q: "What does it cost? Any hidden fees?",
    a: "Exactly what's on the pricing cards: £600, £1,000 or £1,200 depending on the package. No hidden fees, and we'll tell you on the call if hosting or a domain costs extra so there are no surprises.",
  },
  {
    q: "Do I need to write anything or supply content?",
    a: "No. We write the copy for you based on a short call about your services and areas. If you have photos of your work, great — they convert brilliantly — but we can launch without them.",
  },
  {
    q: "Will it actually rank on Google?",
    a: "The site is built with local SEO foundations: your services, your towns, proper structure and speed. Rankings build over weeks, not overnight, and we'll be straight with you about what to expect for your area on the call.",
  },
  {
    q: "What if I already have a website?",
    a: "Even better. We'll look at what you have on the call, keep anything that's working, and replace what isn't. Your domain and existing Google presence come with you.",
  },
  {
    q: "Do you tie me into a contract?",
    a: "No long contracts. You pay for the build; if you want ongoing help afterwards that's your choice, month to month.",
  },
  {
    q: "What happens on the free call?",
    a: "15 minutes: we look at how you get work today, what your competitors rank for in your town, and which package fits. You'll leave with a plan either way — no hard sell.",
  },
] as const;

export const privacyNote =
  "We store the details you submit so we can respond to your enquiry and prepare your website plan (legitimate interest / steps prior to a contract, UK GDPR). We never sell your data, and you can ask us to delete it at any time by emailing " +
  funnel.email +
  ".";
