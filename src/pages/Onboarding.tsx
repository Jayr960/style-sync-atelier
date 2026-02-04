import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type StyleType = "minimalist" | "streetwear" | "business_casual" | "boho" | "vintage" | "athleisure" | "classic" | "edgy";
type OccasionType = "work" | "casual" | "events" | "gym" | "date_night" | "travel" | "formal";

const styleTypes: { value: StyleType; label: string; description: string; emoji: string }[] = [
  { value: "minimalist", label: "Minimalist", description: "Clean lines, neutral colors, less is more", emoji: "🤍" },
  { value: "streetwear", label: "Streetwear", description: "Urban, casual, bold graphics and logos", emoji: "🔥" },
  { value: "business_casual", label: "Business Casual", description: "Professional yet relaxed and approachable", emoji: "💼" },
  { value: "boho", label: "Boho", description: "Free-spirited, earthy, flowing fabrics", emoji: "🌿" },
  { value: "vintage", label: "Vintage", description: "Retro-inspired, classic silhouettes", emoji: "✨" },
  { value: "athleisure", label: "Athleisure", description: "Sporty, comfortable, gym-to-street ready", emoji: "🏃" },
  { value: "classic", label: "Classic", description: "Timeless pieces, elegant and refined", emoji: "👔" },
  { value: "edgy", label: "Edgy", description: "Bold, unconventional, statement pieces", emoji: "⚡" },
];

const occasionTypes: { value: OccasionType; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "casual", label: "Casual" },
  { value: "events", label: "Events" },
  { value: "gym", label: "Gym" },
  { value: "date_night", label: "Date Night" },
  { value: "travel", label: "Travel" },
  { value: "formal", label: "Formal" },
];

const colorPalettes = [
  { name: "Neutrals", colors: ["#FAFAFA", "#E5E5E5", "#A3A3A3", "#525252", "#171717"] },
  { name: "Earth Tones", colors: ["#FEF3C7", "#D4A574", "#92716B", "#6B4C3F", "#422006"] },
  { name: "Cool Blues", colors: ["#DBEAFE", "#93C5FD", "#3B82F6", "#1E40AF", "#1E3A8A"] },
  { name: "Warm Reds", colors: ["#FEE2E2", "#FCA5A5", "#EF4444", "#B91C1C", "#7F1D1D"] },
  { name: "Forest", colors: ["#DCFCE7", "#86EFAC", "#22C55E", "#15803D", "#14532D"] },
];

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  const [selectedStyles, setSelectedStyles] = useState<StyleType[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionType[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const toggleStyle = (style: StyleType) => {
    setSelectedStyles(
      selectedStyles.includes(style)
        ? selectedStyles.filter((s) => s !== style)
        : [...selectedStyles, style]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    );
  };

  const toggleOccasion = (occasion: OccasionType) => {
    setSelectedOccasions(
      selectedOccasions.includes(occasion)
        ? selectedOccasions.filter((o) => o !== occasion)
        : [...selectedOccasions, occasion]
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedStyles.length > 0;
    if (step === 2) return selectedColors.length > 0;
    if (step === 3) return selectedOccasions.length > 0;
    return true;
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { error: prefError } = await supabase
        .from("style_preferences")
        .update({
          style_types: selectedStyles,
          color_preferences: selectedColors,
          occasions: selectedOccasions,
        })
        .eq("user_id", user.id);

      if (prefError) throw prefError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Style profile created!",
        description: "We'll use this to personalize your experience.",
      });
      
      navigate("/wardrobe");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Could not save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12">
      {/* Floating gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent-warm/20 blur-gradient animate-float"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-accent/30 blur-gradient animate-float-slow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            <button
              onClick={() => navigate("/wardrobe")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8"
            >
              <h1 className="text-2xl font-light tracking-tight mb-2">
                What's your style?
              </h1>
              <p className="text-muted-foreground mb-8">
                Select all the aesthetics that resonate with you
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {styleTypes.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => toggleStyle(style.value)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedStyles.includes(style.value)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xl">{style.emoji}</span>
                      <span className="font-medium">{style.label}</span>
                      {selectedStyles.includes(style.value) && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">{style.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8"
            >
              <h1 className="text-2xl font-light tracking-tight mb-2">
                Your color palette
              </h1>
              <p className="text-muted-foreground mb-8">
                What colors do you usually reach for?
              </p>

              <div className="space-y-6">
                {colorPalettes.map((palette) => (
                  <div key={palette.name}>
                    <p className="text-sm font-medium mb-3">{palette.name}</p>
                    <div className="flex gap-3">
                      {palette.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={cn(
                            "w-12 h-12 rounded-xl border-2 transition-all hover:scale-105",
                            selectedColors.includes(color)
                              ? "border-primary scale-110 shadow-lg"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {selectedColors.includes(color) && (
                            <Check className={cn(
                              "w-5 h-5 mx-auto",
                              parseInt(color.slice(1), 16) > 0x888888 ? "text-foreground" : "text-white"
                            )} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8"
            >
              <h1 className="text-2xl font-light tracking-tight mb-2">
                What occasions do you dress for?
              </h1>
              <p className="text-muted-foreground mb-8">
                This helps us suggest the right outfits for your lifestyle
              </p>

              <div className="flex flex-wrap gap-3">
                {occasionTypes.map((occasion) => (
                  <button
                    key={occasion.value}
                    onClick={() => toggleOccasion(occasion.value)}
                    className={cn(
                      "px-6 py-3 rounded-xl border text-sm font-medium transition-all",
                      selectedOccasions.includes(occasion.value)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    )}
                  >
                    {occasion.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={cn(
              "btn-secondary !px-6 !py-3",
              step === 1 && "opacity-0 pointer-events-none"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="btn-primary !px-8 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || saving}
              className="btn-primary !px-8 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
