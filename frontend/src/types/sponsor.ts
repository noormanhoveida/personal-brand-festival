export interface SponsorItem {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  slideType: "image" | "video";
  slideMediaUrl: string;
  externalLink?: {
    label: string;
    url: string;
  };
  coverImageUrl?: string;
  fullDescription: string;
  socials?: {
    website?: string;
    instagram?: string;
    linkedin?: string;
    telegram?: string;
  };
}
