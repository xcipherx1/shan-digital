/**
 * Central content & brand configuration.
 *
 * Every section of the landing page reads from this file, so copy,
 * contact details and stats can be edited in one place — and later
 * swapped for data served by the Client Management Dashboard.
 *
 * NOTE: stats, reviews, projects and milestones are realistic
 * placeholder marketing content. Replace with real figures before
 * making public claims.
 */

export const site = {
  name: "Shan Digital Marketing",
  shortName: "Shan",
  tagline: "Local search, won.",
  description:
    "Shan Digital Marketing builds complete growth systems for SMEs and industries: Local SEO, UI/UX & branding, SaaS development and high-performance websites. Based in Bristol, UK.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shandigitalmarketing.com",
  email: "info@shandigitalmarketing.com",
  founded: 2019,
  address: {
    street: "7 Salcombe Road",
    postcode: "BS6 1AH",
    city: "Bristol",
    country: "United Kingdom",
    mapUrl: "https://maps.google.com/?q=7+Salcombe+Road+Bristol+BS6+1AH",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/shan-digital-marketing",
    instagram: "https://www.instagram.com/shandigitalmarketing",
    x: "https://x.com/shandigital",
    dribbble: "https://dribbble.com/shandigital",
  },
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
] as const;

/* ── Hero ──────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Bristol, United Kingdom · est. 2019",
  rating: { score: "5.0", count: "40+ UK businesses" },
  statBar: [
    { value: "120+", label: "Projects shipped" },
    { value: "3.4x", label: "Avg. lead growth" },
    { value: "96%", label: "Client retention" },
    { value: "£12m+", label: "Client revenue influenced" },
  ],
} as const;

/* ── About / legacy ───────────────────────────────────────────── */

export const about = {
  story: [
    "Shan Digital Marketing started in 2019 with **one frustration**: watching brilliant local businesses lose work to worse competitors with **better visibility**.",
    "Six years on, we're the growth department behind **40+ SMEs and industrial firms** across the UK. We design the brand, build the website, engineer the **search presence** and ship the software that ties it all together.",
  ],
  milestones: [
    {
      year: "2019",
      title: "Founded in Bristol",
      body: "One laptop and one client: a Bedminster plumber who tripled his calls in five months. Word spread.",
    },
    {
      year: "2021",
      title: "Full-stack studio",
      body: "Brand and UI/UX design joined SEO. We stopped patching marketing problems and started building whole systems.",
    },
    {
      year: "2023",
      title: "SaaS division launched",
      body: "Client portals, quoting engines, booking systems. Software became the moat our clients keep winning with.",
    },
    {
      year: "2026",
      title: "40+ systems running",
      body: "From trades to dental to industrial supply, our systems quietly power local market leaders across the UK.",
    },
  ],
  values: [
    { title: "Obsessively local", body: "We win postcode by postcode, not vanity keyword by vanity keyword." },
    { title: "One accountable team", body: "Strategy, design, build and rank: one team, one number to call." },
    { title: "You own everything", body: "Your site, your data, your rankings. No hostage-taking, ever." },
  ],
} as const;

/* ── Reviews (word of mouth, Google-style) ────────────────────── */

export const reviews = [
  {
    name: "James Whitfield",
    business: "Whitfield Heating & Plumbing",
    initials: "JW",
    rating: 5,
    date: "March 2026",
    text: "Within four months we were the first call in our area. The phone genuinely doesn't stop. We've hired two engineers just to keep up.",
  },
  {
    name: "Priya Sharma",
    business: "Sharma Dental Studio, Bath",
    initials: "PS",
    rating: 5,
    date: "January 2026",
    text: "They didn't sell us a website. They built us a system: brand, site, reviews, rankings. Best money this practice has ever spent.",
  },
  {
    name: "Mark Davies",
    business: "Davies Industrial Supplies",
    initials: "MD",
    rating: 5,
    date: "November 2025",
    text: "The quoting portal they built runs our entire sales process now. Clients assume we're a far bigger company than we are.",
  },
  {
    name: "Sophie Turner",
    business: "Turner & Co Solicitors",
    initials: "ST",
    rating: 5,
    date: "October 2025",
    text: "Clear reporting, no jargon, and we rank top three for every search that matters in Bristol. Refreshingly straight people.",
  },
  {
    name: "Aaron Bennett",
    business: "Bennett Roofing, Gloucester",
    initials: "AB",
    rating: 5,
    date: "September 2025",
    text: "I was burnt by two agencies before. Shan showed me exactly what they'd do, did it, and the enquiries followed. Simple as that.",
  },
  {
    name: "Helena Cooper",
    business: "Cooper Veterinary Clinic",
    initials: "HC",
    rating: 5,
    date: "July 2025",
    text: "From a tired 2014 website to fully booked six weeks after launch. The new booking flow alone was worth it.",
  },
] as const;

/* ── Services ─────────────────────────────────────────────────── */

export type ServiceKey = "seo" | "brand" | "saas" | "web";

export const services: {
  key: ServiceKey;
  index: string;
  title: string;
  short: string;
  blurb: string;
  deliverables: string[];
  detail: {
    headline: string;
    body: string;
    includes: string[];
    outcome: { value: string; label: string };
  };
}[] = [
  {
    key: "seo",
    index: "01",
    title: "Local SEO",
    short: "Own the map pack",
    blurb:
      "Own the map pack and the searches that matter in your area. We engineer visibility where your customers actually look.",
    deliverables: [
      "Google Business Profile",
      "Local citations",
      "Review systems",
      "Technical SEO",
      "Local content strategy",
    ],
    detail: {
      headline: "Be the first call in your postcode.",
      body: "46% of all Google searches have local intent, and the top three map results take almost all of the clicks. We build the citation network, review velocity, on-page signals and locally relevant content that puts you there and keeps you there.",
      includes: [
        "Full local visibility audit & competitor gap analysis",
        "Google Business Profile optimisation & management",
        "Citation building & NAP consistency cleanup",
        "Automated review generation system",
        "Location & service landing pages that convert",
        "Monthly ranking, call and enquiry reporting",
      ],
      outcome: { value: "+212%", label: "avg. enquiry-call lift within 6 months" },
    },
  },
  {
    key: "brand",
    index: "02",
    title: "UI/UX & Branding",
    short: "Look like the obvious choice",
    blurb:
      "Identity and interfaces that make your business look like the obvious choice, and convert like it too.",
    deliverables: [
      "Brand identity",
      "Design systems",
      "UX research & flows",
      "Interface design",
    ],
    detail: {
      headline: "Design that makes price a footnote.",
      body: "Customers judge credibility in 50 milliseconds. We design identities and interfaces that make your business feel established, premium and trustworthy, so prospects stop comparing on price and start choosing on confidence.",
      includes: [
        "Brand strategy, identity & guidelines",
        "Conversion-focused UX research & user flows",
        "Full interface design with reusable design system",
        "Motion & interaction design",
        "Print & vehicle livery for local presence",
        "Brand asset handover, you own every file",
      ],
      outcome: { value: "2.1x", label: "avg. conversion-rate improvement post-rebrand" },
    },
  },
  {
    key: "saas",
    index: "03",
    title: "SaaS Development",
    short: "Systemise your operations",
    blurb:
      "Custom software and client portals that systemise your operations, built to scale with your business.",
    deliverables: [
      "Product strategy",
      "Full-stack builds",
      "Dashboards & portals",
      "Integrations & APIs",
    ],
    detail: {
      headline: "Software that becomes your moat.",
      body: "Quoting engines, booking systems, client portals, internal dashboards. When a repetitive process eats your team's week, we turn it into software. Custom built, fully owned by you, and designed to scale as you grow.",
      includes: [
        "Process mapping & product strategy",
        "Full-stack development (TypeScript, React, Node)",
        "Client portals & quoting engines",
        "Booking & scheduling systems",
        "CRM, payment & accounting integrations",
        "Hosting, monitoring & ongoing support",
      ],
      outcome: { value: "15hrs", label: "avg. weekly admin saved per client team" },
    },
  },
  {
    key: "web",
    index: "04",
    title: "Website Design & Development",
    short: "Your hardest-working salesperson",
    blurb:
      "Fast, search-ready websites engineered to turn visitors into enquiries, not just look good in a portfolio.",
    deliverables: [
      "High-performance builds",
      "Conversion-led design",
      "CMS & e-commerce",
      "Analytics & tracking",
    ],
    detail: {
      headline: "Websites built to rank and convert.",
      body: "A one-second delay drops conversions by up to 7%. We build sub-second, search-optimised websites where every section has a job: rank for intent, earn trust, and turn visits into booked work.",
      includes: [
        "Conversion-led design & copywriting",
        "Sub-second Next.js / modern stack builds",
        "Technical SEO baked in from line one",
        "CMS so your team can edit anything",
        "E-commerce & payment integration",
        "Analytics, heat-mapping & call tracking",
      ],
      outcome: { value: "0.8s", label: "median load time across client sites" },
    },
  },
];

/* ── Past projects (work showcase) ────────────────────────────── */

export type Project = {
  slug: string;
  title: string;
  client: string;
  service: ServiceKey;
  serviceLabel: string;
  year: string;
  summary: string;
  /** The minute details a designer would point at. */
  critique: string[];
  results: { value: string; label: string }[];
  palette: { from: string; to: string; accent: string };
};

export const projects: Project[] = [
  {
    slug: "whitfield-heating",
    title: "From page 3 to first call",
    client: "Whitfield Heating & Plumbing",
    service: "seo",
    serviceLabel: "Local SEO",
    year: "2025",
    summary:
      "Complete local search takeover for a Bristol heating firm: 14 service keywords into the map pack, review velocity up 8x.",
    critique: [
      "Citation graph rebuilt across 62 directories with exact NAP match",
      "Review schema with service-level granularity",
      "Suburb-level landing pages, each with unique local proof",
    ],
    results: [
      { value: "+212%", label: "enquiry calls" },
      { value: "14", label: "keywords in map pack" },
    ],
    palette: { from: "#0e3b32", to: "#2dd4bf", accent: "#c9f73a" },
  },
  {
    slug: "sharma-dental",
    title: "A practice that books itself",
    client: "Sharma Dental Studio",
    service: "web",
    serviceLabel: "Web Design & Dev",
    year: "2025",
    summary:
      "Rebuilt a tired template site into a 0.7s-load booking machine. Online bookings up 3.8x in the first quarter.",
    critique: [
      "Booking CTA persistent in viewport on every breakpoint",
      "Typography scale tuned to 1.25 ratio for clinical calm",
      "Treatment pages structured around question-led search intent",
    ],
    results: [
      { value: "3.8x", label: "online bookings" },
      { value: "0.7s", label: "load time" },
    ],
    palette: { from: "#1c1633", to: "#7c6cf0", accent: "#c9f73a" },
  },
  {
    slug: "davies-portal",
    title: "Quoting, without the admin",
    client: "Davies Industrial Supplies",
    service: "saas",
    serviceLabel: "SaaS Development",
    year: "2024",
    summary:
      "Custom quoting portal handling 400+ quotes a month: spec, price, approve and invoice without a single spreadsheet.",
    critique: [
      "Quote builder reduced from 11 fields to 4 with smart defaults",
      "Optimistic UI so every action feels instant on site Wi-Fi",
      "Role-based views: sales, warehouse and director see different truths",
    ],
    results: [
      { value: "15hrs", label: "admin saved weekly" },
      { value: "+167%", label: "quote requests" },
    ],
    palette: { from: "#332014", to: "#f59e0b", accent: "#c9f73a" },
  },
  {
    slug: "bennett-rebrand",
    title: "A roofer that looks national",
    client: "Bennett Roofing",
    service: "brand",
    serviceLabel: "UI/UX & Branding",
    year: "2024",
    summary:
      "Identity, livery and site for a Gloucester roofing firm. Now mistaken for a national franchise, and priced accordingly.",
    critique: [
      "Wordmark cut at 12 degrees to echo a roof pitch: subtle and ownable",
      "Slate and safety-orange palette tested for van-side legibility at 30mph",
      "Photography direction: scaffold-level, golden hour, real crew",
    ],
    results: [
      { value: "+38%", label: "avg. job value" },
      { value: "2.4x", label: "quote acceptance" },
    ],
    palette: { from: "#2b2d31", to: "#f97362", accent: "#c9f73a" },
  },
  {
    slug: "cooper-vets",
    title: "Fully booked in six weeks",
    client: "Cooper Veterinary Clinic",
    service: "web",
    serviceLabel: "Web Design & Dev",
    year: "2025",
    summary:
      "Warm, fast, accessible site with integrated booking. Appointment no-shows down by a third thanks to reminder flows.",
    critique: [
      "WCAG AA throughout, tested with real screen-reader users",
      "Emergency pathway reachable in one tap from any page",
      "Micro-illustrations replace stocky pet photography",
    ],
    results: [
      { value: "6wks", label: "to fully booked" },
      { value: "-33%", label: "no-shows" },
    ],
    palette: { from: "#13301f", to: "#4ade80", accent: "#c9f73a" },
  },
  {
    slug: "turner-solicitors",
    title: "Authority you can search",
    client: "Turner & Co Solicitors",
    service: "seo",
    serviceLabel: "Local SEO",
    year: "2026",
    summary:
      "Top-three rankings for every practice-area search in Bristol, with a content strategy built around the questions clients actually ask.",
    critique: [
      "Practice-area hubs with FAQ schema for AI-answer visibility",
      "E-E-A-T signals: every page authored by a named solicitor",
      "Internal-link architecture mirrors the firm's referral logic",
    ],
    results: [
      { value: "Top 3", label: "every key search" },
      { value: "+92%", label: "qualified enquiries" },
    ],
    palette: { from: "#11233f", to: "#60a5fa", accent: "#c9f73a" },
  },
  {
    slug: "securefast-locksmiths",
    title: "Found first, called first",
    client: "SecureFast Locksmiths",
    service: "seo",
    serviceLabel: "Local SEO",
    year: "2024",
    summary:
      "Emergency-intent search domination across Gloucester: top of the map pack for every urgent locksmith search that matters.",
    critique: [
      "Call-tracking numbers wired per landing page for true attribution",
      "Profile posts scheduled around peak lockout hours",
      "Service-area schema tuned suburb by suburb",
    ],
    results: [
      { value: "+148%", label: "emergency calls" },
      { value: "Top 3", label: "in 11 service areas" },
    ],
    palette: { from: "#14323b", to: "#38bdf8", accent: "#c9f73a" },
  },
  {
    slug: "bristol-scaffold",
    title: "Safety you can see",
    client: "Bristol Scaffold Co",
    service: "brand",
    serviceLabel: "UI/UX & Branding",
    year: "2025",
    summary:
      "Full identity for a 60-van scaffolding firm: bold, compliant and unmistakable on any skyline in the city.",
    critique: [
      "High-vis yellow checked against site-signage safety standards",
      "Logotype legible at 200 metres on tower banners",
      "Tender documents redesigned to win at first glance",
    ],
    results: [
      { value: "+52%", label: "tender wins" },
      { value: "60", label: "vans rebranded" },
    ],
    palette: { from: "#33300f", to: "#facc15", accent: "#c9f73a" },
  },
  {
    slug: "apex-fieldflow",
    title: "Jobs that run themselves",
    client: "Apex Electrical",
    service: "saas",
    serviceLabel: "SaaS Development",
    year: "2025",
    summary:
      "Job-management app for a 12-engineer electrical firm: scheduling, certificates and invoicing in one flow.",
    critique: [
      "Offline-first so certificates save even in basements",
      "One-thumb mobile flows designed for gloved hands",
      "Auto-generated compliance certificates cut paperwork to minutes",
    ],
    results: [
      { value: "22hrs", label: "admin saved weekly" },
      { value: "100%", label: "paperless certificates" },
    ],
    palette: { from: "#2a1535", to: "#d946ef", accent: "#c9f73a" },
  },
  {
    slug: "marina-estates",
    title: "Listings that sell themselves",
    client: "Marina & Co Estate Agents",
    service: "web",
    serviceLabel: "Web Design & Dev",
    year: "2026",
    summary:
      "Property site with instant search and a three-question valuation funnel that fills the pipeline on its own.",
    critique: [
      "Search results render instantly from edge cache",
      "Valuation funnel reduced to three questions",
      "Every listing page emits full schema for portal-free SEO",
    ],
    results: [
      { value: "4.2x", label: "valuation leads" },
      { value: "0.6s", label: "load time" },
    ],
    palette: { from: "#3e1020", to: "#fb7185", accent: "#c9f73a" },
  },
];

/* ── Stats / results ──────────────────────────────────────────── */

export const stats = [
  { value: 212, suffix: "%", label: "Average increase in enquiry calls" },
  { value: 3.4, suffix: "x", decimals: 1, label: "Average return on spend" },
  { value: 40, suffix: "+", label: "Local businesses systemised" },
  { value: 90, suffix: " days", label: "To first measurable lift" },
] as const;

/** Indexed growth curve drawn in the Results section (month, index). */
export const growthCurve = [
  { month: "M1", value: 100 },
  { month: "M2", value: 108 },
  { month: "M3", value: 131 },
  { month: "M4", value: 152 },
  { month: "M5", value: 198 },
  { month: "M6", value: 240 },
  { month: "M7", value: 261 },
  { month: "M8", value: 312 },
] as const;

/* ── Process ──────────────────────────────────────────────────── */

export const processSteps = [
  {
    index: "01",
    title: "Discover & Audit",
    body: "We map your market, your competitors and every search your customers make. You get a brutally honest audit of where you stand, and exactly what it costs you.",
    duration: "Weeks 1-2",
  },
  {
    index: "02",
    title: "Design & Build",
    body: "Brand, website, profiles, content. We design the entire system around one job: turning local intent into enquiries for your business.",
    duration: "Weeks 3-8",
  },
  {
    index: "03",
    title: "Launch & Rank",
    body: "We push the system live and start compounding: citations, reviews, content and technical signals that move you up the map pack week after week.",
    duration: "Week 8+",
  },
  {
    index: "04",
    title: "Scale & Support",
    body: "Once the engine runs, we scale it: new locations, new services, custom software. You watch it all from one dashboard.",
    duration: "Ongoing",
  },
] as const;

/* ── Value props ──────────────────────────────────────────────── */

export const valueProps = [
  {
    title: "Compounding visibility",
    body: "SEO that builds on itself month after month: an asset you own, not rent like ads.",
  },
  {
    title: "One accountable partner",
    body: "Strategy, design, build, rank. One team, one invoice, one person to call when you want answers.",
  },
  {
    title: "Conversion-first design",
    body: "Every pixel has a job. Pretty is the baseline; booked work is the brief.",
  },
  {
    title: "Software-grade engineering",
    body: "Your site is built like a product: fast, tested, maintainable, ready for the dashboard era.",
  },
  {
    title: "Radical reporting",
    body: "Calls, enquiries, rankings, revenue influence. Real numbers monthly, in plain English.",
  },
  {
    title: "Local market obsession",
    body: "We win postcode by postcode. Your patch becomes your fortress.",
  },
] as const;

/* ── Why us (comparison) ──────────────────────────────────────── */

export const comparison = {
  rows: [
    { criterion: "Complete system covering SEO, brand, web & software", us: true, them: false },
    { criterion: "Senior people do the work, not juniors", us: true, them: false },
    { criterion: "You own every asset, account & line of code", us: true, them: false },
    { criterion: "Plain-English monthly reporting on calls & revenue", us: true, them: false },
    { criterion: "Rolling contracts, re-earned every single month", us: true, them: false },
    { criterion: "12-month lock-ins & hostage websites", us: false, them: true },
    { criterion: "Vanity-metric reports nobody reads", us: false, them: true },
  ],
  guarantees: [
    "No long lock-in contracts",
    "Reply within one working day",
    "You own everything we build",
    "Measurable lift in 90 days",
  ],
} as const;

/* ── Testimonials (editorial pull quotes) ─────────────────────── */

export const testimonials = [
  {
    quote:
      "Within four months we were the first call in our area. The phone genuinely doesn't stop. We've hired two people just to keep up.",
    name: "James Whitfield",
    role: "Director, Whitfield Heating & Plumbing",
  },
  {
    quote:
      "They didn't sell us a website. They built us a system: brand, site, reviews, rankings. It's the best money this business has spent.",
    name: "Priya Sharma",
    role: "Owner, Sharma Dental Studio",
  },
  {
    quote:
      "The portal they built runs our whole quoting process now. Clients think we're a much bigger company than we are.",
    name: "Mark Davies",
    role: "MD, Davies Industrial Supplies",
  },
] as const;

/* ── Case studies (Results section cards) ─────────────────────── */

export const caseStudies = [
  {
    sector: "Trades & Home Services",
    location: "Bristol",
    result: "+212%",
    metric: "enquiry calls in 6 months",
    summary:
      "Rebuilt the brand and website, dominated the local map pack for 14 service keywords.",
  },
  {
    sector: "Dental Practice",
    location: "Bath",
    result: "3.8x",
    metric: "return on marketing spend",
    summary:
      "Review engine plus local landing pages took them from page 3 to the top of local results.",
  },
  {
    sector: "Industrial Supplier",
    location: "South West",
    result: "+167%",
    metric: "qualified quote requests",
    summary:
      "A custom quoting portal and search overhaul turned their site into their best salesperson.",
  },
] as const;

/* ── FAQs ─────────────────────────────────────────────────────── */

export const faqs = [
  {
    q: 'What does "complete system" actually mean?',
    a: "Most agencies sell you one piece: a website, or some SEO, or a logo. We build the whole engine: brand, website, local search presence, review generation and, where it fits, custom software. Every part is designed to feed the others, which is why it compounds instead of stalling.",
  },
  {
    q: "How long until I see results from Local SEO?",
    a: "You'll see movement in the first 30 days and meaningful lifts within 90. Local SEO compounds, and the businesses that win are the ones whose system has been running longest. That's why we start with a free audit, so you know exactly where you stand before spending a penny.",
  },
  {
    q: "How much does it cost?",
    a: "Projects start from £1,500 for focused engagements; complete growth systems are typically £1,000 to £3,000 per month depending on market competitiveness. Every engagement starts with the free audit, so you'll see the gap and the plan before any commitment.",
  },
  {
    q: "Do you only work with businesses in Bristol?",
    a: "Bristol is home, and we know the South West market deeply, but our systems work for SMEs and industrial businesses across the UK. Local SEO is about your area, not ours.",
  },
  {
    q: "What's included in the free audit?",
    a: "A genuine, human-built review of your local rankings, Google Business Profile, website performance and competitor gap, with a prioritised list of what to fix first. No obligation, and it's yours to keep even if we never work together.",
  },
  {
    q: "Can you build custom software for my business?",
    a: "Yes. That's our SaaS development arm: client portals, quoting engines, booking systems, internal dashboards. If a repetitive process is eating your team's time, we can probably turn it into software.",
  },
  {
    q: "Will I be locked into a long contract?",
    a: "No. We work on rolling monthly agreements; we'd rather re-earn your business every month than trap you in a 12-month lock-in. You also own every asset we create: domain, site, content, accounts, code.",
  },
  {
    q: "Who actually does the work?",
    a: "Senior specialists, in-house. Your project isn't handed to an offshore queue or a junior learning on your budget. The people who scope your system are the people who build it.",
  },
] as const;

export const marqueeItems = [
  "Local SEO",
  "UI/UX & Branding",
  "SaaS Development",
  "Web Design & Development",
  "Google Business Profile",
  "Review Systems",
  "Conversion Design",
  "Client Portals",
] as const;
