import React, { createContext, useContext } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface DynamicTextCtx {
  textColor: MotionValue<string>;
  textColorMuted: MotionValue<string>;
}

const DynamicTextContext = createContext<DynamicTextCtx | null>(null);

export const useDynamicText = () => useContext(DynamicTextContext)!;

export const DynamicBackground = ({ children }: { children: React.ReactNode }) => {
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 1],
    ['#0a0a0a', '#e5e5e5', '#ffffff']
  );

  // Text should be the inverse of the background:
  // dark bg  → white text
  // light bg → black text
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2],
    ['#ffffff', '#ffffff', '#000000']
  );

  const textColorMuted = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2],
    ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(0,0,0,0.6)']
  );

  return (
    <DynamicTextContext.Provider value={{ textColor, textColorMuted }}>
      <motion.div
        style={{ backgroundColor }}
        className="fixed inset-0 -z-20 transition-colors duration-300"
      />
      {children}
    </DynamicTextContext.Provider>
  );
};
