import type { ServiceKey } from "@/config/site";

/**
 * Long-form content for the individual service pages at
 * /services/<slug>. Each page owns its own metadata, copy and FAQs so
 * it can rank on its own terms rather than duplicating the homepage.
 *
 * TRUTHFULNESS: `proof` may only carry figures from delivered work.
 * Services with no evidenced numbers leave it null and sell on the
 * offer instead. Never invent a client result here.
 */

export type ServicePage = {
  slug: string;
  key: ServiceKey;
  /** Short label used in breadcrumbs and internal links. */
  navLabel: string;

  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  eyebrow: string;
  h1: string;
  heroSub: string;
  heroBullets: string[];

  problem: { heading: string; intro: string; pains: string[] };
  includes: {
    heading: string;
    intro: string;
    items: { title: string; body: string }[];
  };
  process: {
    heading: string;
    steps: { title: string; body: string; when: string }[];
  };
  /** Real, attributable outcome. Null when nothing is evidenced yet. */
  proof: {
    value: string;
    label: string;
    client: string;
    summary: string;
    href?: string;
  } | null;
  whyUs: { heading: string; points: { title: string; body: string }[] };
  faqs: { q: string; a: string }[];
  cta: { heading: string; body: string };
  /** Internal links to sibling services. */
  related: ServiceKey[];
};

/** Towns we actively serve. Used for the local relevance section. */
export const areasServed = [
  "Bristol",
  "Bath",
  "Weston-super-Mare",
  "Gloucester",
  "Cheltenham",
  "Swindon",
  "Taunton",
  "Cardiff",
  "Newport",
  "Exeter",
] as const;

export const servicePages: ServicePage[] = [
  /* ────────────────────────── LOCAL SEO ────────────────────────── */
  {
    slug: "local-seo",
    key: "seo",
    navLabel: "Local SEO",
    metaTitle: "Local SEO Services in Bristol for Trades & SMEs",
    metaDescription:
      "Local SEO in Bristol and across the UK. We optimise your Google Business Profile, fix your citations and rank the service pages that bring paying work. Free audit, no obligation.",
    keywords: [
      "local SEO Bristol",
      "SEO agency Bristol",
      "Google Business Profile optimisation",
      "local SEO for trades",
      "map pack ranking",
      "SEO for small business UK",
    ],
    eyebrow: "Local SEO",
    h1: "Local SEO that puts you in the map pack",
    heroSub:
      "We rank Bristol and UK businesses for the searches that actually bring work: roofer near me, emergency plumber, and every service and town combination your customers type into Google.",
    heroBullets: [
      "Google Business Profile built and managed",
      "Citations and NAP cleaned up",
      "Service and area pages that convert",
    ],
    problem: {
      heading: "Why good local businesses stay invisible",
      intro:
        "Most tradespeople and SME owners are not losing work because their work is worse. They are losing it because a competitor turns up first, and the customer never scrolls far enough to find anyone else.",
      pains: [
        "You do not appear in the three map results that take most of the clicks",
        "Your Google Business Profile is half filled in and has not been touched in a year",
        "Your business details read differently on every directory that lists you",
        "You have one page trying to rank for every service in every town you cover",
        "Reviews arrive by accident, if at all, so competitors look safer than you",
      ],
    },
    includes: {
      heading: "What local SEO with us covers",
      intro:
        "Everything below is included in a standard engagement. No modules held back as an upsell.",
      items: [
        {
          title: "Local visibility audit",
          body: "We map where you currently rank for every service and town that matters, look at who is beating you and why, and hand you a prioritised list of what to fix first. Yours to keep either way.",
        },
        {
          title: "Google Business Profile",
          body: "Categories, services, service areas, opening hours, photos, products and posts. The profile is the single biggest lever in local search and it is the one most businesses neglect.",
        },
        {
          title: "Citations and NAP consistency",
          body: "Your name, address and phone number made identical everywhere Google looks, with new listings built on the directories that carry weight in your sector.",
        },
        {
          title: "Reviews that arrive on purpose",
          body: "A simple system that asks every happy customer at the right moment, so review volume and freshness stop being luck and start being a process.",
        },
        {
          title: "Service and location pages",
          body: "A real page for each service in each area you cover, written for the search intent behind it, with genuine local proof rather than the same paragraph with the town swapped out.",
        },
        {
          title: "Technical foundations",
          body: "Crawlability, indexation, site speed, internal linking and schema markup sorted, so the content you publish can actually rank.",
        },
        {
          title: "Reporting you can read",
          body: "Monthly rankings, calls and enquiries in plain English. Not a 40 page PDF of charts nobody opens.",
        },
      ],
    },
    process: {
      heading: "How we run a local SEO campaign",
      steps: [
        {
          title: "Audit and plan",
          when: "Weeks 1 to 2",
          body: "We benchmark your current visibility, analyse the competitors beating you, and agree the services and towns worth going after first.",
        },
        {
          title: "Fix the foundations",
          when: "Weeks 2 to 4",
          body: "Profile, citations, technical issues and the review system. This is the work that stops you leaking visibility before we add anything new.",
        },
        {
          title: "Build the pages",
          when: "Weeks 4 to 8",
          body: "Service and area pages written and published, internally linked, with schema so Google understands exactly what you do and where.",
        },
        {
          title: "Compound and report",
          when: "Month 3 onwards",
          body: "Content, authority building and review velocity month after month. Local SEO rewards the business whose system has been running longest.",
        },
      ],
    },
    proof: {
      value: "3x",
      label: "organic clicks in six months",
      client: "Roof King Bristol",
      summary:
        "Rebuilt the site architecture and on-page SEO across 40+ pages, then sustained 15+ authority placements a month. Organic clicks and impressions tripled in six months, with 30+ form enquiries in the first three.",
      href: "/#work",
    },
    whyUs: {
      heading: "Why businesses pick us for local SEO",
      points: [
        {
          title: "We own the whole system",
          body: "Rankings are worth nothing if the page they land on does not convert. We build the site, the profile and the search presence together, so they pull in the same direction.",
        },
        {
          title: "Local, not national, thinking",
          body: "We win postcode by postcode. That means service area pages, local proof and a profile tuned to your actual catchment, not generic national keywords.",
        },
        {
          title: "Straight reporting",
          body: "You get told what moved, what did not, and what we are doing about it. If something is not working we will say so before you have to ask.",
        },
        {
          title: "No long lock-ins",
          body: "Rolling monthly agreements. We would rather re-earn the work each month than trap you in a twelve month contract.",
        },
      ],
    },
    faqs: [
      {
        q: "How long does local SEO take to work?",
        a: "You will usually see movement inside the first 30 days once the Google Business Profile and technical foundations are fixed, and meaningful gains by around 90 days. Local SEO compounds, so the businesses that win are the ones whose system has been running longest. We will be honest on the call about what your particular area looks like, because a competitive city centre takes longer than a quiet patch.",
      },
      {
        q: "What is the map pack and why does it matter?",
        a: "The map pack is the block of three business listings with a map that appears at the top of local searches, above the normal blue links. It takes a large share of the clicks and calls for searches like roofer near me, because most people never scroll past it. Getting into those three results is the single highest value outcome in local SEO.",
      },
      {
        q: "Can you guarantee first place on Google?",
        a: "No, and you should be wary of anyone who does. Nobody controls Google's ranking systems. What we can commit to is the work: the profile, the citations, the technical fixes, the pages and the review system, all done properly and reported honestly. That is what moves rankings, and we will show you the movement month by month.",
      },
      {
        q: "Do I need a new website for local SEO to work?",
        a: "Not always. If your current site is reasonably quick and we can edit it properly, we will work with it and tell you so. If it is slow, hard to edit or built in a way that blocks search engines, we will tell you that too and show you the evidence rather than simply selling you a rebuild.",
      },
      {
        q: "Do you only work with businesses in Bristol?",
        a: "Bristol is home and we know the South West market deeply, but local SEO is about your area rather than ours. We work with trades, clinics, professional services and industrial firms across the UK, and everything is delivered remotely with regular calls.",
      },
      {
        q: "How much does local SEO cost?",
        a: "Ongoing local SEO is typically between £1,000 and £3,000 a month depending on how competitive your area and services are, and how many towns you want to cover. Every engagement starts with the free audit so you can see the gap and the plan before committing to anything.",
      },
    ],
    cta: {
      heading: "See exactly where you rank today",
      body: "The free audit shows your current local visibility, the competitors beating you and the fixes worth doing first. No obligation, and it is yours to keep.",
    },
    related: ["ads", "web"],
  },

  /* ────────────────────────── GOOGLE ADS ───────────────────────── */
  {
    slug: "google-ads",
    key: "ads",
    navLabel: "Google Ads",
    metaTitle: "Google Ads Management in Bristol | PPC for UK Trades",
    metaDescription:
      "Google Ads and Local Services Ads management for Bristol and UK businesses. Tightly themed campaigns, ruthless negative keywords and full call tracking, so you know what a booked job costs.",
    keywords: [
      "Google Ads management Bristol",
      "PPC agency Bristol",
      "Local Services Ads UK",
      "Google Guaranteed",
      "pay per click for trades",
      "PPC management UK",
    ],
    eyebrow: "Google Ads",
    h1: "Google Ads management that buys the top of the page",
    heroSub:
      "SEO compounds but it takes months. Paid search puts you above the map pack today, with every call and form tracked so you know exactly what an enquiry costs.",
    heroBullets: [
      "Search and Local Services Ads",
      "Call and form conversion tracking",
      "Negative keywords that stop waste",
    ],
    problem: {
      heading: "Why most trade ad accounts quietly waste money",
      intro:
        "Plenty of business owners have tried Google Ads, spent a few hundred pounds, got nothing useful and turned it off. Usually the account was set up in a way that guaranteed that outcome.",
      pains: [
        "Broad match keywords showing your ad to people looking for jobs, courses or DIY guides",
        "No negative keyword list, so you pay for clicks that could never become work",
        "Every service crammed into one ad group, so the ad never matches the search",
        "Clicks landing on a homepage instead of a page about the thing they searched for",
        "No conversion tracking, so nobody can tell which spend produced which enquiry",
      ],
    },
    includes: {
      heading: "What Google Ads management covers",
      intro:
        "Built and run properly from the account structure up, whether we are starting fresh or repairing an existing account.",
      items: [
        {
          title: "Account structure and intent mapping",
          body: "Campaigns and ad groups split by the job you want, so a search for flat roof repair sees an ad about flat roof repair rather than a generic company advert.",
        },
        {
          title: "Local Services Ads and Google Guaranteed",
          body: "Where your trade qualifies, we handle the verification and set up Local Services Ads, which sit above everything else and charge per lead rather than per click.",
        },
        {
          title: "Conversion tracking that reflects reality",
          body: "Calls, form submissions and, where it fits, offline outcomes tracked end to end. Cost per enquiry stops being a guess and becomes a number you can act on.",
        },
        {
          title: "Negative keyword control",
          body: "An actively maintained negative list built from your real search terms, stripping out the jobs boards, the DIY searches and the tyre kickers before they cost you money.",
        },
        {
          title: "Ad copy and landing page match",
          body: "Ads written for the search behind the click, pointing at a page that answers it. The fastest way to lower your cost per lead is usually the page, not the bid.",
        },
        {
          title: "Budget pacing and bid management",
          body: "Spend concentrated on the hours, areas and services that produce work, and pulled back from the ones that do not.",
        },
        {
          title: "Plain English reporting",
          body: "What you spent, how many enquiries it produced and what each one cost. Every month, without jargon.",
        },
      ],
    },
    process: {
      heading: "How we launch and run an ad account",
      steps: [
        {
          title: "Research and plan",
          when: "Week 1",
          body: "Keyword and competitor research, realistic budget modelling and agreement on which services and areas to target first.",
        },
        {
          title: "Build and track",
          when: "Week 1 to 2",
          body: "Campaigns built, conversion tracking installed and tested, Local Services Ads verification started where it applies.",
        },
        {
          title: "Launch and learn",
          when: "Weeks 2 to 4",
          body: "Ads go live. We watch the real search terms daily at first, adding negatives and tightening match types as the data arrives.",
        },
        {
          title: "Optimise and scale",
          when: "Month 2 onwards",
          body: "Shift budget toward what produces booked work, expand the campaigns that pay and cut the ones that do not.",
        },
      ],
    },
    proof: null,
    whyUs: {
      heading: "Why our ad management is different",
      points: [
        {
          title: "Paid and organic run together",
          body: "We can see what converts in paid and feed it into your SEO, and use organic data to sharpen your ads. Most agencies only hold one half of that picture.",
        },
        {
          title: "We optimise for enquiries, not clicks",
          body: "Impressions and click through rate are diagnostics, not goals. The number that matters is what a booked job costs you.",
        },
        {
          title: "Your account stays yours",
          body: "We build in your Google Ads account, not a reseller wrapper. If we ever part ways you keep the account, the history and the learning.",
        },
        {
          title: "Honest about budget",
          body: "If your market needs more spend than you have to make paid search work, we will say so on the first call rather than taking a management fee to run something doomed.",
        },
      ],
    },
    faqs: [
      {
        q: "How quickly do Google Ads produce enquiries?",
        a: "Usually within days of going live, which is the main reason to run ads alongside SEO rather than instead of it. The first two to four weeks are a learning period where we tighten targeting using real search data, so cost per enquiry normally improves noticeably after the first month.",
      },
      {
        q: "What should I budget for Google Ads?",
        a: "It depends entirely on your trade and area, because click prices vary enormously between, say, a rural driving instructor and an emergency plumber in a city centre. We will model realistic numbers for your specific services on the call, including what the management fee is and what goes to Google, so there are no surprises.",
      },
      {
        q: "What are Local Services Ads and should I use them?",
        a: "Local Services Ads sit right at the very top of the results, above normal ads, and show a Google Guaranteed badge once you pass their background and licence checks. You pay per lead rather than per click. For most home service trades they are the single best paid placement available, and we handle the verification process for you.",
      },
      {
        q: "Do I need a landing page or can ads point at my website?",
        a: "If you have a strong page about the specific service being searched for, we will use it. If your ads would land on a generic homepage, a dedicated page almost always lowers your cost per enquiry enough to pay for itself, and we can build one as part of the work.",
      },
      {
        q: "Can you fix an existing Google Ads account rather than starting over?",
        a: "Usually yes, and often that is preferable because the account already has performance history that Google's systems use. We will audit what is there first and tell you honestly whether restructuring it or starting clean is the better option.",
      },
      {
        q: "Do you tie me into a contract?",
        a: "No. Ad management runs on a rolling monthly basis. You keep ownership of the Google Ads account throughout, so you are never stuck with us to keep your campaigns running.",
      },
    ],
    cta: {
      heading: "Find out what a booked job would cost you",
      body: "We will look at your services, your area and what your competitors are bidding, then give you realistic numbers before you spend anything.",
    },
    related: ["seo", "web"],
  },

  /* ─────────────────────── UI/UX & BRANDING ────────────────────── */
  {
    slug: "ui-ux-branding",
    key: "brand",
    navLabel: "UI/UX & Branding",
    metaTitle: "Branding & UI/UX Design for UK Trades and SMEs | Bristol",
    metaDescription:
      "Brand identity and UI/UX design in Bristol. Logos, livery, design systems and interfaces that make small businesses look established and win work on confidence instead of price.",
    keywords: [
      "branding agency Bristol",
      "UI UX design Bristol",
      "logo design for trades",
      "brand identity UK",
      "web design system",
      "vehicle livery design",
    ],
    eyebrow: "UI/UX & Branding",
    h1: "Branding and UI/UX that makes you the obvious choice",
    heroSub:
      "Customers judge credibility in well under a second. We design identities and interfaces that make your business look established and safe to hire, so you stop competing on price alone.",
    heroBullets: [
      "Brand identity and guidelines",
      "Conversion focused interface design",
      "Livery, signage and print",
    ],
    problem: {
      heading: "When the work is great but the brand undersells it",
      intro:
        "Skilled businesses lose jobs to less capable competitors every week, purely because the competitor looks more established. Presentation is not vanity. It is the first evidence a customer has that you are worth the money.",
      pains: [
        "A logo made years ago in whatever software was to hand, with no usable files left",
        "Different colours, fonts and phone numbers across the van, the site and the quotes",
        "A website that looks like a template because it is one",
        "Quotes and documents that undercut the quality of the work they describe",
        "Being pushed into price negotiations because nothing signals that you are the safer choice",
      ],
    },
    includes: {
      heading: "What a branding and UI/UX engagement covers",
      intro:
        "Scoped to what your business actually needs. A sole trader does not need the same package as a firm with thirty vans.",
      items: [
        {
          title: "Brand strategy and positioning",
          body: "Who you are for, what you want to be known for, and the language that says it. The decisions everything else hangs off.",
        },
        {
          title: "Identity design",
          body: "Logo, colour palette, typography and supporting marks, designed to work at every size from a business card to the side of a van at thirty miles an hour.",
        },
        {
          title: "Brand guidelines",
          body: "A short, usable document showing your team and any future supplier exactly how to apply the brand. Not a 90 page manual nobody reads.",
        },
        {
          title: "UX research and user flows",
          body: "We map how customers actually decide and design the route from first visit to enquiry around that, removing the steps that lose people.",
        },
        {
          title: "Interface and web design",
          body: "Full interface design for your site or product, built on a reusable design system so future pages stay consistent without more design spend.",
        },
        {
          title: "Print, livery and signage",
          body: "Vehicle livery, signage, uniforms, quote templates and business cards, all tested for legibility in the real world rather than only on screen.",
        },
        {
          title: "You own every file",
          body: "Source files, fonts and exports handed over at the end. No hostage taking, no coming back to us for a resize.",
        },
      ],
    },
    process: {
      heading: "How a brand project runs",
      steps: [
        {
          title: "Discover",
          when: "Week 1",
          body: "A working session on your customers, your competitors and where you want the business positioned, plus an audit of everything you currently use.",
        },
        {
          title: "Concept",
          when: "Weeks 2 to 3",
          body: "We present a small number of genuinely different directions with the reasoning behind each, rather than twenty variations of the same idea.",
        },
        {
          title: "Refine",
          when: "Weeks 3 to 4",
          body: "One direction chosen and developed properly, tested at real sizes and in real contexts before anything is signed off.",
        },
        {
          title: "Roll out",
          when: "Week 5 onwards",
          body: "Applied across web, print, livery and documents, with guidelines and files handed over so it stays consistent.",
        },
      ],
    },
    proof: null,
    whyUs: {
      heading: "Why our design work pays for itself",
      points: [
        {
          title: "Designed to convert, not to win awards",
          body: "Pretty is the baseline. Every decision is measured against whether it helps a customer trust you and get in touch.",
        },
        {
          title: "Built by the people who build the site",
          body: "Design that never survives contact with development is wasted money. Our designers and developers are the same team, so what gets drawn gets built.",
        },
        {
          title: "Made for the real world",
          body: "We check livery legibility at distance and interface contrast for accessibility, because a brand lives on vans and phones, not in a presentation.",
        },
        {
          title: "Everything handed over",
          body: "You leave with the files, the fonts and the guidelines. Your brand is an asset you own outright.",
        },
      ],
    },
    faqs: [
      {
        q: "How much does a brand identity cost?",
        a: "It depends on scope. A focused identity refresh for a sole trader is a very different project from a full rebrand across a fleet and a website. Projects generally start from £1,500, and we will give you a fixed price after the first call rather than an open ended day rate.",
      },
      {
        q: "Can you refresh our existing brand instead of replacing it?",
        a: "Often that is the right answer, particularly if customers already recognise you locally. Throwing away hard won recognition is rarely smart. We will tell you honestly whether an evolution or a clean rebrand serves you better.",
      },
      {
        q: "What is the difference between UI and UX?",
        a: "UX is the route a customer takes, what they need at each step and what stops them completing it. UI is what that route looks like on screen. Good UI on a broken flow still loses enquiries, which is why we work on both together rather than treating design as decoration.",
      },
      {
        q: "Do I get the source files?",
        a: "Yes, always. You receive the editable source files, exports in every format you will need, the fonts or licences, and the guidelines. Everything we make for you belongs to you.",
      },
      {
        q: "Do you design for print and vehicles as well as web?",
        a: "Yes. For most trades the van is the highest traffic piece of marketing they own. We design livery, signage, uniforms and quote documents alongside the digital work so the whole business looks like one company.",
      },
      {
        q: "How long does a brand project take?",
        a: "A focused identity usually runs four to five weeks from kick off to handover. A full rebrand with a website and livery rollout typically takes eight to twelve weeks. We will give you a dated plan before we start.",
      },
    ],
    cta: {
      heading: "Find out what your brand is costing you",
      body: "We will look at how your business currently presents itself against the competitors you lose work to, and tell you where the gap is.",
    },
    related: ["web", "seo"],
  },

  /* ────────────────────── SAAS DEVELOPMENT ─────────────────────── */
  {
    slug: "saas-development",
    key: "saas",
    navLabel: "SaaS Development",
    metaTitle: "Custom Software & Client Portal Development | Bristol",
    metaDescription:
      "Custom software development in Bristol. Quoting engines, booking systems, client portals and internal dashboards, built in TypeScript and fully owned by your business.",
    keywords: [
      "custom software development Bristol",
      "SaaS development UK",
      "client portal development",
      "bespoke business software",
      "quoting system development",
      "internal dashboard development",
    ],
    eyebrow: "SaaS Development",
    h1: "Custom software that becomes your competitive moat",
    heroSub:
      "When a repetitive process eats your team's week, it is usually cheaper to turn it into software than to hire around it. We build quoting engines, booking systems, portals and dashboards, and you own all of it.",
    heroBullets: [
      "Client portals and quoting engines",
      "Booking and scheduling systems",
      "Full TypeScript builds you own",
    ],
    problem: {
      heading: "The admin that quietly caps your growth",
      intro:
        "Most growing businesses hit a ceiling that has nothing to do with demand. The ceiling is the spreadsheet, the WhatsApp thread and the person who is the only one who knows how the process works.",
      pains: [
        "Quotes rebuilt by hand every time, with pricing living in someone's head",
        "Jobs tracked across a whiteboard, a spreadsheet and several phones",
        "Off the shelf software that costs per seat and still does not fit how you work",
        "Nobody able to answer where a job is without ringing three people",
        "Growth meaning more admin staff rather than more margin",
      ],
    },
    includes: {
      heading: "What we build",
      intro:
        "Scoped tightly around the process that is actually costing you time, then extended once it is proving its worth.",
      items: [
        {
          title: "Process mapping and product strategy",
          body: "Before any code, we map how the work really flows, find the steps that cost the most time and agree the smallest build that removes them.",
        },
        {
          title: "Client portals",
          body: "A place for your customers to see quotes, approve work, track progress and find their documents, which removes a surprising share of inbound phone calls.",
        },
        {
          title: "Quoting and pricing engines",
          body: "Your pricing logic captured properly so quotes are produced in minutes, consistently, by anyone on the team rather than only the owner.",
        },
        {
          title: "Booking and scheduling",
          body: "Availability, bookings, reminders and rescheduling handled automatically, cutting both the admin and the no shows.",
        },
        {
          title: "Internal dashboards",
          body: "One screen showing the state of the business: jobs, pipeline, capacity and the numbers you currently rebuild by hand each month.",
        },
        {
          title: "Integrations",
          body: "Connected to the tools you already pay for, including accounting, payments, calendars and CRM, so data stops being rekeyed between systems.",
        },
        {
          title: "Hosting, monitoring and support",
          body: "Deployed, monitored and maintained, with a clear support arrangement so there is always someone accountable when something breaks.",
        },
      ],
    },
    process: {
      heading: "How a software project runs",
      steps: [
        {
          title: "Map the process",
          when: "Weeks 1 to 2",
          body: "We sit with the people doing the work, document the real process including the workarounds, and identify where the time actually goes.",
        },
        {
          title: "Scope and prototype",
          when: "Weeks 2 to 4",
          body: "A clickable prototype of the core flow so you can react to something real before committing to a full build.",
        },
        {
          title: "Build in stages",
          when: "Weeks 4 to 12",
          body: "Delivered in working increments you can use as they land, rather than disappearing for three months and returning with a surprise.",
        },
        {
          title: "Launch and iterate",
          when: "Ongoing",
          body: "Rolled out with your team trained on it, then improved based on how it is genuinely used rather than how we assumed it would be.",
        },
      ],
    },
    proof: null,
    whyUs: {
      heading: "Why trust us with a build",
      points: [
        {
          title: "We run our own software",
          body: "This agency runs on systems we built ourselves, including a browser based calling platform and a live leads dashboard. We ship the same standard of work we rely on.",
        },
        {
          title: "Modern, maintainable stack",
          body: "TypeScript, React and Postgres, written so another developer could pick it up. No proprietary lock in and no mystery code.",
        },
        {
          title: "Security taken seriously",
          body: "Hashed credentials, validated inputs, rate limiting and least privilege access as standard, not as an afterthought once something goes wrong.",
        },
        {
          title: "You own the code",
          body: "The repository, the data and the hosting accounts are yours. If you ever want to take it in house or elsewhere, nothing stops you.",
        },
      ],
    },
    faqs: [
      {
        q: "How much does custom software cost?",
        a: "A focused first build, such as a quoting tool or a client portal, typically starts around £4,000 to £8,000 depending on complexity. We scope tightly so the first release solves one expensive problem and starts paying back, rather than trying to build everything at once.",
      },
      {
        q: "Is custom software really better than off the shelf?",
        a: "Not always, and we will say so. If an existing product fits your process at a sensible price we will tell you to buy it. Custom makes sense when the off the shelf options force you to change how you work, charge heavily per seat as you grow, or simply do not cover your process.",
      },
      {
        q: "How long does a build take?",
        a: "A first working version of a focused tool usually lands in six to twelve weeks, with usable increments before that. We deliver in stages so you are never waiting months with nothing to look at.",
      },
      {
        q: "What happens if we stop working together?",
        a: "You keep everything. The code repository, the database, the hosting and the domain are all in your name from the start, and the stack is deliberately mainstream so any competent developer can take it on.",
      },
      {
        q: "Can you integrate with the software we already use?",
        a: "Usually yes. Most modern accounting, payment, calendar and CRM tools offer APIs, and connecting to them is often the highest value part of the project because it stops your team rekeying the same data twice.",
      },
      {
        q: "Who maintains it after launch?",
        a: "We do, under a support arrangement agreed up front, covering hosting, monitoring, updates and a route for changes. If you would rather take it in house we will hand over documentation and help your developer get started.",
      },
    ],
    cta: {
      heading: "Tell us which process is eating your week",
      body: "A short call is usually enough for us to say whether software is worth building, whether something off the shelf would do, or whether the process just needs tightening.",
    },
    related: ["web", "brand"],
  },

  /* ─────────────── WEBSITE DESIGN & DEVELOPMENT ────────────────── */
  {
    slug: "website-design-development",
    key: "web",
    navLabel: "Web Design & Development",
    metaTitle: "Website Design & Development in Bristol | Built to Convert",
    metaDescription:
      "Website design and development in Bristol. Fast, search ready websites for UK trades and SMEs, built to turn visitors into enquiries and live in days rather than months.",
    keywords: [
      "website design Bristol",
      "web development Bristol",
      "websites for trades UK",
      "small business website design",
      "conversion focused web design",
      "fast website development",
    ],
    eyebrow: "Web Design & Development",
    h1: "Websites built to rank and turn visitors into enquiries",
    heroSub:
      "A website is not a brochure. It is your hardest working salesperson. We build fast, search ready sites for UK trades and SMEs where every section has a job to do.",
    heroBullets: [
      "Sub second load times",
      "Technical SEO built in from line one",
      "A CMS your team can actually use",
    ],
    problem: {
      heading: "Why most small business websites do not earn their keep",
      intro:
        "Plenty of businesses have a website and still get no work from it. Usually it was designed to look acceptable rather than to be found and to convert.",
      pains: [
        "Slow to load on a phone, which is where nearly all your visitors are",
        "No clear next step, so an interested visitor has nothing obvious to do",
        "One page covering every service, so it ranks for none of them",
        "Built on a platform where changing a phone number means paying someone",
        "No tracking, so nobody knows which pages produce enquiries",
      ],
    },
    includes: {
      heading: "What a website build includes",
      intro:
        "Every build ships with the technical and conversion work included. These are not extras.",
      items: [
        {
          title: "Conversion led design and copy",
          body: "We write the words as well as designing the pages, structured around what your customer needs to know before they will pick up the phone.",
        },
        {
          title: "Fast, modern build",
          body: "Built for speed on real phones on real connections, because load time affects both your rankings and how many visitors stay long enough to enquire.",
        },
        {
          title: "Technical SEO from the start",
          body: "Clean structure, proper headings, metadata, schema markup, sitemaps and internal linking baked in rather than bolted on afterwards.",
        },
        {
          title: "Service and area pages",
          body: "A real page for each service and each town you cover, so you can rank for the specific searches that bring work.",
        },
        {
          title: "A CMS you can use",
          body: "Edit your text, photos, prices and pages yourself without touching code or paying us for a fifteen minute change.",
        },
        {
          title: "Enquiry capture that works",
          body: "Forms that submit reliably and notify you immediately, plus click to call and WhatsApp for the visitors who would rather talk.",
        },
        {
          title: "Analytics and call tracking",
          body: "Set up so you can see which pages and which channels actually produce enquiries, which is what makes every future decision cheaper.",
        },
      ],
    },
    process: {
      heading: "How we build a website",
      steps: [
        {
          title: "Plan the site",
          when: "Week 1",
          body: "A short call on your services, areas and customers, then a sitemap and page plan built around the searches worth ranking for.",
        },
        {
          title: "Design and write",
          when: "Weeks 1 to 3",
          body: "Pages designed and written together, mobile first, so the copy and the layout are made for each other rather than one squeezed into the other.",
        },
        {
          title: "Build and optimise",
          when: "Weeks 3 to 5",
          body: "Developed, made fast, technical SEO applied, tracking installed, then tested on real devices before anyone sees it.",
        },
        {
          title: "Launch and support",
          when: "Week 5 onwards",
          body: "Migrated carefully so you keep the rankings you already have, then monitored after launch with support on hand.",
        },
      ],
    },
    proof: {
      value: "10+",
      label: "organic leads in the first month",
      client: "SWHP Plumbers Bristol",
      summary:
        "Built and launched a conversion focused plumbing site with 12+ live pages and full on page SEO configured from day one. It produced 10+ organic lead submissions inside the first month and now ranks for 20+ high intent service keywords.",
      href: "https://swhpbristol.co.uk",
    },
    whyUs: {
      heading: "Why our websites perform",
      points: [
        {
          title: "Built by people who do the SEO too",
          body: "A site built without search in mind needs rebuilding later. Ours are structured to rank from the first line of code because the same team handles both.",
        },
        {
          title: "Speed treated as a feature",
          body: "Performance budgets are set before we build, not investigated afterwards when the site feels slow.",
        },
        {
          title: "Live in days, not months",
          body: "Focused builds go live quickly. You start capturing enquiries while competitors are still approving mockups.",
        },
        {
          title: "You own the lot",
          body: "Domain, hosting, content and code stay in your name. No platform lock in and nothing held over you.",
        },
      ],
    },
    faqs: [
      {
        q: "How much does a website cost?",
        a: "A focused one page site starts at £600, a multi page site at £1,000, and a multi page site with a custom lead management dashboard at £1,200. Those are the full build prices. If hosting or a domain adds anything we will tell you on the call rather than after the invoice.",
      },
      {
        q: "How quickly can my website go live?",
        a: "Most sites go live within days of our first call once we have your content and photos. Larger multi page builds with lots of service and area pages take a few weeks. The main thing that slows a project down is waiting for photos and sign off.",
      },
      {
        q: "Do I need to write the content?",
        a: "No. We write the copy based on a short call about your services and the areas you cover. If you have photographs of your own work that helps enormously, because real job photos convert far better than stock images, but we can launch without them.",
      },
      {
        q: "Will I be able to edit the website myself?",
        a: "Yes. Every build comes with a content management system so you can change text, photos, prices and add pages without code. We show you how it works at handover and you never need to pay us for a small edit.",
      },
      {
        q: "What happens to my current website and its rankings?",
        a: "We plan the migration carefully, mapping old pages to new ones with redirects so you keep the search equity you have already built. Losing rankings during a rebuild is avoidable and it comes down to doing the redirect work properly.",
      },
      {
        q: "Do you offer ongoing support after launch?",
        a: "Yes, on a rolling monthly basis covering hosting, updates, monitoring and changes. It is optional. Plenty of clients take the site, manage it themselves and only come back when they want something added.",
      },
    ],
    cta: {
      heading: "Get a plan for your website",
      body: "Tell us what your business does and where you work. We will come back with what your site needs to rank and convert, and what it would cost.",
    },
    related: ["seo", "ads"],
  },
];

export const servicePageBySlug: Record<string, ServicePage> =
  Object.fromEntries(servicePages.map((p) => [p.slug, p]));

export const servicePageByKey: Record<ServiceKey, ServicePage> =
  Object.fromEntries(servicePages.map((p) => [p.key, p])) as Record<
    ServiceKey,
    ServicePage
  >;

/** Canonical path for a service, used for all internal linking. */
export function serviceHref(key: ServiceKey): string {
  return `/services/${servicePageByKey[key].slug}`;
}
