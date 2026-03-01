'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {


    return (
        <section className="relative w-full h-[90vh] flex items-center justify-center text-center overflow-hidden">
            {/* Background with light overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-red-saree-elegant.png"
                    alt="Elegant Red Saree Hero"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-white/10 z-10" />
            </div>

            <div className="relative z-20 text-foreground px-5 max-w-4xl flex flex-col items-center">
                <span className="text-[#001F3F] uppercase tracking-[0.3em] font-bold mb-4 animate-fade-in text-sm md:text-base">
                    Crafting Timeless Elegance
                </span>
                <h1 className="text-4xl md:text-7xl font-bold elegant-title !text-black leading-tight mb-6 tracking-tight">
                    Celebrate Every Fold <br /> Of <span className="text-[#C5A028]">Tradition</span>
                </h1>
                <p className="text-lg md:text-xl text-black max-w-2xl mb-10 font-medium">
                    Experience the finest silk, delicate weaves, and timeless craftsmanship.
                    A journey of luxury through every saree.
                </p>

            </div>
        </section>
    );
}
