import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PaintStream } from "./PaintSplatter";

const paintStreams = [
  { color: "hsl(340, 70%, 55%)", y: "18%", delay: 0.9, size: 18, spread: 8 },
  { color: "hsl(28, 85%, 58%)", y: "38%", delay: 1.1, size: 14, spread: 6 },
  { color: "hsl(200, 75%, 52%)", y: "55%", delay: 1.3, size: 20, spread: 10 },
  { color: "hsl(45, 90%, 55%)", y: "72%", delay: 1.5, size: 12, spread: 5 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      {/* Paint streams from left */}
      <div className="absolute inset-0 z-10">
        {paintStreams.map((stream, i) => (
          <PaintStream key={i} {...stream} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Small label */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[10px] sm:text-xs font-mono tracking-[0.4em] uppercase mb-8"
            style={{ color: "hsl(0 0% 40%)" }}
          >
            AI-Powered Wardrobe
          </motion.p>

          {/* 3D Title */}
          <div style={{ perspective: "1000px" }}>
            <motion.h1
              initial={{ opacity: 0, rotateY: -8, x: -60 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] font-black tracking-[-0.06em] leading-[0.8] text-primary-foreground select-none"
              style={{
                transformStyle: "preserve-3d",
                textShadow: "0 1px 0 hsl(0 0% 75%), 0 2px 0 hsl(0 0% 65%), 0 3px 0 hsl(0 0% 55%), 0 6px 20px rgba(0,0,0,0.35)",
              }}
            >
              STYLE
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, rotateY: 5, x: 60 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] font-black tracking-[-0.06em] leading-[0.8] select-none"
              style={{
                transformStyle: "preserve-3d",
                WebkitTextStroke: "1.5px hsl(0 0% 45%)",
                color: "transparent",
              }}
            >
              SYNC
            </motion.h1>
          </div>

          {/* Bottom row: subtitle + CTA */}
          <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="text-sm sm:text-base max-w-xs font-light leading-relaxed"
              style={{ color: "hsl(0 0% 50%)" }}
            >
              Your wardrobe, reimagined.<br />
              AI-powered outfit creation from your own closet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/auth?mode=signup"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-foreground text-foreground text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-white/15 text-sm font-medium tracking-wide transition-all duration-300 hover:border-white/30 hover:bg-white/5"
                style={{ color: "hsl(0 0% 55%)" }}
              >
                Explore
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase" style={{ color: "hsl(0 0% 30%)" }}>
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-white/15 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
