export interface ThreatEntry {
  id: string;
  timestamp: string;
  impersonated: string;
  vector: "Email" | "WhatsApp" | "LinkedIn" | "Telegram" | "SMS" | "Video Call";
  technique: string;
  region: string;
  severity: "low" | "medium" | "high" | "critical";
}

export const THREAT_FEED: ThreatEntry[] = [
  { id: "TR-2041", timestamp: "12s ago",  impersonated: "Tata Consultancy Services", vector: "Email",     technique: "Lookalike domain tcs-careers[.]net",        region: "IN-MH", severity: "high" },
  { id: "TR-2040", timestamp: "47s ago",  impersonated: "Infosys",                    vector: "WhatsApp", technique: "₹4,500 'training kit' fee request",         region: "IN-KA", severity: "critical" },
  { id: "TR-2039", timestamp: "1m ago",   impersonated: "Amazon",                     vector: "LinkedIn", technique: "Fake recruiter, redirect to Telegram",      region: "IN-DL", severity: "high" },
  { id: "TR-2038", timestamp: "2m ago",   impersonated: "Deloitte",                   vector: "Email",     technique: "PDF offer with @gmail.com HR contact",     region: "US-NY", severity: "medium" },
  { id: "TR-2037", timestamp: "3m ago",   impersonated: "Accenture",                  vector: "Telegram", technique: "Crypto payment for 'background check'",     region: "IN-TS", severity: "critical" },
  { id: "TR-2036", timestamp: "4m ago",   impersonated: "Google",                     vector: "Video Call", technique: "Deepfake recruiter, asked for Aadhaar",   region: "IN-MH", severity: "critical" },
  { id: "TR-2035", timestamp: "6m ago",   impersonated: "Wipro",                      vector: "SMS",      technique: "Shortlink to credential-harvest page",      region: "IN-TN", severity: "high" },
  { id: "TR-2034", timestamp: "8m ago",   impersonated: "Microsoft",                  vector: "Email",     technique: "Spoofed sender, urgency 24h deadline",     region: "GB-LDN", severity: "medium" },
  { id: "TR-2033", timestamp: "11m ago",  impersonated: "Capgemini",                  vector: "WhatsApp", technique: "Fake offer ₹14L for fresher, no JD",        region: "IN-PB", severity: "high" },
  { id: "TR-2032", timestamp: "14m ago",  impersonated: "JP Morgan",                  vector: "LinkedIn", technique: "Profile age 3 days, generic JD copy",       region: "SG",    severity: "medium" },
  { id: "TR-2031", timestamp: "17m ago",  impersonated: "Flipkart",                   vector: "Email",     technique: "Attachment .docm with macro payload",      region: "IN-KA", severity: "critical" },
  { id: "TR-2030", timestamp: "21m ago",  impersonated: "Goldman Sachs",              vector: "Email",     technique: "DKIM fail, replied-to free mail",          region: "IN-MH", severity: "high" },
];
