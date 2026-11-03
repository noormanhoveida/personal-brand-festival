import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SponsorItem } from "../types/sponsor";
import { Card } from "./ui";

interface Props {
  sponsors: SponsorItem[];
  autoPlayInterval?: number;
}

export function SponsorBannerSlider({ sponsors, autoPlayInterval = 7000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!sponsors || sponsors.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [sponsors, autoPlayInterval]);

  if (!sponsors || sponsors.length === 0) return null;

  const current = sponsors[currentIndex];

  const getYouTubeEmbedUrl = (url: string) => {
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})/
    );
    return ytMatch && ytMatch[1] ? `https://www.youtube.com/embed/${ytMatch[1]}` : null;
  };

  const isVideo = current.slideType === "video";
  const ytEmbed = isVideo ? getYouTubeEmbedUrl(current.slideMediaUrl) : null;

  return (
    <div className="my-6 w-full">
      <Card className="glass relative overflow-hidden border border-opacity-20 p-2 sm:p-4 shadow-lg transition-all">
        <div className="relative overflow-hidden rounded-xl bg-black/60 min-h-[180px] sm:min-h-[240px]">
          {isVideo ? (
            <div className="relative aspect-video w-full max-h-[340px]">
              {ytEmbed ? (
                <iframe
                  src={ytEmbed}
                  title={current.name}
                  className="absolute inset-0 h-full w-full border-0 rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={current.slideMediaUrl}
                  controls
                  className="h-full w-full object-cover rounded-xl"
                  playsInline
                />
              )}
            </div>
          ) : (
            <Link
              to={`/sponsors/${current.slug}`}
              className="block w-full h-full relative group cursor-pointer"
            >
              <img
                src={current.slideMediaUrl}
                alt={current.name}
                className="w-full h-44 sm:h-60 object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 rounded-xl">
                <span className="text-[10px] text-[var(--accent)] font-semibold tracking-wider uppercase mb-1">
                  حامی جشنواره / کسب‌وکار
                </span>
                <h4 className="font-bold text-base sm:text-lg text-white group-hover:underline">
                  {current.name}
                </h4>
                {current.tagline && (
                  <p className="text-xs text-gray-200 mt-1 line-clamp-1 opacity-90">
                    {current.tagline}
                  </p>
                )}
              </div>
            </Link>
          )}

          {/* دکمه اختصاصی لینک مستقیم خارجی (سایت، اینستاگرام و ...) */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            {current.externalLink && (
              <a
                href={current.externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-md transition hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--bg)",
                }}
              >
                <span>{current.externalLink.label}</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            )}

            {isVideo && (
              <Link
                to={`/sponsors/${current.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition"
              >
                صفحه معرفی ←
              </Link>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="opacity-50">اسپانسرها و حامیان</span>
            {isVideo && (
              <Link
                to={`/sponsors/${current.slug}`}
                className="font-medium text-[var(--accent)] hover:underline truncate max-w-[200px]"
              >
                {current.name}
              </Link>
            )}
          </div>
          {sponsors.length > 1 && (
            <div className="flex items-center gap-1.5">
              {sponsors.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? "w-6 bg-[var(--accent)]" : "w-2 bg-white/30"
                  }`}
                  aria-label={`اسلاید ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
