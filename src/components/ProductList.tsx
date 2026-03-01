'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { SAREES, Saree } from '@/data/sarees';
import { Search } from 'lucide-react';

const CATEGORIES = ["All", "Traditional", "Modern", "Contemporary", "Heritage", "Casual"];

export default function ProductList({
    onAddToCart,
    searchQuery = '',
    setSearchQuery
}: {
    onAddToCart: (saree: Saree) => void,
    searchQuery?: string,
    setSearchQuery?: (query: string) => void
}) {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredSarees = SAREES.filter(s => {
        const matchesCategory = activeCategory === "All" || s.category === activeCategory;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="collections" className="section-padding bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-gold uppercase tracking-[0.3em] font-medium text-xs mb-4 inline-block">
                        Curated Treasures
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold elegant-title tracking-tight mb-8">
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Exclusive Collections'}
                    </h2>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                                    : 'bg-white text-primary border-primary/20 hover:border-primary/50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <p className="text-foreground/60 max-w-xl mx-auto font-light">
                        Each fold tells a story of craftsmanship. Explore our hand-picked selections of pure silk, chiffon, and modern favorites.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredSarees.map((saree) => (
                        <ProductCard
                            key={saree.id}
                            saree={saree}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>

                {filteredSarees.length === 0 && (
                    <div className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-primary/5">
                        <Search size={48} className="mx-auto text-primary/20 mb-6" />
                        <p className="text-2xl text-foreground/40 font-playfair italic">
                            {searchQuery
                                ? `No sarees matching "${searchQuery}" found...`
                                : "No sarees found in this collection..."}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery?.('')}
                                className="mt-8 text-primary font-medium underline decoration-primary/20 underline-offset-8 hover:text-secondary transition-colors"
                            >
                                Browse all collections
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
