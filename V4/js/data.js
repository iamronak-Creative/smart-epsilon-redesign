/**
 * Content data for the Smart Epsilon homepage.
 *
 * Sourced from the existing homepage draft and public smartepsilon.com copy.
 * Product naming aligned to the live brand: TrakNode (track & trace) and
 * KAVACH (anti-counterfeit). See README.md "Assumptions" for anything that
 * still needs client verification before launch (stats, certifications,
 * contact details, and customer logos).
 */

export const nav = {
  solutions: [
    { name: "TrakNode — Track & Trace", icon: "route", href: "#track-trace", hook: "Serialization & real-time visibility" },
    { name: "KAVACH — Anti-Counterfeiting", icon: "shield-check", href: "#kavach", hook: "Overt, covert & forensic protection" },
    { name: "Loyalty & Rewards", icon: "gift", href: "#loyalty", hook: "Consumer & retailer engagement" },
    { name: "AI Video Intelligence", icon: "video", href: "#ai-video", hook: "CCTV into supply chain intelligence" },
    { name: "Holographic Security Labels", icon: "hexagon", href: "#kavach", hook: "Tamper-evident labels, ordered online" },
  ],
  industries: [
    { name: "Agrochemicals", href: "#industries", hook: "Stop counterfeit pesticides killing crops and brands." },
    { name: "Lubricants & Auto", href: "#industries", hook: "End grey-market diversion and fake oils." },
    { name: "Seeds", href: "#industries", hook: "Guarantee germination, beat seed fraud." },
    { name: "Pharmaceuticals", href: "#industries", hook: "Meet incoming track-and-trace mandates." },
    { name: "CPG & Packaged Foods", href: "#industries", hook: "Win shelf space with retailer loyalty." },
  ],
  company: [
    { name: "About Smart Epsilon", href: "#why" },
    { name: "Case studies", href: "#cases" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#cta" },
  ],
};

export const heroTrust = [
  { icon: "plug", label: "No rip-and-replace" },
  { icon: "shield-check", label: "GS1 EPCIS 2.0 native" },
  { icon: "rocket", label: "Live in 6 weeks" },
];

export const scanFeed = [
  { label: "Authenticity verified", meta: "Nashik, IN · 2s ago", color: "var(--se-teal)" },
  { label: "Batch #A2291 scanned", meta: "Rajkot, IN · 5s ago", color: "var(--se-purple)" },
  { label: "Loyalty payout · ₹450", meta: "Indore, IN · 9s ago", color: "var(--se-amber)" },
];

export const scanFeedPool = [
  { label: "Authenticity verified", meta: "Pune, IN · just now", color: "var(--se-teal)" },
  { label: "Retailer scan logged", meta: "Kanpur, IN · just now", color: "var(--se-purple)" },
  { label: "Loyalty payout · ₹900", meta: "Guntur, IN · just now", color: "var(--se-amber)" },
  { label: "Diversion alert cleared", meta: "Ludhiana, IN · just now", color: "var(--se-amber)" },
];

export const flowNodes = [
  { name: "Plant", icon: "factory" },
  { name: "Warehouse", icon: "warehouse" },
  { name: "Distributor", icon: "truck" },
  { name: "Retailer", icon: "store" },
  { name: "Consumer", icon: "user-check" },
];

export const problems = [
  { num: "01", color: "var(--se-purple)", title: "Blind spots past the factory gate", body: "Once goods leave your plant, visibility drops. Distributors report what they want, not what's real — so you make decisions on stale data." },
  { num: "02", color: "var(--se-amber)", title: "Counterfeits quietly drain your margin", body: "Fake products damage your brand, harm your consumers, and bleed revenue — often long before you know it's happening." },
  { num: "03", color: "var(--se-teal)", title: "Retailers have no reason to push you", body: "Your team visits once a month; a competitor's loyalty program runs every day. Without engagement, the shelf goes to whoever paid last." },
];

export const platformModules = [
  {
    id: "trak",
    eyebrow: "Solution 01",
    name: "TrakNode — Track & Trace",
    icon: "route",
    color: "#8fb0ff",
    tagline: "Complete product traceability from manufacturing to consumer.",
    features: ["Unit-level serialization", "Real-time supply chain tracking", "ERP & logistics integration"],
  },
  {
    id: "kavach",
    eyebrow: "Solution 02",
    name: "KAVACH — Anti-Counterfeiting",
    icon: "shield-check",
    color: "#5be0c8",
    tagline: "Overt, covert, and forensic protection — verified in seconds.",
    features: ["Holographic security label", "Geo-tagged clone detection", "AI watermark authentication"],
  },
  {
    id: "loyalty",
    eyebrow: "Solution 03",
    name: "Loyalty & Rewards",
    icon: "gift",
    color: "#ffc978",
    tagline: "Reward genuine purchases and build long-term consumer relationships.",
    features: ["Earn points through product scans", "Redemption marketplace", "Channel loyalty programs"],
  },
  {
    id: "aivideo",
    eyebrow: "Solution 04",
    name: "AI Video Intelligence",
    icon: "video",
    color: "#c3b6f2",
    tagline: "Transform warehouse and logistics operations using AI-powered video analytics.",
    features: ["Loading/unloading verification", "Theft & anomaly detection", "Process compliance monitoring"],
  },
  {
    id: "labels",
    eyebrow: "Solution 05",
    name: "Holographic Security Labels",
    icon: "hexagon",
    color: "#c3b6f2",
    tagline: "Tamper-evident, nano-OVD labels — ordered online, no platform commitment required.",
    features: ["Custom brand security designs", "Serial or QR integration", "Simple online ordering"],
  },
];

export const impact = [
  { icon: "eye-check", color: "var(--se-violet)", bg: "rgba(102,87,180,.1)", title: "Visibility", body: "One live source of truth from plant to shelf — every unit, every node — so decisions run on real channel data, not distributor guesswork.", stat: "80%", statLabel: "Improvement in inventory visibility" },
  { icon: "shield-check", color: "var(--se-teal)", bg: "rgba(13,148,136,.12)", title: "Authenticity", body: "Three-layer anti-counterfeit protection lets anyone verify a product in seconds — and flags cloned codes the moment they appear in the channel.", stat: "99.2%", statLabel: "Products verified authentic" },
  { icon: "bolt", color: "var(--se-amber)", bg: "rgba(245,158,11,.12)", title: "Agility", body: "Real-time alerts on diversion, stockouts, and counterfeits mean your teams respond in hours — not quarters after the damage is done.", stat: "20–25%", statLabel: "Reduction in stockouts" },
];

export const howItWorks = [
  { icon: "qr", term: "Serialize", body: "Every unit gets a unique QR code printed at the plant." },
  { icon: "layers", term: "Aggregate", body: "Codes are linked in a parent-child hierarchy — bottle to carton to pallet." },
  { icon: "radar", term: "Scan & capture", body: "Every movement is scanned and recorded in real time, online or offline." },
  { icon: "shield-check", term: "Verify & engage", body: "Consumers verify authenticity and earn rewards at the point of scan." },
];

export const kavachLayers = [
  { num: "1", color: "var(--se-violet)", bg: "rgba(102,87,180,.12)", title: "Overt · Holographic security label", body: "Naked-eye, no-device verification via a tamper-evident nano-OVD label — the first line of defense before anyone scans anything." },
  { num: "2", color: "var(--se-teal)", bg: "rgba(13,148,136,.12)", title: "Covert · Geo-tagged clone detection", body: "Duplicate scans across locations flag cloned codes the moment they appear." },
  { num: "3", color: "var(--se-amber)", bg: "rgba(245,158,11,.12)", title: "Forensic · AI watermark authentication", body: "An invisible packaging watermark, verified by AI, protects your highest-value SKUs." },
];

export const loyaltyPrograms = [
  { icon: "route", title: "Product-based", badge: "Most common", body: "Points earned by scanning a specific product. Different products can carry different point values, set by the brand." },
  { icon: "layers", title: "Volume-based", badge: "Buy more, earn more", body: "Points scale with quantity — deeper stocking earns more per unit." },
  { icon: "gift", title: "Combo / bundle", badge: "Cross-sell driver", body: "Bonus points when a retailer buys multiple products together, driving portfolio breadth." },
];

export const aiVideoFeatures = [
  "Object detection across dock doors, aisles, and staging areas",
  "Loading and unloading verification against the manifest",
  "Theft and anomaly detection, flagged in real time",
  "Process compliance monitoring across warehouses and hubs",
];

export const compare = [
  { label: "Built for traceability", us: "Purpose-built platform", them: "Add-on to an ERP" },
  { label: "Counterfeit protection", us: "Overt + covert + forensic", them: "Single QR code" },
  { label: "Time to go live", us: "Live in ~6 weeks", them: "Quarters of rollout" },
  { label: "Fits your stack", us: "Works with SAP, Oracle, any ERP", them: "Rip-and-replace" },
  { label: "Field readiness", us: "Teams trained in under a week", them: "Heavy retraining" },
];

export const metrics = [
  { value: "320M+", label: "Units serialized", color: "var(--se-teal)" },
  { value: "95%", label: "Proactive scanning compliance", color: "var(--se-violet)" },
  { value: "20–25%", label: "Reduction in stockouts", color: "var(--se-teal)" },
  { value: "30%", label: "Increase in retailer retention", color: "var(--se-violet)" },
];

export const industries = [
  { name: "Agrochemicals", icon: "leaf", hook: "Stop counterfeit pesticides killing crops and brands." },
  { name: "Lubricants & Auto", icon: "droplet", hook: "End grey-market diversion and fake oils." },
  { name: "Seeds", icon: "seedling", hook: "Guarantee germination, beat seed fraud." },
  { name: "Pharmaceuticals", icon: "pill", hook: "Meet incoming track-and-trace mandates." },
  { name: "CPG & Packaged Foods", icon: "cart", hook: "Win shelf space with retailer loyalty." },
  { name: "Cosmetics", icon: "sparkles", hook: "Protect premium products at the consumer's hand." },
];

export const cases = [
  { tag: "Agrochemicals", color: "var(--se-violet)", company: "World's largest agrochemical company", challenge: "Once products left the factory across a 100+ country network, visibility gradually diminished — secondary sales ran on delayed reports.", result: "End-to-end visibility, 10+ countries" },
  { tag: "Lubricants", color: "var(--se-teal)", company: "National oil & lubricants major", challenge: "Needed to track cases to cartons to pallets across depots and dealers.", result: "Full parent-child aggregation" },
  { tag: "Industrial", color: "var(--se-amber)", company: "World's largest rotary-tiller maker", challenge: "Warehouse chaos across multiple manufacturing plants.", result: "End-to-end WMS transformation" },
];

export const quotes = [
  { color: "var(--se-violet)", text: "For the first time we can see exactly what's moving through the channel in real time. Stockout firefighting has all but disappeared.", name: "VP, Supply Chain", role: "National lubricants manufacturer" },
  { color: "var(--se-teal)", text: "Smart Epsilon's anti-counterfeiting solution cut counterfeit-driven complaints sharply in our first two quarters. Our field team now spots clones before customers do.", name: "Head of Brand Protection", role: "Agrochemicals major" },
  { color: "var(--se-amber)", text: "It sat on top of our existing SAP setup with no rip-and-replace, and we were live in weeks. Adoption on the ground was the easy part.", name: "Director, Operations", role: "CPG & packaged foods" },
];

// NOTE: Certifications below are carried over from the design draft.
// Confirm each with Smart Epsilon before public launch — see README.md.
export const compliance = [
  { icon: "lock", name: "SOC 2", mean: "Independently audited controls over your data and uptime." },
  { icon: "shield-check", name: "ISO 27001:2022", mean: "Certified information-security management, end to end." },
  { icon: "hexagon", name: "GS1 EPCIS 2.0", mean: "Open interoperability standard — no vendor lock-in." },
  { icon: "globe", name: "GDPR", mean: "EU data-protection compliance built into the platform." },
  { icon: "lock", name: "CCPA", mean: "Consumer privacy rights honored by default." },
];

export const faqs = [
  { q: "How much does implementation cost, and how long does it take?", a: "Pricing scales with unit volume and the modules you deploy. Most manufacturers are live on TrakNode within about six weeks of kickoff, including SKU mapping and ERP integration — a specialist will size this to your SKU count on the demo call." },
  { q: "Is it secure and compliant enough for a cautious buyer?", a: "The platform is built on the GS1 EPCIS 2.0 standard for interoperability and follows independently audited security practices. We'll walk your IT and security teams through the architecture directly." },
  { q: "We already run SAP/Oracle — do we need to rip and replace anything?", a: "No. Smart Epsilon sits on top of your existing ERP (SAP, Oracle, Microsoft Dynamics) and logistics systems. Serialization and scan data flow in without disrupting what already works." },
  { q: "What happens to data if the field team is offline?", a: "Scans are captured and queued on-device, then sync automatically once connectivity returns — designed for rural and low-connectivity distribution networks." },
  { q: "Can we start with one product line before rolling out further?", a: "Yes. Most customers pilot on a single high-risk SKU or region, prove the ROI, then expand across product lines and geographies." },
];

export const footer = {
  columns: [
    { title: "Products", links: [{ label: "TrakNode — Track & Trace", href: "#track-trace" }, { label: "KAVACH — Anti-Counterfeit", href: "#kavach" }, { label: "Loyalty Platform", href: "#loyalty" }, { label: "AI Video Intelligence", href: "#ai-video" }] },
    { title: "Industries", links: [{ label: "Agrochemicals", href: "#industries" }, { label: "Lubricants & Auto", href: "#industries" }, { label: "Seeds", href: "#industries" }, { label: "Pharmaceuticals", href: "#industries" }, { label: "CPG & Foods", href: "#industries" }] },
    { title: "Company", links: [{ label: "Why Smart Epsilon", href: "#why" }, { label: "Case Studies", href: "#cases" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#cta" }] },
  ],
};
