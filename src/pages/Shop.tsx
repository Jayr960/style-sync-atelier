import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingCart, Heart, Star, X, Plus, Minus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

type Category = "all" | "tops" | "bottoms" | "outerwear" | "shoes" | "accessories";
type PriceRange = "all" | "under50" | "50to100" | "100to200" | "over200";

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
];

const priceRanges: { value: PriceRange; label: string; min: number; max: number }[] = [
  { value: "all", label: "All Prices", min: 0, max: Infinity },
  { value: "under50", label: "Under $50", min: 0, max: 50 },
  { value: "50to100", label: "$50 - $100", min: 50, max: 100 },
  { value: "100to200", label: "$100 - $200", min: 100, max: 200 },
  { value: "over200", label: "$200+", min: 200, max: Infinity },
];

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  sizes: string[];
  description: string;
  isRecommended?: boolean;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Silk Blouse",
    brand: "Everlane",
    price: 98,
    category: "tops",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop",
    rating: 4.8,
    reviews: 124,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A timeless silk blouse with clean lines and a relaxed fit. Perfect for both office and evening occasions.",
    isRecommended: true,
  },
  {
    id: "2",
    name: "High-Rise Wide Leg Trousers",
    brand: "COS",
    price: 135,
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    rating: 4.6,
    reviews: 89,
    sizes: ["24", "26", "28", "30", "32"],
    description: "Elegant wide-leg trousers crafted from premium wool blend. Features a high waist and pleated front.",
    isRecommended: true,
  },
  {
    id: "3",
    name: "Cashmere Crew Neck Sweater",
    brand: "Theory",
    price: 245,
    category: "tops",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    rating: 4.9,
    reviews: 203,
    sizes: ["XS", "S", "M", "L"],
    description: "Luxuriously soft cashmere sweater in a classic crew neck silhouette. Investment piece for any wardrobe.",
  },
  {
    id: "4",
    name: "Tailored Wool Coat",
    brand: "Massimo Dutti",
    price: 299,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
    rating: 4.7,
    reviews: 156,
    sizes: ["S", "M", "L", "XL"],
    description: "A structured wool coat with notch lapels and a classic fit. The epitome of understated elegance.",
    isRecommended: true,
  },
  {
    id: "5",
    name: "Italian Leather Loafers",
    brand: "Madewell",
    price: 178,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
    rating: 4.5,
    reviews: 78,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Handcrafted leather loafers with a modern silhouette. Comfort meets style for all-day wear.",
  },
  {
    id: "6",
    name: "Linen Blend Midi Skirt",
    brand: "& Other Stories",
    price: 79,
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj83?w=400&h=500&fit=crop",
    rating: 4.4,
    reviews: 45,
    sizes: ["XS", "S", "M", "L"],
    description: "Breezy linen blend midi skirt perfect for warm weather. Features an A-line silhouette.",
  },
  {
    id: "7",
    name: "Structured Leather Tote",
    brand: "Cuyana",
    price: 195,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
    rating: 4.8,
    reviews: 167,
    sizes: ["One Size"],
    description: "A refined leather tote with organized compartments. The perfect work-to-weekend companion.",
    isRecommended: true,
  },
  {
    id: "8",
    name: "Relaxed Cotton Tee",
    brand: "Everlane",
    price: 35,
    category: "tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    rating: 4.3,
    reviews: 312,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Essential cotton tee with a relaxed fit. Sustainably made with organic cotton.",
  },
];

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activePriceRange, setActivePriceRange] = useState<PriceRange>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");

  const priceRange = priceRanges.find((p) => p.value === activePriceRange)!;

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesPrice = product.price >= priceRange.min && product.price < priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const recommendedProducts = mockProducts.filter((p) => p.isRecommended);

  const addToCart = (product: Product, size: string) => {
    const existing = cart.find((item) => item.id === product.id && item.selectedSize === size);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size }]);
    }
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(cart.map((item) =>
      item.id === id && item.selectedSize === size
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter((item) => item.quantity > 0));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppLayout showFooter={false}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
              Shop
            </h1>
            <p className="text-muted-foreground">
              Curated pieces to elevate your wardrobe
            </p>
          </div>
          
          {/* Cart button */}
          <button
            onClick={() => setShowCart(true)}
            className="relative p-3 rounded-full bg-secondary hover:bg-accent transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn("tag", activeCategory === cat.value && "tag-active")}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn("tag", showFilters && "tag-active")}
            >
              <Filter className="w-3 h-3 mr-1" />
              Price
            </button>
          </div>

          {/* Price filter dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setActivePriceRange(range.value)}
                    className={cn("tag", activePriceRange === range.value && "tag-active")}
                  >
                    {range.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recommendations */}
        {activeCategory === "all" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-lg font-medium mb-4">Perfect for Your Wardrobe</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendedProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedSize("");
                  }}
                  className="product-card cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs bg-accent-warm text-accent-warm-foreground rounded-full">
                        Recommended
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <p className="text-sm mt-1">${product.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
          </h2>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedSize("");
                  }}
                  className="product-card cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          favorites.includes(product.id) && "fill-destructive text-destructive"
                        )}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-medium">${product.price}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent-warm text-accent-warm" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-0 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Image */}
              <div className="md:w-1/2 aspect-square md:aspect-auto bg-secondary">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
                    <h2 className="text-xl font-medium">{selectedProduct.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent-warm text-accent-warm" />
                    <span className="text-sm font-medium">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({selectedProduct.reviews} reviews)
                  </span>
                </div>

                <p className="text-2xl font-medium mb-6">${selectedProduct.price}</p>

                <p className="text-muted-foreground text-sm mb-6">
                  {selectedProduct.description}
                </p>

                {/* Size selection */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-colors",
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className="p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        favorites.includes(selectedProduct.id) && "fill-destructive text-destructive"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => selectedSize && addToCart(selectedProduct, selectedSize)}
                    disabled={!selectedSize}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedSize}`}
                        className="flex gap-4 p-4 rounded-xl bg-secondary/50"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                          <p className="text-sm font-medium mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                            className="p-1 rounded-lg hover:bg-secondary transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                            className="p-1 rounded-lg hover:bg-secondary transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-xl font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="btn-primary w-full">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
