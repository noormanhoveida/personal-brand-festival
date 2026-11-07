import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { env } from "./env";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Local disk storage for development (spec §38 — production storage
 * must be configurable via env; STORAGE_DRIVER is already documented
 * in .env.example for a future S3-compatible driver, this is the
 * "local" branch of that switch).
 */
const uploadDir = path.resolve(process.cwd(), env.storageLocalPath);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("نوع فایل مجاز نیست. فقط JPEG، PNG یا WebP مجاز است."));
      return;
    }
    cb(null, true);
  },
});

export const uploadDirAbsolutePath = uploadDir;

// Weekly-challenge submissions allow documents too (not just images),
// since participants submit work as text/photo/document/link — same
// local-disk storage, wider MIME allowlist, larger size cap.
const CHALLENGE_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
];
const CHALLENGE_MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 20MB

export const challengeUpload = multer({
  storage,
  limits: { fileSize: CHALLENGE_MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip", ".mp4", ".webm", ".mov", ".m4v", ".avi", ".mkv"];
    
    if (!CHALLENGE_ALLOWED_MIME_TYPES.includes(file.mimetype) && !allowedExts.includes(ext)) {
      cb(new Error("نوع فایل مجاز نیست."));
      return;
    }
    cb(null, true);
  },
});

// Bootcamp teaser media (admin-uploaded cover image + optional teaser
// video shown on the bootcamp card). Video files run much larger than
// anything else uploaded in this app, hence the bigger cap.
const BOOTCAMP_MEDIA_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES,
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
const BOOTCAMP_MEDIA_MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024; // 150MB

export const bootcampMediaUpload = multer({
  storage,
  limits: { fileSize: BOOTCAMP_MEDIA_MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!BOOTCAMP_MEDIA_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("نوع فایل مجاز نیست. فقط عکس یا ویدیو (mp4/webm/mov) مجاز است."));
      return;
    }
    cb(null, true);
  },
});

// Teaser video upload for hero section (up to 60MB, matching nginx)
export const heroVideoUpload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("فقط فرمت‌های ویدیویی (MP4, WebM, QuickTime) مجاز هستند"));
    }
  },
});

// Business Showcase (ویترین کسب‌وکارها) — video intro upload.
// Dedicated uploader so the 50MB / 60s policy stays isolated from
// other modules and can be tuned without touching them.
const BUSINESS_VIDEO_ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
const BUSINESS_VIDEO_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const businessVideoUpload = multer({
  storage,
  limits: { fileSize: BUSINESS_VIDEO_MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!BUSINESS_VIDEO_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("نوع فایل مجاز نیست. فقط ویدیو با فرمت MP4، WebM یا MOV مجاز است."));
      return;
    }
    cb(null, true);
  },
});
