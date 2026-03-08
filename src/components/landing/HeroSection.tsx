import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PaintSplatter } from "./PaintSplatter";

const paintColors = [
  "hsl(28, 80%, 60%)",   // warm orange
  "hsl(340, 65%, 55%)",  // rose
  "hsl(200, 70%, 55%)",  // ocean blue
  "hsl(45, 85%, 60%)",   // golden
  "hsl(160, 50%, 50%)",  // sage
  "hsl(280, 50%, 55%)",  // lavender
  "hsl(15, 75%, 50%)",   // burnt sienna
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* 3D Text Container */}
          <div
            className="relative inline-block"
            style={{ perspective: "1200px" }}
          >
            {/* Paint splatters on text */}
            <PaintSplatter color={paintColors[0]} size={180} x="-5%" y="-15%" delay={0.8} rotation={-15} />
            <PaintSplatter color={paintColors[1]} size={140} x="75%" y="-10%" delay={1.0} rotation={25} />
            <PaintSplatter color={paintColors[2]} size={160} x="40%" y="60%" delay={1.2} rotation={-30} />
            <PaintSplatter color={paintColors[3]} size={120} x="85%" y="50%" delay={1.4} rotation={10} />
            <PaintSplatter color={paintColors[4]} size={100} x="10%" y="70%" delay={1.6} rotation={45} />
            <PaintSplatter color={paintColors[5]} size={130} x="55%" y="-20%" delay={1.1} rotation={-5} />
            <PaintSplatter color={paintColors[6]} size={90} x="25%" y="40%" delay={1.5} rotation={35} />

            {/* Main 3D Title */}
            <motion.h1
              initial={{ opacity: 0, rotateX: 40, y: 80 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-20 text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-primary-foreground"
              style={{
                transformStyle: "preserve-3d",
                textShadow:
                  "0 1px 0 hsl(0 0% 80%), 0 2px 0 hsl(0 0% 70%), 0 3px 0 hsl(0 0% 60%), 0 4px 0 hsl(0 0% 50%), 0 5px 0 hsl(0 0% 40%), 0 8px 15px rgba(0,0,0,0.4)",
              }}
            >
              STYLE
              <br />
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
                style={{
                  WebkitTextStroke: "2px hsl(0 0% 85%)",
                  color: "transparent",
                  textShadow: "none",
                }}
              >
                SYNC
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.8 }}
            className="mt-12 text-lg sm:text-xl max-w-md mx-auto font-light tracking-wide"
            style={{ color: "hsl(0 0% 60%)" }}
          >
            Your wardrobe, reimagined. AI-powered outfit creation
            from your own closet.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth?mode=signup"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-foreground text-foreground font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 font-medium tracking-wide transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              style={{ color: "hsl(0 0% 70%)" }}
            >
              Explore Shop
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1 h-1 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
