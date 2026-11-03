import { SponsorItem } from "../types/sponsor";

export const SPONSORS_DATA: SponsorItem[] = [
  {
    id: "1",
    slug: "sample-tech",
    name: "استودیو برندینگ هوشمند",
    tagline: "همراه شما در ساخت هویت بصری و توسعه برند فردی",
    slideType: "image",
    slideMediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    externalLink: {
      label: "پیج اینستاگرام",
      url: "https://instagram.com",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    fullDescription: `
### درباره استودیو برندینگ
ما در این مجموعه به متخصصان و مدیران کمک می‌کنیم تا ردپای حرفه‌ای خود را در فضای دیجیتال به درستی شکل دهند.

#### خدمات ما:
- طراحی هویت بصری متناسب با تم اختصاصی
- مشاوره استراتژی رسانه‌ای و محتوایی
- پروداکشن ویدیوهای حرفه‌ای معرفی کسب‌وکار
    `,
    socials: {
      website: "https://example.com",
      instagram: "https://instagram.com",
      telegram: "https://t.me",
    },
  },
  {
    id: "2",
    slug: "sample-academy",
    name: "آکادمی رشد و مسیر شغلی",
    tagline: "مشاهده تیزر ویدیویی خدمات معرفی برند و منتورینگ",
    slideType: "video",
    slideMediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    externalLink: {
      label: "ورود به وب‌سایت",
      url: "https://example.com",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
    fullDescription: `
### آکادمی توسعه مهارت‌های فردی
دوره‌های فشرده با رویکرد ورود به بازار کار و ارائه در جشنواره‌ها.
    `,
    socials: {
      website: "https://example.com",
    },
  },
];
