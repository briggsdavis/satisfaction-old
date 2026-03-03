import { useEffect, useRef } from 'react';
import { playClick } from '../lib/audioClick';

/**
 * GlobalHoverSounds
 * Mounts a single document-level `mouseover` listener that plays a tactile
 * click sound whenever the pointer enters a new <button> or .btn-industrial
 * element.  Nav links (inside <nav>) are intentionally excluded — Navbar.tsx
 * handles those with the deeper playNavClick sound.
 */
export const GlobalHoverSounds = () => {
  // Track the last button the cursor was over to avoid re-firing when
  // moving across child elements within the same button.
  const lastButton = useRef<Element | null>(null);

  useEffect(() => {
    const handleMouseOver = async (e: MouseEvent) => {
      const target = e.target as Element;

      // Resolve the nearest interactive surface
      const btn =
        target.closest('button') ??
        target.closest<Element>('a.btn-industrial') ??
        target.closest<Element>('[class*="btn-industrial"]');

      // Nav links have their own sound — skip everything inside <nav>
      const inNav = !!target.closest('nav');

      if (btn && !inNav) {
        if (btn !== lastButton.current) {
          lastButton.current = btn;
          playClick();
        }
      } else if (!btn) {
        lastButton.current = null;
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return null;
};
