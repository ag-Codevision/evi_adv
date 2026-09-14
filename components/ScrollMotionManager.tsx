'use client';

import { useEffect } from 'react';

export default function ScrollMotionManager() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const motionElements = Array.from(document.querySelectorAll<HTMLElement>('.motion-item'));
    if (!motionElements.length) return;

    const nodes = motionElements.map((el) => ({
      el,
      type: el.dataset.motion || 'up',
      current: -1,
      target: 0,
    }));

    let isRunning = false;

    function updateTargets() {
      const wh = window.innerHeight;
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const isNearDocBottom = (docHeight - scrollBottom) < 140;

      const bottomThreshold = 0.95;
      const centerThreshold = 0.40;
      const span = bottomThreshold - centerThreshold;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rect = node.el.getBoundingClientRect();
        const relY = rect.top / wh;

        let p = (bottomThreshold - relY) / span;
        if (isNearDocBottom && rect.top < wh) {
          p = 1;
        } else if (p < 0) {
          p = 0;
        } else if (p > 1) {
          p = 1;
        }
        node.target = p;
      }
    }

    function tick() {
      const isMobile = window.innerWidth <= 768;
      const xDist = isMobile ? 75 : 160;
      const yDist = isMobile ? 38 : 65;
      let hasDelta = false;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.current === -1) {
          node.current = node.target;
        } else {
          const diff = node.target - node.current;
          if (Math.abs(diff) > 0.001) {
            node.current += diff * 0.16;
            hasDelta = true;
          } else {
            node.current = node.target;
          }
        }

        const p = node.current;
        const inv = 1 - p;

        let transform = '';
        if (node.type === 'left') {
          transform = `translate3d(${(-xDist * inv).toFixed(2)}px, 0, 0)`;
        } else if (node.type === 'right') {
          transform = `translate3d(${(xDist * inv).toFixed(2)}px, 0, 0)`;
        } else {
          transform = `translate3d(0, ${(yDist * inv).toFixed(2)}px, 0)`;
        }

        const opacity = (0.05 + 0.95 * p).toFixed(3);
        node.el.style.transform = transform;
        node.el.style.opacity = opacity;
      }

      if (hasDelta) {
        requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    }

    function trigger() {
      updateTargets();
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(tick);
      }
    }

    window.addEventListener('scroll', trigger, { passive: true });
    window.addEventListener('resize', trigger, { passive: true });

    trigger();
    const t1 = setTimeout(trigger, 100);
    const t2 = setTimeout(trigger, 400);

    return () => {
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('resize', trigger);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
