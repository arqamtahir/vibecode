/**
 * AlgoCrew agency data - powers the CTA blocks and the tech-stack marquee.
 * Vibecode is a lead-gen funnel for AlgoCrew; these are the conversion assets.
 */

/** The two destinations every CTA points to. */
export const agencyUrls = {
  /** Primary brand link. */
  home: "https://algocrew.io",
  /** CTA target - where we send qualified leads. */
  contact: "https://algocrew.io/contact",
} as const;

export interface Service {
  name: string;
  /** Short pitch used in CTA cards / tooltips. */
  blurb: string;
}

export const services: Service[] = [
  { name: "Web Development", blurb: "Fast, accessible, SEO-ready web apps and sites." },
  { name: "App Development", blurb: "Native and cross-platform mobile apps that ship." },
  { name: "Custom Software", blurb: "Bespoke systems built around your workflow." },
  { name: "MVP Development", blurb: "Validate your idea with a lean, investable MVP." },
  { name: "SaaS Development", blurb: "Multi-tenant SaaS platforms built to scale." },
  { name: "Cloud & DevOps", blurb: "CI/CD, IaC, and resilient cloud infrastructure." },
  { name: "UX/UI Design", blurb: "Research-driven interfaces that convert." },
  { name: "E-commerce", blurb: "High-converting storefronts and marketplaces." },
  { name: "Data & AI", blurb: "Data pipelines, analytics, and ML in production." },
  { name: "Generative AI", blurb: "LLM apps, agents, and RAG tailored to your domain." },
  { name: "Blockchain / Web3", blurb: "Smart contracts, dApps, and on-chain systems." },
  { name: "AR / VR / XR", blurb: "Immersive experiences across headsets and mobile." },
  { name: "Gaming", blurb: "Unity and Unreal games from prototype to launch." },
  { name: "D365 & Power Apps", blurb: "Dynamics 365 and low-code business solutions." },
  { name: "Cybersecurity & QA", blurb: "Audits, pen-testing, and automated quality assurance." },
  { name: "Staff Augmentation", blurb: "Senior engineers embedded in your team, fast." },
];

/** Tech-stack marquee - logos/labels scrolled across CTA and homepage sections. */
export const techStack: string[] = [
  "React",
  "Next.js",
  "Vue",
  "Nuxt",
  "Node",
  "Nest",
  "Angular",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Django",
  "Rails",
  "Kotlin",
  "React Native",
  "Flutter",
  "Laravel",
  ".NET",
  "FastAPI",
  "GraphQL",
  "Go",
  "Microservices",
  "Unity",
  "Unreal",
  "Swift",
];
