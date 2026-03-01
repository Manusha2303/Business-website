'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick }: { cartCount: number, onCartClick: () => void }) {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="glass fixed top-0 w-full z-50 px-[5%] py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-primary font-playfair">
                    SAR<span>EE</span> ELEGANCE
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-wider text-foreground">
                    <Link href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-primary">Contact</Link>
                </div>
            </div>

            <div className="flex items-center gap-6 text-foreground">
                <button className="hover:text-primary"><Search size={22} /></button>
                <Link
                    href="/cart"
                    className="relative hover:text-primary"
                >
                    <ShoppingBag size={22} />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {cartCount}
                        </span>
                    )}
                </Link>
                <button className="md:hidden hover:text-primary"><Menu size={22} /></button>
            </div>
        </nav>
    );
}
