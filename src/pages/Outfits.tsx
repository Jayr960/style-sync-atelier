import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Filter, Shuffle, Loader2, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type OccasionType = "work" | "casual" | "events" | "gym" | "date_night" | "travel" | "formal";

const occasions: { value: OccasionType | "all"; label: string }[] = [
  { value: "all", label: "All Occasions" },
  { value: "work", label: "Work" },
  { value: "casual", label: "Casual" },
  { value: "date_night", label: "Date Night" },
  { value: "events", label: "Events" },
  { value: "formal", label: "Formal" },
];

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  tags: string[];
}

interface GeneratedOutfit {
  id: string;
  name: string;
  description: string;
  items: WardrobeItem[];
  occasion: OccasionType;
}

const outfitNames = [
  "Metropolitan Chic",
  "Weekend Wanderer",
  "Power Move",
  "Effortless Edge",
  "Urban Sophisticate",
  "Minimal Maven",
  "Street Style Star",
  "Classic Refined",
];

const outfitDescriptions = [
  "A perfectly balanced ensemble that transitions seamlessly from day to evening.",
  "Relaxed yet refined, this combination speaks to understated confidence.",
  "Bold choices that command attention while maintaining elegance.",
  "Where comfort meets style in the most unexpected ways.",
  "Timeless pieces combined for a fresh, modern look.",
];

export default function Outfits() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [generatedOutfits, setGeneratedOutfits] = useState<GeneratedOutfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState<OccasionType | "all">("all");

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
      const [itemsResult, outfitsResult] = await Promise.all([
        supabase.from("wardrobe_items").select("*"),
        supabase.from("saved_outfits").select("*"),
      ]);

      if (itemsResult.data) {
        setWardrobeItems(itemsResult.data as WardrobeItem[]);
      }
      if (outfitsResult.data) {
        setSavedOutfits(outfitsResult.data.map((o: any) => o.id));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateOutfits = async () => {
    if (wardrobeItems.length < 3) {
      toast({
        title: "Need more items",
        description: "Add at least 3 items to your wardrobe to generate outfits.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    // Simulate AI generation with random combinations
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const tops = wardrobeItems.filter((i) => i.category === "tops");
    const bottoms = wardrobeItems.filter((i) => i.category === "bottoms");
    const shoes = wardrobeItems.filter((i) => i.category === "shoes");
    const outerwear = wardrobeItems.filter((i) => i.category === "outerwear");
    const accessories = wardrobeItems.filter((i) => i.category === "accessories");

    const newOutfits: GeneratedOutfit[] = [];
    const occasionOptions: OccasionType[] = ["work", "casual", "date_night", "events"];

    for (let i = 0; i < 4; i++) {
      const outfitItems: WardrobeItem[] = [];
      
      if (tops.length) outfitItems.push(tops[Math.floor(Math.random() * tops.length)]);
      if (bottoms.length) outfitItems.push(bottoms[Math.floor(Math.random() * bottoms.length)]);
      if (shoes.length) outfitItems.push(shoes[Math.floor(Math.random() * shoes.length)]);
      if (outerwear.length && Math.random() > 0.5) {
        outfitItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
      }
      if (accessories.length && Math.random() > 0.5) {
        outfitItems.push(accessories[Math.floor(Math.random() * accessories.length)]);
      }

      if (outfitItems.length >= 2) {
        newOutfits.push({
          id: `generated-${Date.now()}-${i}`,
          name: outfitNames[Math.floor(Math.random() * outfitNames.length)],
          description: outfitDescriptions[Math.floor(Math.random() * outfitDescriptions.length)],
          items: outfitItems,
          occasion: occasionOptions[Math.floor(Math.random() * occasionOptions.length)],
        });
      }
    }

    setGeneratedOutfits(newOutfits);
    setGenerating(false);
  };

  const saveOutfit = async (outfit: GeneratedOutfit) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("saved_outfits")
        .insert({
          user_id: user.id,
          name: outfit.name,
          description: outfit.description,
          item_ids: outfit.items.map((i) => i.id),
          occasion: outfit.occasion,
        })
        .select()
        .single();

      if (error) throw error;

      setSavedOutfits([...savedOutfits, data.id]);
      toast({
        title: "Outfit saved",
        description: "This outfit has been added to your favorites.",
      });
    } catch (error) {
      console.error("Error saving outfit:", error);
      toast({
        title: "Error",
        description: "Could not save the outfit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredOutfits = activeOccasion === "all"
    ? generatedOutfits
    : generatedOutfits.filter((o) => o.occasion === activeOccasion);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppLayout showFooter={false}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            Outfit Generator
          </h1>
          <p className="text-muted-foreground">
            AI-powered outfit combinations from your wardrobe
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          <button
            onClick={generateOutfits}
            disabled={generating || wardrobeItems.length < 3}
            className="btn-primary !px-6 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            Generate Outfits
          </button>

          {generatedOutfits.length > 0 && (
            <button
              onClick={generateOutfits}
              disabled={generating}
              className="btn-secondary !px-6 !py-3"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle
            </button>
          )}
        </motion.div>

        {/* Occasion filters */}
        {generatedOutfits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {occasions.map((occ) => (
              <button
                key={occ.value}
                onClick={() => setActiveOccasion(occ.value)}
                className={cn("tag", activeOccasion === occ.value && "tag-active")}
              >
                {occ.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Generated outfits */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
            ))}
          </div>
        ) : wardrobeItems.length < 3 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Add more items</h3>
            <p className="text-muted-foreground mb-6">
              You need at least 3 items in your wardrobe to generate outfits
            </p>
            <button
              onClick={() => navigate("/wardrobe")}
              className="btn-primary"
            >
              Go to Wardrobe
            </button>
          </motion.div>
        ) : generatedOutfits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Ready to style</h3>
            <p className="text-muted-foreground">
              Click "Generate Outfits" to create personalized combinations
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOutfits.map((outfit, index) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{outfit.name}</h3>
                      <span className="text-xs text-muted-foreground capitalize">
                        {outfit.occasion.replace("_", " ")}
                      </span>
                    </div>
                    <button
                      onClick={() => saveOutfit(outfit)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        savedOutfits.includes(outfit.id)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      )}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          savedOutfits.includes(outfit.id) && "fill-current"
                        )}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    {outfit.description}
                  </p>

                  {/* Outfit items grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {outfit.items.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square rounded-xl overflow-hidden bg-secondary"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Item names */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {outfit.items.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs text-muted-foreground"
                      >
                        {item.name}
                        {outfit.items.indexOf(item) < outfit.items.length - 1 && " • "}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
