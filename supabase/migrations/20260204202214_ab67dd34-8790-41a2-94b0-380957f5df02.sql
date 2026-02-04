-- Create enum for clothing categories
CREATE TYPE public.clothing_category AS ENUM ('tops', 'bottoms', 'outerwear', 'shoes', 'accessories');

-- Create enum for style types
CREATE TYPE public.style_type AS ENUM ('minimalist', 'streetwear', 'business_casual', 'boho', 'vintage', 'athleisure', 'classic', 'edgy');

-- Create enum for occasions
CREATE TYPE public.occasion_type AS ENUM ('work', 'casual', 'events', 'gym', 'date_night', 'travel', 'formal');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create style preferences table
CREATE TABLE public.style_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    style_types style_type[] DEFAULT '{}',
    color_preferences TEXT[] DEFAULT '{}',
    occasions occasion_type[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wardrobe items table
CREATE TABLE public.wardrobe_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category clothing_category NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    color TEXT,
    season TEXT,
    brand TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved outfits table
CREATE TABLE public.saved_outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    item_ids UUID[] NOT NULL DEFAULT '{}',
    occasion occasion_type,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shopping cart table
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS policies for style_preferences
CREATE POLICY "Users can view their own style preferences"
    ON public.style_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own style preferences"
    ON public.style_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own style preferences"
    ON public.style_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS policies for wardrobe_items
CREATE POLICY "Users can view their own wardrobe items"
    ON public.wardrobe_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wardrobe items"
    ON public.wardrobe_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wardrobe items"
    ON public.wardrobe_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wardrobe items"
    ON public.wardrobe_items FOR DELETE
    USING (auth.uid() = user_id);

-- RLS policies for saved_outfits
CREATE POLICY "Users can view their own saved outfits"
    ON public.saved_outfits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved outfits"
    ON public.saved_outfits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved outfits"
    ON public.saved_outfits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved outfits"
    ON public.saved_outfits FOR DELETE
    USING (auth.uid() = user_id);

-- RLS policies for cart_items
CREATE POLICY "Users can view their own cart items"
    ON public.cart_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
    ON public.cart_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
    ON public.cart_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
    ON public.cart_items FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_style_preferences_updated_at
    BEFORE UPDATE ON public.style_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wardrobe_items_updated_at
    BEFORE UPDATE ON public.wardrobe_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
    
    INSERT INTO public.style_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for wardrobe images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('wardrobe-images', 'wardrobe-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Storage policies for wardrobe images
CREATE POLICY "Wardrobe images are publicly viewable"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wardrobe-images');

CREATE POLICY "Users can upload their own wardrobe images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own wardrobe images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own wardrobe images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]);