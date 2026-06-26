export const site = {
  name:
    process.env.NEXT_PUBLIC_SITE_NAME ??
    "Durst Solutions",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://jordandurst.com",

  email:
    process.env.NEXT_PUBLIC_SITE_EMAIL ??
    "contact@jordandurst.com",

  phone:
    process.env.NEXT_PUBLIC_PHONE ??
    "Not Available",

  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ??
    "Modern Websites • Automation • AI Solutions",

  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "Durst Solutions helps local businesses look more professional, save time, and generate more leads through modern websites, automation, and AI tools.",
};