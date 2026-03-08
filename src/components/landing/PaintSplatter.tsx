import { motion } from "framer-motion";

interface SplatterProps {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  rotation?: number;
}

const splatterPaths = [
  "M50,10 C80,5 95,25 90,50 C85,75 65,95 40,90 C15,85 5,65 10,40 C15,20 30,12 50,10 Z",
  "M45,5 C70,0 100,20 95,45 C90,70 75,100 45,95 C20,90 0,70 5,45 C10,20 25,8 45,5 Z",
  "M55,8 C85,15 98,40 88,65 C78,90 50,100 25,88 C5,75 0,45 15,25 C30,5 45,3 55,8 Z",
  "M40,3 C65,0 90,15 95,40 C100,65 85,90 60,97 C35,100 10,85 5,60 C0,35 15,10 40,3 Z",
];

const drips = [
  "M45,85 Q47,110 44,130 Q42,140 45,145",
  "M55,90 Q57,115 54,135 Q52,145 55,150",
  "M35,80 Q33,100 36,120 Q38,130 35,135",
];

export function PaintSplatter({ color, size, x, y, delay, rotation = 0 }: SplatterProps) {
  const pathIndex = Math.floor(delay * 10) % splatterPaths.length;
  const dripIndex = Math.floor(delay * 10) % drips.length;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ scale: 0, opacity: 0, rotate: rotation - 20 }}
      animate={{ scale: 1, opacity: 0.85, rotate: rotation }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
        {/* Main splatter blob */}
        <motion.path
          d={splatterPaths[pathIndex]}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        />
        {/* Drip */}
        <motion.path
          d={drips[dripIndex]}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.2, delay: delay + 0.5, ease: "easeOut" }}
        />
        {/* Small droplets */}
        {[
          { cx: 15, cy: 20, r: 3 },
          { cx: 85, cy: 30, r: 2.5 },
          { cx: 75, cy: 80, r: 2 },
          { cx: 20, cy: 75, r: 3.5 },
          { cx: 90, cy: 60, r: 1.5 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx + (Math.random() - 0.5) * 20}
            cy={dot.cy + (Math.random() - 0.5) * 20}
            r={dot.r}
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{
              duration: 0.3,
              delay: delay + 0.3 + i * 0.08,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export function PaintDrip({ color, x, delay }: { color: string; x: string; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: 0 }}
      initial={{ scaleY: 0, opacity: 0, transformOrigin: "top" }}
      animate={{ scaleY: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg width="20" height="120" viewBox="0 0 20 120">
        <path
          d="M10,0 Q10,60 8,80 Q6,100 10,115 Q12,118 10,120"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
