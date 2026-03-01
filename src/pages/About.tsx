import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { AsymmetricalSection } from '../components/AsymmetricalSection';
import { useSmoothScroll } from '../components/SmoothScroll';

export const About = () => {
  const timeline = [
    { year: '2018', event: 'Founded Colebank Studio in Berlin.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000' },
    { year: '2019', event: 'First major industrial project in Hamburg.', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000' },
    { year: '2020', event: 'Shifted focus to Industrial Brutalism.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000' },
    { year: '2021', event: 'Collaborated with global tech giants.', img: 'https://images.unsplash.com/photo-1518005020250-675f0f0fd13b?auto=format&fit=crop&q=80&w=1000' },
    { year: '2022', event: 'Awarded "Design of the Year" for Iron Pulse.', img: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1000' },
    { year: '2023', event: 'Exhibited at the Berlin Design Week.', img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=1000' },
    { year: '2024', event: 'Global expansion of visual engineering.', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000' },
  ];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const smoothY = useSmoothScroll();
  const fallbackY = useMotionValue(0);
  const activeY = smoothY ?? fallbackY;

  // Refs so the useTransform mappers always read the latest values without
  // needing the function reference to change.
  const wrapperTopRef = useRef(0);
  const scrollDistanceRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        // Absolute position in scroll-space = screen position + current smoothY offset
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0);
      }
      if (horizontalRef.current) {
        const dist = Math.max(0, horizontalRef.current.scrollWidth - window.innerWidth);
        scrollDistanceRef.current = dist;
        setScrollDistance(dist);
      }
    };

    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [smoothY]);

  // Counter-translate to keep the pinned section at the top of the viewport
  // while smoothY is moving through the horizontal scroll range.
  //
  // Math: SmoothScroll applies translateY(-smoothY) to the whole content.
  // An element at natural position T appears at screen-Y = T - smoothY.
  // Adding pinY = smoothY - T gives screen-Y = 0 (pinned at top).
  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current;
    const D = scrollDistanceRef.current;
    if (D === 0) return 0;
    if (y <= T) return 0;                // before: flow normally
    if (y >= T + D) return D;            // after: release, scroll off upward
    return y - T;                        // during: stay pinned at screen top
  });

  // Drive horizontal movement 1-to-1 with vertical scroll progress
  const x = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current;
    const D = scrollDistanceRef.current;
    if (D === 0) return 0;
    if (y <= T) return 0;
    if (y >= T + D) return -D;
    return -(y - T);
  });

  return (
    <div className="pt-40">
      <div className="px-8 mb-32">
        <DeBlurText className="text-[12vw] mb-8 leading-none mix-blend-difference">
          Devon<br /><span className="text-neon-pink">Colebank</span>
        </DeBlurText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
          <div className="space-y-8">
            <TextReveal
              as="p"
              text="Devon Colebank is a visionary visual engineer whose work exists at the intersection of industrial architecture and digital precision. With over a decade of experience in Berlin's creative scene, he has pioneered a style known as 'Industrial Brutalism'—a design philosophy that celebrates raw materials, structural honesty, and high-impact spatial logic."
              className="text-2xl font-light leading-relaxed text-white/80 mix-blend-difference"
            />
          </div>
          <div className="space-y-8 text-white/40 leading-relaxed mix-blend-difference">
            <p className="text-white/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p className="text-white/60">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
            </p>
            <div className="pt-8 flex gap-12">
              <div>
                <h4 className="text-neon-pink text-[10px] uppercase tracking-widest font-bold mb-2">Location</h4>
                <p className="text-white">Berlin, Germany</p>
              </div>
              <div>
                <h4 className="text-neon-pink text-[10px] uppercase tracking-widest font-bold mb-2">Focus</h4>
                <p className="text-white">Visual Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline Section
          Height = scrollDistance + 100vh so the section enters naturally,
          pins for the full horizontal scroll, then releases and exits. */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `calc(${scrollDistance}px + 100vh)` }}
      >
        <motion.div style={{ y: pinY }} className="h-screen flex items-center overflow-hidden">
          <motion.div ref={horizontalRef} style={{ x }} className="flex gap-24 px-8">
            {timeline.map((item) => (
              <div key={item.year} className="w-[85vw] md:w-[45vw] flex-shrink-0">
                <div className="relative aspect-[16/10] overflow-hidden group">
                  <img
                    src={item.img}
                    alt={item.year}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <span className="text-8xl font-black massive-text text-neon-pink drop-shadow-2xl">{item.year}</span>
                  </div>
                </div>
                <div className="mt-12 pr-12 mix-blend-difference">
                  <TextReveal text={item.event} className="text-4xl font-bold uppercase tracking-tight" />
                  <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=1200"
        title="Structural Integrity"
        subtitle="Past Projects"
        align="right"
      />

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200"
        title="Digital Blueprint"
        subtitle="Visual Engineering"
        align="left"
      />
    </div>
  );
};
