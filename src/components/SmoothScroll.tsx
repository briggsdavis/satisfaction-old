import React, { useRef, useEffect, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'motion/react';

const SmoothScrollContext = createContext<MotionValue<number> | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight);
    });
    observer.observe(el);
    setContentHeight(el.scrollHeight);

    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    damping: 20,
    stiffness: 80,
    mass: 1,
    restDelta: 0.001
  });

  const transform = useTransform(smoothY, (y) => -y);

  return (
    <SmoothScrollContext.Provider value={smoothY}>
      <>
        <div style={{ height: contentHeight }} />
        <motion.div
          ref={scrollRef}
          style={{ y: transform }}
          className="fixed top-0 left-0 w-full will-change-transform z-[2]"
        >
          {children}
        </motion.div>
      </>
    </SmoothScrollContext.Provider>
  );
};
