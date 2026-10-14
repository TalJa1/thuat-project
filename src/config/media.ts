export const BUCKET = "main-ada2c.firebasestorage.app";
export const BASE_PATH = "Thuat/"; // case-sensitive; keep the trailing slash

export const IMAGES = {
  "logo": "logo.png",
  "hero": "hero.JPG",
  "story": "story.JPG",
  "tinhhoa-1": "tinhhoa-1.png",
  "tinhhoa-2": "tinhhoa-2.png",
  "saovang-1": "saovang-1.png",
  "saovang-2": "saovang-2.png",
  "combo": "combo.png",
  "charity-1": "charity-1.jpg",
  "charity-2": "charity-2.jpg",
  "charity-3": "charity-3.jpg",
  "charity-4": "charity-4.jpg"
} as const;

export const PENDING_IMAGES: string[] = []; // keys listed here are not requested and show the placeholder

// If a configured image fails (wrong extension/case), try the same base name with these extensions before giving up.
export const FALLBACK_EXTENSIONS = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".webp"];

export type ImageKey = keyof typeof IMAGES;

export function storageUrl(fileName: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(BASE_PATH + fileName)}?alt=media`;
}

/** Every file name worth trying for a key: the configured one first, then the same base name with each fallback extension. */
export function candidateFiles(key: ImageKey): string[] {
  const configured = IMAGES[key];
  const dot = configured.lastIndexOf(".");
  const base = dot > 0 ? configured.slice(0, dot) : configured;
  const rest = FALLBACK_EXTENSIONS.map((ext) => base + ext).filter((name) => name !== configured);
  return [configured, ...rest];
}

export function isPending(key: string): boolean {
  return PENDING_IMAGES.includes(key) || !(key in IMAGES);
}
