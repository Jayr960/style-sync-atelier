import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Plus, Loader2, Trash2, Grid3X3, LayoutList, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type Category = "tops" | "bottoms" | "outerwear" | "shoes" | "accessories";

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: "tops", label: "Tops", emoji: "👕" },
  { value: "bottoms", label: "Bottoms", emoji: "👖" },
  { value: "outerwear", label: "Outerwear", emoji: "🧥" },
  { value: "shoes", label: "Shoes", emoji: "👟" },
  { value: "accessories", label: "Accessories", emoji: "⌚" },
];

interface WardrobeItem {
  id: string;
  name: string;
  category: Category;
  image_url: string;
  tags: string[];
  color: string | null;
  created_at: string;
}

export default function Wardrobe() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [dragActive, setDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<Category>("tops");
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems((data as WardrobeItem[]) || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  }, []);

  const handleFileSelect = (file: File) => {
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setShowUploadModal(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const addTag = () => {
    if (tagInput.trim() && !newItemTags.includes(tagInput.trim())) {
      setNewItemTags([...newItemTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setNewItemTags(newItemTags.filter((t) => t !== tag));

  const handleUpload = async () => {
    if (!uploadFile || !user || !newItemName) {
      toast({ title: "Missing information", description: "Please provide a name.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("wardrobe-images").upload(fileName, uploadFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("wardrobe-images").getPublicUrl(fileName);
      const { data, error } = await supabase
        .from("wardrobe_items")
        .insert({ user_id: user.id, name: newItemName, category: newItemCategory, image_url: publicUrl, tags: newItemTags })
        .select()
        .single();
      if (error) throw error;
      setItems([data as WardrobeItem, ...items]);
      toast({ title: "Item added", description: "Added to your wardrobe." });
      setShowUploadModal(false);
      setUploadPreview(null);
      setUploadFile(null);
      setNewItemName("");
      setNewItemCategory("tops");
      setNewItemTags([]);
    } catch (error) {
      console.error("Error uploading:", error);
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      const path = imageUrl.split("/wardrobe-images/")[1];
      if (path) await supabase.storage.from("wardrobe-images").remove([path]);
      const { error } = await supabase.from("wardrobe_items").delete().eq("id", id);
      if (error) throw error;
      setItems(items.filter((item) => item.id !== id));
      toast({ title: "Deleted", description: "Item removed." });
    } catch (error) {
      console.error("Error deleting:", error);
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const filteredItems = items
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .filter((item) => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

  const categoryCounts = categories.map((c) => ({
    ...c,
    count: items.filter((i) => i.category === c.value).length,
  }));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-foreground">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(0 0% 40%)" }} />
      </div>
    );
  }

  return (
    <AppLayout showFooter={false}>
      <div className="min-h-screen bg-foreground">
        <div className="container mx-auto px-6 py-10">
          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
          >
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2" style={{ color: "hsl(0 0% 35%)" }}>
                Dashboard
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-primary-foreground">
                Wardrobe
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "hsl(0 0% 40%)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2.5 w-48 rounded-xl text-sm bg-white/5 border border-white/10 text-primary-foreground placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              {/* View toggle */}
              <div className="flex rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2.5 transition-colors", viewMode === "grid" ? "bg-white/10 text-primary-foreground" : "text-white/30 hover:text-white/50")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("p-2.5 transition-colors", viewMode === "list" ? "bg-white/10 text-primary-foreground" : "text-white/30 hover:text-white/50")}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
              {/* Upload button */}
              <label
                htmlFor="file-upload-main"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-foreground text-foreground text-sm font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </label>
              <input type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" id="file-upload-main" />
            </div>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10"
          >
            {/* Total */}
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-2xl p-4 border transition-all duration-300 text-left",
                activeCategory === "all"
                  ? "border-white/20 bg-white/10"
                  : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10"
              )}
            >
              <p className="text-2xl font-black text-primary-foreground">{items.length}</p>
              <p className="text-[11px] font-mono tracking-wider uppercase mt-1" style={{ color: "hsl(0 0% 45%)" }}>
                All Items
              </p>
            </button>
            {categoryCounts.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "rounded-2xl p-4 border transition-all duration-300 text-left",
                  activeCategory === cat.value
                    ? "border-white/20 bg-white/10"
                    : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-primary-foreground">{cat.count}</p>
                  <span className="text-lg">{cat.emoji}</span>
                </div>
                <p className="text-[11px] font-mono tracking-wider uppercase mt-1" style={{ color: "hsl(0 0% 45%)" }}>
                  {cat.label}
                </p>
              </button>
            ))}
          </motion.div>

          {/* Drop zone overlay */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="relative"
          >
            <AnimatePresence>
              {dragActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 rounded-2xl border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                    <p className="text-sm font-medium text-primary-foreground">Drop to upload</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid view */}
            {viewMode === "grid" && (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              >
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
                  ))
                ) : (
                  <AnimatePresence>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.03, duration: 0.4 }}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/15 transition-all duration-500"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                        {/* Item info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                          <p className="text-white/50 text-[11px] font-mono uppercase tracking-wider">{item.category}</p>
                        </div>
                        {/* Delete */}
                        <motion.button
                          onClick={() => handleDelete(item.id, item.image_url)}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-black/40 backdrop-blur-sm text-white/70 opacity-0 group-hover:opacity-100 hover:bg-red-500/80 hover:text-white transition-all duration-300"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 text-[10px] font-mono bg-black/40 backdrop-blur-sm text-white/80 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            )}

            {/* List view */}
            {viewMode === "list" && (
              <div className="space-y-2">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
                  ))
                ) : (
                  <AnimatePresence>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className="group flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary-foreground truncate">{item.name}</p>
                          <p className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "hsl(0 0% 45%)" }}>
                            {item.category}
                          </p>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="hidden sm:flex gap-1">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 text-[10px] font-mono bg-white/5 text-white/40 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => handleDelete(item.id, item.image_url)}
                          className="p-2 rounded-lg text-white/20 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            )}
          </div>

          {/* Empty state */}
          {!loading && filteredItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Upload className="w-6 h-6" style={{ color: "hsl(0 0% 35%)" }} />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">No items yet</h3>
              <p className="text-sm mb-6" style={{ color: "hsl(0 0% 40%)" }}>
                Start by uploading your first piece
              </p>
              <label
                htmlFor="file-upload-empty"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground text-foreground text-sm font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </label>
              <input type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" id="file-upload-empty" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[hsl(0,0%,10%)] p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-primary-foreground">Add New Item</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadPreview && (
                <div className="aspect-square rounded-xl overflow-hidden bg-white/5 mb-6 border border-white/5">
                  <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase mb-2" style={{ color: "hsl(0 0% 45%)" }}>
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Black Silk Blouse"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-primary-foreground placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase mb-2" style={{ color: "hsl(0 0% 45%)" }}>
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setNewItemCategory(cat.value)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-medium border transition-all duration-200",
                          newItemCategory === cat.value
                            ? "border-white/25 bg-white/10 text-primary-foreground"
                            : "border-white/5 bg-white/[0.03] text-white/40 hover:bg-white/[0.06]"
                        )}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase mb-2" style={{ color: "hsl(0 0% 45%)" }}>
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="casual, formal..."
                      className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-primary-foreground placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                    />
                    <button onClick={addTag} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {newItemTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {newItemTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-white/5 text-white/60 rounded-lg border border-white/5">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || !newItemName}
                className="w-full mt-6 py-3.5 rounded-xl bg-primary-foreground text-foreground text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Add to Wardrobe"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
