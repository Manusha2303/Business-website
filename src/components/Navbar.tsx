'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

export default function Navbar({
    cartCount,
    onCartClick,
    searchQuery: externalSearchQuery,
    setSearchQuery: setExternalSearchQuery
}: {
    cartCount: number,
    onCartClick: () => void,
    searchQuery?: string,
    setSearchQuery?: (query: string) => void
}) {
    const [localSearchQuery, setLocalSearchQuery] = React.useState('');
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearchQuery;
    const setSearchQuery = setExternalSearchQuery || setLocalSearchQuery;

    React.useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

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
                    <Link href="#collections" onClick={(e) => scrollToSection(e, 'collections')} className="hover:text-primary">Collections</Link>
                    <Link href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-primary">Contact</Link>
                </div>
            </div>

            <div className="flex items-center gap-6 text-foreground">
                <div className={`relative flex items-center transition-all duration-500 ease-in-out ${isSearchOpen ? 'w-64 md:w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    {!searchQuery && (
                        <Search
                            size={18}
                            className="absolute left-5 text-primary/40 animate-fade-in"
                        />
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for sarees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pr-10 py-2.5 rounded-full border-2 border-primary/20 focus:outline-none focus:border-primary text-sm bg-white shadow-sm transition-all placeholder:text-gray-400 font-medium ${searchQuery ? 'pl-5' : 'pl-16'}`}
                    />
                    {searchQuery && (
                        /* Symbols removed as per user request */
                        null
                    )}
                </div>
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`p-2.5 rounded-full transition-all duration-300 ${isSearchOpen ? 'bg-primary text-white shadow-lg scale-110' : 'hover:bg-primary/10 text-primary'}`}
                    aria-label="Toggle search"
                >
                    <Search size={22} />
                </button>
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
