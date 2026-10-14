import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, motion, ScrollTrigger, EASE, EASE_IN_OUT } from "../lib/motion";
import { getLenis } from "../lib/scroll";
import { ALT, BRAND, UI } from "../data/content";
import Img from "./Img";
import JoinButton from "./JoinButton";
import DrumMedallion from "./DrumMedallion";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  // Hide on scroll down, return on scroll up; turn into a blurred paper bar after the hero.
  useLayoutEffect(() => {
    const el = header.current;
    if (!el) return;
    return motion(el, () => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const hide = !openRef.current && y > 240 && self.direction === 1;
          el.classList.toggle("is-hidden", hide);
        },
      });
      ScrollTrigger.create({
        trigger: document.getElementById("top"),
        start: "bottom top+=90",
        onEnter: () => el.classList.add("is-solid"),
        onLeaveBack: () => el.classList.remove("is-solid"),
      });
    });
  }, []);

  // Unlock synchronously so the anchor scroll that follows this click is not swallowed by a stopped Lenis.
  const close = useCallback(() => {
    getLenis()?.start();
    document.documentElement.classList.remove("is-locked");
    setOpen(false);
  }, []);
  const wasOpen = useRef(false);

  // Menu open/close animation, scroll lock and focus management.
  useEffect(() => {
    openRef.current = open;
    const panel = menu.current;
    if (!panel) return;
    const lenis = getLenis();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const links = panel.querySelectorAll(".menu__item");

    if (open) {
      wasOpen.current = true;
      header.current?.classList.remove("is-hidden");
      lenis?.stop();
      document.documentElement.classList.add("is-locked");
      gsap.killTweensOf([panel, links]);
      if (reduce) {
        gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      } else {
        gsap.set(panel, { autoAlpha: 1 });
        gsap.fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE_IN_OUT });
        gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: EASE, delay: 0.35 });
      }
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
          return;
        }
        if (e.key !== "Tab") return;
        const items = [toggle.current, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(Boolean) as HTMLElement[];
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }

    lenis?.start();
    document.documentElement.classList.remove("is-locked");
    gsap.killTweensOf([panel, links]);
    if (wasOpen.current) {
      if (reduce) gsap.to(panel, { autoAlpha: 0, duration: 0.25 });
      else
        gsap.to(panel, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.7,
          ease: EASE_IN_OUT,
          onComplete: () => {
            gsap.set(panel, { autoAlpha: 0 });
          },
        });
      wasOpen.current = false;
    }
  }, [open]);

  // Close the overlay when the viewport grows past the mobile layout.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 900px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const onToggle = () => {
    if (open) toggle.current?.focus();
    setOpen(!open);
  };

  return (
    <>
      <header ref={header} className={`header ${open ? "is-open" : ""}`}>
        <div className="header__inner">
          <a className="brand" href="#top" onClick={close}>
            <span className="brand__badge">
              <Img name="logo" alt={ALT.logo} fit="cover" priority />
            </span>
            <span className="brand__name">{BRAND.name}</span>
          </a>

          <nav className="nav" aria-label="Điều hướng chính">
            <ul>
              {UI.nav.map((item) => (
                <li key={item.href}>
                  <a className="link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__cta">
            <JoinButton variant="outline" size="sm" />
          </div>

          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={onToggle}
          >
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="menu"
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <div className="menu__drum" aria-hidden="true">
          <DrumMedallion />
        </div>
        <nav className="menu__nav" aria-label="Điều hướng di động">
          <ul>
            {UI.nav.map((item) => (
              <li key={item.href} className="menu__mask">
                <a className="menu__item" href={item.href} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__foot">
          <JoinButton variant="light" onClick={close} />
          <p className="menu__tagline">{BRAND.tagline}</p>
        </div>
      </div>
    </>
  );
}
