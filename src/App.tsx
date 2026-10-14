import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "./lib/motion";
import { initThemeShift } from "./lib/themes";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { UI } from "./data/content";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Collection from "./components/Collection";
import Charity from "./components/Charity";
import Footer from "./components/Footer";
import LotusDivider from "./components/LotusDivider";
import ScrollProgress from "./components/ScrollProgress";
import Cursor from "./components/Cursor";

export default function App() {
  const reduced = useReducedMotion();
  // Under reduced motion there is no preloader: the hero is revealed straight away.
  const [preloading, setPreloading] = useState(!reduced);
  const [revealed, setRevealed] = useState(reduced);

  useSmoothScroll(reduced);
  useLayoutEffect(() => initThemeShift(), []);

  // Web fonts change line lengths; re-measure every trigger once they are in.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return () => {
      alive = false;
    };
  }, []);

  const onReveal = useCallback(() => setRevealed(true), []);
  const onDone = useCallback(() => setPreloading(false), []);

  return (
    <>
      <a className="skip-link" href="#noi-dung">
        {UI.skip}
      </a>
      {preloading && !reduced && <Preloader onReveal={onReveal} onDone={onDone} />}
      <Header />
      <main id="noi-dung" tabIndex={-1}>
        <Hero revealed={revealed || reduced} />
        <Story />
        <LotusDivider />
        <Collection />
        <LotusDivider />
        <Charity />
      </main>
      <Footer />
      <ScrollProgress />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
