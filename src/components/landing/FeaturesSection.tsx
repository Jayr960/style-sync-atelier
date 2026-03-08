import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, Sparkles, ShoppingBag, Palette } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Digital Wardrobe",
    description: "Upload your closet. Organize by category, color, season.",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "AI Styling",
    description: "Get outfit combos that match your taste and occasion.",
    number: "02",
  },
  {
    icon: Palette,
    title: "Style DNA",
    description: "Build your unique style profile. We learn what you love.",
    number: "03",
  },
  {
    icon: ShoppingBag,
    title: "Smart Shop",
    description: "Discover pieces that actually fit your existing wardrobe.",
    number: "04",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-16"
        >
          What we do
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background p-8 lg:p-10 group hover:bg-secondary/50 transition-colors duration-500"
            >
              <span className="text-xs font-mono text-muted-foreground/50">{feature.number}</span>
              <div className="mt-6 mb-4 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
