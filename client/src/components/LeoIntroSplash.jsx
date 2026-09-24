import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const LeoIntroSplash = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if already viewed in this session
    const seenSplash = sessionStorage.getItem('leo_intro_seen');
    if (seenSplash === 'true') {
      setIsVisible(false);
      onComplete && onComplete();
      return;
    }

    // Auto-complete after full cinematic sequence (3.2 seconds)
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3200);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDismiss = () => {
    if (hasDismissed) return;
    setHasDismissed(true);
    sessionStorage.setItem('leo_intro_seen', 'true');
    setIsVisible(false);
    setTimeout(() => {
      onComplete && onComplete();
    }, 700);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="leo-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[100] bg-[#050505] text-[#F7F5F0] flex flex-col items-center justify-center overflow-hidden cursor-pointer selection:bg-transparent select-none"
          onClick={handleDismiss}
        >
          {/* Subtle Ambient Golden Radial Glow */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{
              scale: [0.7, 1.2, 1.05],
              opacity: [0, 0.45, 0.25]
            }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#C5A880]/30 via-[#C5A880]/10 to-transparent blur-[120px] pointer-events-none"
          />

          {/* Background Atmospheric Grain & Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

          {/* Center Logo & Crest Container */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
            {/* Golden Animated Halo Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-8"
            >
              {/* Outer Golden Glow Ring */}
              <div className="absolute -inset-3 rounded-full border border-[#C5A880]/30 animate-pulse-subtle" />
              <div className="absolute -inset-1 rounded-full border border-[#C5A880]/60" />

              {/* LEO Brand Logo Emblem */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black p-2 shadow-[0_0_50px_rgba(197,168,128,0.25)] border border-[#C5A880]/40 overflow-hidden relative"
              >
                <img
                  src="/logo.png"
                  alt="LEO Crest"
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />

                {/* Light Glint Sweep Across Logo */}
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={{ x: '150%', opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.6, delay: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-25 pointer-events-none"
                />
              </motion.div>
            </motion.div>

            {/* Typography Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <motion.span
                initial={{ letterSpacing: '0.15em', opacity: 0 }}
                animate={{ letterSpacing: '0.4em', opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block font-editorial text-4xl sm:text-6xl md:text-7xl font-light text-white uppercase tracking-[0.4em]"
              >
                LEO
              </motion.span>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.0, delay: 1.0, ease: "easeInOut" }}
                className="w-32 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-[10px] sm:text-xs tracking-[0.45em] uppercase text-[#C5A880] font-light"
              >
                The Art of Sovereign Luxury
              </motion.p>
            </motion.div>

            {/* Enter / Skip CTA */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mt-12 group flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-white/60 hover:text-[#C5A880] transition-colors py-2 px-5 border border-white/10 hover:border-[#C5A880]/40 rounded-full backdrop-blur-sm"
            >
              <span>Enter Atelier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Bottom Audio/Key Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="absolute bottom-6 text-[9px] uppercase tracking-[0.25em] text-white/30 font-light"
          >
            Press <kbd className="px-1.5 py-0.5 border border-white/20 text-white/50">ESC</kbd> or click to explore
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
