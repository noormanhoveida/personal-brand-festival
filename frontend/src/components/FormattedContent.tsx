import React from 'react';
import DOMPurify from 'dompurify';

interface FormattedContentProps {
  content?: string | null;
  className?: string;
}

export function FormattedContent({ content, className = '' }: FormattedContentProps) {
  if (!content) return null;

  // بررسی اینکه آیا محتوا تگ HTML دارد یا نه
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    return (
      <div
        className={`whitespace-pre-wrap leading-relaxed text-slate-200 ${className}`}
        dir="rtl"
      >
        {content}
      </div>
    );
  }

  // پاک‌سازی امن HTML و پالایش تگ‌های خالی
  const cleanHtml = DOMPurify.sanitize(content, {
    ADD_ATTR: ['style', 'dir'],
  });

  return (
    <div
      dir="rtl"
      className={`prose prose-invert max-w-none text-slate-200 leading-relaxed [&>p]:mb-2 [&_p]:text-slate-200 [&_span]:text-slate-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
