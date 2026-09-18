"use client";

import { useEffect } from "react";

export default function HomeInteractions() {
  useEffect(() => {
    const header = document.getElementById("siteHeader");
    if (!header) return; // marketing markup not present (shouldn't happen)

    function onScroll() {
      header!.classList.toggle("scrolled", window.scrollY > 40);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const sheet = document.getElementById("mobileSheet")!;
    const openBtn = document.getElementById("menuOpen")!;
    const closeBtn = document.getElementById("menuClose")!;
    function openSheet() {
      sheet.classList.add("open");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeSheet() {
      sheet.classList.remove("open");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    openBtn.addEventListener("click", openSheet);
    closeBtn.addEventListener("click", closeSheet);
    const sheetLinks = Array.from(sheet.querySelectorAll("a"));
    sheetLinks.forEach((a) => a.addEventListener("click", closeSheet));

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia?.("(pointer: fine)").matches;

    const progressEl = document.getElementById("scrollProgress")!;
    function updateProgress() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progressEl.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    document.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    const preloader = document.getElementById("preloader")!;
    let statsIO: IntersectionObserver | undefined;
    let revealIO: IntersectionObserver | undefined;

    function stagger(containerSelector: string, itemSelector: string, step: number) {
      document.querySelectorAll(containerSelector).forEach((container) => {
        Array.from(container.querySelectorAll<HTMLElement>(itemSelector)).forEach((el, i) => {
          el.style.transitionDelay = i * step + "ms";
        });
      });
    }

    function startReveal() {
      try {
        const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
        if ("IntersectionObserver" in window) {
          revealIO = new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (en.isIntersecting) {
                  en.target.classList.add("is-visible");
                  revealIO!.unobserve(en.target);
                }
              });
            },
            { threshold: 0.15 },
          );
          revealEls.forEach((el) => revealIO!.observe(el));
        } else {
          revealEls.forEach((el) => el.classList.add("is-visible"));
        }
      } catch {
        /* ignore */
      }
    }

    function finishLoad() {
      preloader.classList.add("done");
      document.body.classList.add("loaded");
      startReveal();
    }
    let loadTimer: ReturnType<typeof setTimeout> | undefined;
    function onWindowLoad() {
      loadTimer = setTimeout(finishLoad, prefersReduced ? 0 : 450);
    }
    if (document.readyState === "complete") {
      onWindowLoad();
    } else {
      window.addEventListener("load", onWindowLoad);
    }

    let rafId: number | undefined;
    let onMouseMove: ((e: MouseEvent) => void) | undefined;
    let onMouseOver: ((e: MouseEvent) => void) | undefined;
    let onMouseOut: ((e: MouseEvent) => void) | undefined;

    if (hasFinePointer && !prefersReduced) {
      document.body.classList.add("has-fine-pointer");
      const cDot = document.getElementById("cursorDot")!;
      const cRing = document.getElementById("cursorRing")!;
      let mx = innerWidth / 2,
        my = innerHeight / 2,
        rx = mx,
        ry = my;
      onMouseMove = (e) => {
        mx = e.clientX;
        my = e.clientY;
        cDot.style.left = mx + "px";
        cDot.style.top = my + "px";
      };
      document.addEventListener("mousemove", onMouseMove);
      function loop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        cRing.style.left = rx + "px";
        cRing.style.top = ry + "px";
        rafId = requestAnimationFrame(loop);
      }
      loop();
      onMouseOver = (e) => {
        if ((e.target as HTMLElement).closest("a, button, .chip label")) cRing.classList.add("hovering");
      };
      onMouseOut = (e) => {
        if ((e.target as HTMLElement).closest("a, button, .chip label")) cRing.classList.remove("hovering");
      };
      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseout", onMouseOut);
    }

    const magneticCleanups: (() => void)[] = [];
    if (hasFinePointer && !prefersReduced) {
      document.querySelectorAll<HTMLElement>(".btn-gold").forEach((btn) => {
        const move = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          btn.style.transform = `translate(${(x * 0.16).toFixed(1)}px,${(y * 0.32).toFixed(1)}px)`;
        };
        const leave = () => {
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
        magneticCleanups.push(() => {
          btn.removeEventListener("mousemove", move);
          btn.removeEventListener("mouseleave", leave);
        });
      });
    }

    let heroCleanup: (() => void) | undefined;
    if (hasFinePointer && !prefersReduced) {
      const heroWrap = document.querySelector<HTMLElement>(".hero-media");
      const heroPh = heroWrap?.querySelector<HTMLElement>(".ph");
      if (heroWrap && heroPh) {
        const move = (e: MouseEvent) => {
          const r = heroWrap.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          heroPh.style.transform = `rotateY(${(px * 7).toFixed(2)}deg) rotateX(${(py * -7).toFixed(2)}deg) scale(1.02)`;
        };
        const leave = () => {
          heroPh.style.transform = "";
        };
        heroWrap.addEventListener("mousemove", move);
        heroWrap.addEventListener("mouseleave", leave);
        heroCleanup = () => {
          heroWrap.removeEventListener("mousemove", move);
          heroWrap.removeEventListener("mouseleave", leave);
        };
      }
    }

    function animateCount(el: HTMLElement) {
      const target = parseFloat(el.dataset.target || "0");
      const decimals = +(el.dataset.decimals || 0);
      const pad = +(el.dataset.pad || 0);
      if (prefersReduced) {
        el.textContent = pad ? String(target).padStart(pad, "0") : target.toFixed(decimals);
        return;
      }
      const start = performance.now();
      const dur = 1300;
      function tick(now: number) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = pad ? String(Math.round(val)).padStart(pad, "0") : val.toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const statsEl = document.querySelector<HTMLElement>(".hero-stats");
    if (statsEl && "IntersectionObserver" in window) {
      statsIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              statsEl.querySelectorAll<HTMLElement>(".count").forEach(animateCount);
              statsIO!.disconnect();
            }
          });
        },
        { threshold: 0.4 },
      );
      statsIO.observe(statsEl);
    }

    stagger("#serviceList", ".service-row", 70);
    stagger(".barber-grid", ".barber-card", 90);
    stagger(".why-list", "li", 80);

    // comparador antes / después
    const wrap = document.getElementById("compareSlider");
    const handle = document.getElementById("compareHandle");
    let onPointerDown: ((e: PointerEvent) => void) | undefined;
    let onPointerMove: ((e: PointerEvent) => void) | undefined;
    let onPointerUp: (() => void) | undefined;
    let onKeydown: ((e: KeyboardEvent) => void) | undefined;
    if (wrap && handle) {
      let dragging = false;
      const setPos = (pct: number) => {
        pct = Math.max(0, Math.min(100, pct));
        wrap.style.setProperty("--pos", pct + "%");
        handle.setAttribute("aria-valuenow", String(Math.round(pct)));
      };
      const posFromEvent = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        const x = e.clientX - r.left;
        return (x / r.width) * 100;
      };
      onPointerDown = (e) => {
        dragging = true;
        wrap.setPointerCapture(e.pointerId);
        setPos(posFromEvent(e));
      };
      onPointerMove = (e) => {
        if (dragging) setPos(posFromEvent(e));
      };
      onPointerUp = () => {
        dragging = false;
      };
      onKeydown = (e) => {
        const current = parseFloat(wrap.style.getPropertyValue("--pos")) || 50;
        if (e.key === "ArrowLeft") {
          setPos(current - 5);
          e.preventDefault();
        } else if (e.key === "ArrowRight") {
          setPos(current + 5);
          e.preventDefault();
        } else if (e.key === "Home") {
          setPos(0);
          e.preventDefault();
        } else if (e.key === "End") {
          setPos(100);
          e.preventDefault();
        }
      };
      wrap.addEventListener("pointerdown", onPointerDown);
      wrap.addEventListener("pointermove", onPointerMove);
      wrap.addEventListener("pointerup", onPointerUp);
      wrap.addEventListener("pointercancel", onPointerUp);
      handle.addEventListener("keydown", onKeydown);
    }

    return () => {
      document.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", updateProgress);
      openBtn.removeEventListener("click", openSheet);
      closeBtn.removeEventListener("click", closeSheet);
      sheetLinks.forEach((a) => a.removeEventListener("click", closeSheet));
      window.removeEventListener("load", onWindowLoad);
      if (loadTimer) clearTimeout(loadTimer);
      if (onMouseMove) document.removeEventListener("mousemove", onMouseMove);
      if (onMouseOver) document.removeEventListener("mouseover", onMouseOver);
      if (onMouseOut) document.removeEventListener("mouseout", onMouseOut);
      if (rafId) cancelAnimationFrame(rafId);
      magneticCleanups.forEach((fn) => fn());
      heroCleanup?.();
      statsIO?.disconnect();
      revealIO?.disconnect();
      if (wrap && onPointerDown && onPointerMove && onPointerUp) {
        wrap.removeEventListener("pointerdown", onPointerDown);
        wrap.removeEventListener("pointermove", onPointerMove);
        wrap.removeEventListener("pointerup", onPointerUp);
        wrap.removeEventListener("pointercancel", onPointerUp);
      }
      if (handle && onKeydown) handle.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return null;
}
