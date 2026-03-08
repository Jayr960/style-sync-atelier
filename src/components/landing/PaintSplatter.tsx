import { motion } from "framer-motion";

interface SplatterProps {
  color: string;
  y: string;
  delay: number;
  size: number;
  spread: number;
}

export function PaintStream({ color, y, delay, size, spread }: SplatterProps) {
  return (
    <motion.div
      className="absolute left-0 pointer-events-none"
      style={{ top: y, height: size }}
    >
      {/* Main paint streak coming from left */}
      <svg
        className="absolute left-0"
        width="110%"
        height={size}
        viewBox={`0 0 1200 ${size}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        {/* Main horizontal streak */}
        <motion.path
          d={`M-100,${size / 2} Q200,${size / 2 - spread} 500,${size / 2 + spread * 0.3} T900,${size / 2 - spread * 0.5} T1200,${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.6}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Thinner overlay for depth */}
        <motion.path
          d={`M-100,${size / 2 + 2} Q250,${size / 2 - spread * 0.5} 550,${size / 2 + spread * 0.2} T950,${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.25}
          strokeLinecap="round"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Impact splatter on text area */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: "55%", top: -size * 0.5 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 0.4, delay: delay + 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg width={size * 3} height={size * 3} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
          {/* Splatter drops on impact */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 0.6 - Math.PI * 0.3;
            const dist = 20 + Math.random() * 25;
            const cx = 50 + Math.cos(angle) * dist;
            const cy = 50 + Math.sin(angle) * dist;
            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={1.5 + Math.random() * 3}
                fill={color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{
                  duration: 0.3,
                  delay: delay + 0.7 + i * 0.05,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              />
            );
          })}
        </svg>
      </motion.div>
    </motion.div>
  );
}
