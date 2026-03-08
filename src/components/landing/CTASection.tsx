import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-40 bg-foreground overflow-hidden">
      {/* Accent paint stroke */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 0.08 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-0 right-0 h-32 -translate-y-1/2 origin-left"
        style={{ background: "linear-gradient(90deg, hsl(28, 80%, 60%), hsl(340, 65%, 55%), hsl(200, 70%, 55%))" }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-primary-foreground mb-6"
        >
          Ready?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg max-w-sm mx-auto mb-10"
          style={{ color: "hsl(0 0% 55%)" }}
        >
          Join thousands already styling smarter with StyleSync.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/auth?mode=signup"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-foreground text-foreground font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
