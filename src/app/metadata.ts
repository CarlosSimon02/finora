import { env } from "@/config/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL;

const siteName = "Finora";
const siteDescription = `${siteName} is a personal finance management tool that helps you track your income and expenses, set budgets, and save for your future.`;

export const metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  generator: "Next.js",
  applicationName: siteName,
  keywords: [
    "personal finance",
    "finance management",
    "budgeting",
    "saving",
    "investing",
    "financial planning",
    "money management",
    "finora",
    "finora app",
    "finora website",
    "finora blog",
    "finora news",
    "finora updates",
    "finora features",
    "finora benefits",
  ],

  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: `${siteUrl}`,
    siteName: siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: siteName,
  },
};
