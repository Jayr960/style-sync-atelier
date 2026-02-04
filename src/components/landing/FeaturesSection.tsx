import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, Sparkles, ShoppingBag, Palette } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Digital Wardrobe",
    description: "Upload your entire closet and organize everything in one beautiful space. Tag by category, color, and occasion.",
  },
  {
    icon: Sparkles,
    title: "AI Outfit Generator",
    description: "Get personalized outfit suggestions powered by AI that understands your style preferences and occasion needs.",
  },
  {
    icon: Palette,
    title: "Style Profile",
    description: "Tell us your aesthetic, from minimalist to maximalist. We'll curate recommendations that match your vibe.",
  },
  {
    icon: ShoppingBag,
    title: "Smart Shopping",
    description: "Discover pieces that perfectly complement your existing wardrobe. No more impulse buys that don't match.",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card-hover p-8 sm:p-10"
    >
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
        <feature.icon className="w-6 h-6 text-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export function FeaturesSection() {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 gradient-subtle" />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-6">
            Everything you need to{" "}
            <span className="font-medium">elevate your style</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From organizing your closet to discovering new pieces, 
            StyleSync is your complete fashion companion.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
