import React from 'react';
import Image from 'next/image';
import { Saree } from '@/data/sarees';

interface ProductCardProps {
    saree: Saree;
    onAddToCart: (saree: Saree) => void;
}

export default function ProductCard({ saree, onAddToCart }: ProductCardProps) {
    return (
        <div className="glass group rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-300" />
            </div>

            <div className="p-6">
                <span className="text-xs text-gold uppercase tracking-widest font-medium mb-1 inline-block">
                    {saree.category}
                </span>
                <h3 className="text-xl font-bold mb-2 elegant-title tracking-tight">{saree.name}</h3>
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{saree.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-foreground">₹{saree.price.toLocaleString()}</span>
                    <button
                        onClick={() => onAddToCart(saree)}
                        className="premium-button !py-2 !px-4 !text-xs"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
