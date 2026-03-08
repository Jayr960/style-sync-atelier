import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const paintStreaks = [
  { color: "hsl(340, 70%, 55%)", top: "22%", height: 6, delay: 0.8, width: "58%" },
  { color: "hsl(28, 85%, 58%)",  top: "35%", height: 10, delay: 1.0, width: "62%" },
  { color: "hsl(200, 75%, 52%)", top: "46%", height: 14, delay: 1.15, width: "55%" },
  { color: "hsl(45, 90%, 55%)",  top: "58%", height: 8, delay: 1.3, width: "50%" },
  { color: "hsl(160, 55%, 45%)", top: "68%", height: 5, delay: 1.45, width: "45%" },
];

// Small droplets that appear at the impact point
function ImpactDrops({ color, delay, cx, cy }: { color: string; delay: number; cx: number; cy: number }) {
  const drops = Array.from({ length: 5 }).map((_, i) => {
    const angle = -Math.PI / 3 + (i / 4) * (Math.PI * 0.7);
    const dist = 12 + i * 6;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, r: 2 + Math.random() * 2.5 };
  });

  return (
    <>
      {drops.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.x} cy={d.y} r={d.r}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 0.3, delay: delay + 0.5 + i * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
        />
      ))}
    </>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      {/* Paint streaks from left, stopping at center text */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600">
          {paintStreaks.map((s, i) => {
            const yNum = parseFloat(s.top) / 100 * 600;
            const widthNum = parseFloat(s.width) / 100 * 1000;
            const wobble1 = yNum + (i % 2 === 0 ? -4 : 4);
            const wobble2 = yNum + (i % 2 === 0 ? 3 : -3);
            return (
              <g key={i}>
                <motion.path
                  d={`M-20,${yNum} Q${widthNum * 0.3},${wobble1} ${widthNum * 0.6},${wobble2} T${widthNum},${yNum}`}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.height}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.65 }}
                  transition={{ duration: 0.9, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Thinner accent line */}
                <motion.path
                  d={`M-20,${yNum + 1} Q${widthNum * 0.35},${wobble1 - 1} ${widthNum * 0.65},${wobble2 + 1} T${widthNum + 10},${yNum}`}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.height * 0.3}
                  strokeLinecap="round"
                  opacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: s.delay + 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
                <ImpactDrops color={s.color} delay={s.delay} cx={widthNum + 5} cy={yNum} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[10px] sm:text-xs font-mono tracking-[0.4em] uppercase mb-6"
          style={{ color: "hsl(0 0% 40%)" }}
        >
          AI-Powered Wardrobe
        </motion.p>

        {/* 3D Title — centered */}
        <div style={{ perspective: "1000px" }}>
          <motion.h1
            initial={{ opacity: 0, rotateY: -6, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-[-0.05em] leading-[0.82] text-primary-foreground select-none"
            style={{
              transformStyle: "preserve-3d",
              textShadow: "0 1px 0 hsl(0 0% 75%), 0 2px 0 hsl(0 0% 65%), 0 3px 0 hsl(0 0% 55%), 0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            STYLE
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, rotateY: 4, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-[-0.05em] leading-[0.82] select-none"
            style={{
              transformStyle: "preserve-3d",
              WebkitTextStroke: "1.5px hsl(0 0% 45%)",
              color: "transparent",
            }}
          >
            SYNC
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="mt-10 text-sm sm:text-base max-w-xs font-light leading-relaxed"
          style={{ color: "hsl(0 0% 50%)" }}
        >
          Your wardrobe, reimagined.<br />
          AI-powered outfit creation from your own closet.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="mt-8 flex items-center gap-3"
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

      {/* Scroll */}
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
