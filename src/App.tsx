import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { ColumnWipe } from './components/ColumnWipe';
import { SmoothScroll } from './components/SmoothScroll';
import { Hero, ProjectShowcase, BrandMarquee, ServiceTrinity } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';

import { Footer } from './components/Footer';
import { DynamicBackground } from './components/DynamicBackground';

const Home = () => (
  <>
    <Hero />
    <ProjectShowcase />
    <BrandMarquee />
    <ServiceTrinity />
  </>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const gridOpacity = useTransform(scrollYProgress, [0, 0.2], [0.1, 0.3]);
  const lineColor = useTransform(scrollYProgress, [0, 0.2], ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.1)']);

  return (
    <Router>
      <DynamicBackground>
        <CustomCursor />
        <motion.div
          style={{ opacity: gridOpacity }}
          className="industrial-grid fixed inset-0 pointer-events-none"
        />

        {/* Column Lines — z-[1] keeps them above the background but below page content (z-[2]) */}
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="column-line"
            style={{
              left: `${(100 / 6) * i}%`,
              backgroundColor: lineColor
            }}
          />
        ))}

        <Navbar />

        <ColumnWipe>
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
          </SmoothScroll>
        </ColumnWipe>
      </DynamicBackground>
    </Router>
  );
}
