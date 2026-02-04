import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Heart, Palette, Loader2, ArrowLeft, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type StyleType = "minimalist" | "streetwear" | "business_casual" | "boho" | "vintage" | "athleisure" | "classic" | "edgy";
type OccasionType = "work" | "casual" | "events" | "gym" | "date_night" | "travel" | "formal";

const styleTypes: { value: StyleType; label: string; description: string }[] = [
  { value: "minimalist", label: "Minimalist", description: "Clean lines, neutral colors" },
  { value: "streetwear", label: "Streetwear", description: "Urban, casual, bold" },
  { value: "business_casual", label: "Business Casual", description: "Professional yet relaxed" },
  { value: "boho", label: "Boho", description: "Free-spirited, earthy" },
  { value: "vintage", label: "Vintage", description: "Retro, classic styles" },
  { value: "athleisure", label: "Athleisure", description: "Sporty, comfortable" },
  { value: "classic", label: "Classic", description: "Timeless, elegant" },
  { value: "edgy", label: "Edgy", description: "Bold, unconventional" },
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

const colorOptions = [
  { name: "Neutral", colors: ["#F5F5F5", "#D4D4D4", "#737373", "#262626"] },
  { name: "Earth Tones", colors: ["#D4A574", "#A3826A", "#7C6354", "#5C4033"] },
  { name: "Cool Blues", colors: ["#BFDBFE", "#60A5FA", "#2563EB", "#1E40AF"] },
  { name: "Warm Tones", colors: ["#FED7AA", "#FB923C", "#EA580C", "#C2410C"] },
  { name: "Greens", colors: ["#BBF7D0", "#4ADE80", "#16A34A", "#166534"] },
];

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<StyleType[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionType[]>([]);
  const [savedOutfitsCount, setSavedOutfitsCount] = useState(0);
  const [wardrobeCount, setWardrobeCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileResult, preferencesResult, outfitsResult, wardrobeResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
        supabase.from("style_preferences").select("*").eq("user_id", user!.id).single(),
        supabase.from("saved_outfits").select("id").eq("user_id", user!.id),
        supabase.from("wardrobe_items").select("id").eq("user_id", user!.id),
      ]);

      if (profileResult.data) {
        setDisplayName(profileResult.data.display_name || "");
      }
      
      if (preferencesResult.data) {
        setSelectedStyles((preferencesResult.data.style_types as StyleType[]) || []);
        setSelectedColors(preferencesResult.data.color_preferences || []);
        setSelectedOccasions((preferencesResult.data.occasions as OccasionType[]) || []);
      }
      
      setSavedOutfitsCount(outfitsResult.data?.length || 0);
      setWardrobeCount(wardrobeResult.data?.length || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const savePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      const { error: prefError } = await supabase
        .from("style_preferences")
        .update({
          style_types: selectedStyles,
          color_preferences: selectedColors,
          occasions: selectedOccasions,
        })
        .eq("user_id", user.id);

      if (prefError) throw prefError;

      toast({
        title: "Preferences saved",
        description: "Your style preferences have been updated.",
      });
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppLayout showFooter={false}>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            Profile
          </h1>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={cn("tag", activeTab === "profile" && "tag-active")}
          >
            <User className="w-4 h-4 mr-1" />
            Account
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={cn("tag", activeTab === "preferences" && "tag-active")}
          >
            <Palette className="w-4 h-4 mr-1" />
            Style Preferences
          </button>
        </motion.div>

        {activeTab === "profile" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* User info */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Account Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-light mb-1">{wardrobeCount}</p>
                <p className="text-sm text-muted-foreground">Wardrobe Items</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-light mb-1">{savedOutfitsCount}</p>
                <p className="text-sm text-muted-foreground">Saved Outfits</p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="btn-secondary w-full text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Style Types */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Your Style</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select all that describe your personal style
              </p>
              <div className="grid grid-cols-2 gap-3">
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{style.label}</span>
                      {selectedStyles.includes(style.value) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Preferences */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Color Preferences</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select colors you typically wear
              </p>
              <div className="space-y-4">
                {colorOptions.map((palette) => (
                  <div key={palette.name}>
                    <p className="text-sm font-medium mb-2">{palette.name}</p>
                    <div className="flex gap-2">
                      {palette.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            selectedColors.includes(color)
                              ? "border-primary scale-110"
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Occasions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                What do you typically dress for?
              </p>
              <div className="flex flex-wrap gap-2">
                {occasionTypes.map((occasion) => (
                  <button
                    key={occasion.value}
                    onClick={() => toggleOccasion(occasion.value)}
                    className={cn("tag", selectedOccasions.includes(occasion.value) && "tag-active")}
                  >
                    {occasion.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={savePreferences}
              disabled={saving}
              className="btn-primary w-full disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save Preferences"
              )}
            </button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
