import React from "react";

/* Drives the gold reading-progress bar in the masthead. Writes straight to
   the DOM node instead of through state: this fires on every scroll frame,
   and a re-render per frame would make the whole page janky. */
export function useScrollProgress(barRef, topRef, showTopAfter = 600) {
  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY || doc.scrollTop || 0;
      if (barRef.current) barRef.current.style.width = Math.min(100, (y / max) * 100) + "%";
      if (topRef.current) {
        const on = y > showTopAfter;
        topRef.current.style.opacity = on ? "1" : "0";
        topRef.current.style.pointerEvents = on ? "auto" : "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [barRef, topRef, showTopAfter]);
}

/* Marks the nav link for whichever section currently occupies the middle
   band of the viewport. The rootMargin crops the observer to that band so a
   section only counts as "current" once it is genuinely being read. */
export function useScrollSpy(ids) {
  const [active, setActive] = React.useState(null);
  React.useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, [ids.join(",")]);
  return active;
}

/* State that survives a reload. Used for the standing calculator so a
   student can come back to the figures they entered. A blocked or full
   localStorage must not take the page down, hence the try/catch on both
   sides. */
export function usePersistentState(key, initial) {
  const [value, setValue] = React.useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? { ...initial, ...JSON.parse(saved) } : initial;
    } catch {
      return initial;
    }
  });
  const write = React.useCallback(
    (next) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* private browsing or quota exceeded: the page still works, the
           figures just will not survive a reload. */
      }
    },
    [key]
  );
  return [value, write];
}
