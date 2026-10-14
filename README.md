# THUẬT PROJECT

One-page website for THUẬT PROJECT: Vietnamese-heritage insulated bottles whose sales fund a charity trip to the Thị Nghè Nursing Home.

Stack: React 19 + TypeScript + Vite, GSAP (ScrollTrigger, SplitText) and Lenis. No router, no UI kit.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run lint
npm run preview  # serve dist/ locally
```

## Where things live

| What | File |
| --- | --- |
| All visible copy (client text, verbatim) and alt text | `src/data/content.ts` |
| Image file names and the Firebase Storage folder | `src/config/media.ts` |
| Order / donation link | `src/config/links.ts` |
| Chapter colours (paper → indigo → vermilion → paper → ink) | `src/lib/themes.ts` |
| Shared easing, durations, media queries | `src/lib/motion.ts` |
| Design tokens, type scale, layout | `src/index.css` |

## Images (Firebase Storage)

Images are loaded from public Firebase Storage URLs. The Firebase SDK is not used:

```
https://firebasestorage.googleapis.com/v0/b/<BUCKET>/o/<encodeURIComponent(BASE_PATH + fileName)>?alt=media
```

To change the folder or a file name, edit `src/config/media.ts`:

- `BASE_PATH` is the folder. It is case-sensitive and keeps its trailing slash, e.g. `"Thuat/"`.
- `IMAGES` maps each slot (`hero`, `story`, `tinhhoa-1`…) to a file name inside that folder. Case matters: `hero.JPG` ≠ `hero.jpg`.
- `PENDING_IMAGES` lists slot keys that should not be requested yet; they show the "Ảnh đang được cập nhật" placeholder.
- `FALLBACK_EXTENSIONS`: if a configured file fails, the same base name is tried with each of these extensions before the placeholder is shown. In development the console logs which fallback name was used.

> As of the last check, the bucket holds `tinhhoa-1.jpg`, `tinhhoa-2.jpg` and `combo.jpg`, while the config lists `.png` for those three. They load through the fallback (one wasted 404 each). To skip the 404s, change those three entries to `.jpg`.

### Optimize images (recommended before launch)

Several originals are very large (hero and story ≈ 4032 px wide, 1.2–1.6 MB; product PNGs 1–1.8 MB). Before uploading final versions:

1. Resize to about **1600–2000 px on the long side** (1200 px is plenty for the charity photos).
2. Export as **WebP** (quality 75–80) or **JPG** (quality 75–80, progressive), aiming for **under ~400 KB** each.
   Product shots have cream backgrounds (no transparency), so JPG/WebP is fine for them too.
3. Upload to the same folder and update the file names in `src/config/media.ts`.

Tools: [Squoosh](https://squoosh.app) (free, in the browser) or any image editor's "Export for web".

## Order / donation link

`src/config/links.ts`:

```ts
export const LINKS = {
  join: "https://…", // the order or donation page
};
```

- Empty (`""`): every "Đồng hành cùng dự án" button smooth-scrolls to the collection (`#bo-suu-tap`).
- Set: those buttons open the URL in a new tab (`rel="noopener noreferrer"`).

## Motion & accessibility notes

- `prefers-reduced-motion: reduce` turns off Lenis, the preloader, parallax, steam, rotation and the marquee. Reveals become short fades and the chapter colours switch instead of scrubbing.
- Touch devices and screens < 900 px get no custom cursor, tilt or magnetism, softer parallax, and 6 steam wisps instead of 16.
- Content is never hidden by CSS. Hidden start states are set by GSAP at runtime, so if an animation fails to run, the text stays visible. The preloader has a JS failsafe and a CSS failsafe and never lasts more than ~2.2 s.

## Deploy to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New… → Project → Import** the repository.
3. Framework Preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. No environment variables are needed.
