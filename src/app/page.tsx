'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductList from '@/components/ProductList';
import { Saree } from '@/data/sarees';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const [cart, setCart] = useState<Saree[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('saree-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (saree: Saree) => {
    const newCart = [...cart, saree];
    setCart(newCart);
    localStorage.setItem('saree-cart', JSON.stringify(newCart));
    alert(`${saree.name} added to your cart!`);
  };

  const handleOrder = () => {
    router.push('/cart');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen relative">
      <Navbar
        cartCount={cart.length}
        onCartClick={handleOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Hero />

      <ProductList onAddToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-background text-center border-t border-primary/20">
        <h2 className="text-4xl font-bold elegant-title mb-6">Connect with Us</h2>
        <p className="max-w-xl mx-auto text-foreground/70 mb-8">
          Have questions about our collection or need help with your order? Our artisans are here to help.
        </p>
        <div className="flex flex-col items-center gap-4">
          <a
            href="mailto:tirupathimanusha@gmail.com"
            className="text-xl font-medium text-primary hover:text-secondary transition-all underline decoration-primary/30"
          >
            tirupathimanusha@gmail.com
          </a>
          <p className="text-sm opacity-60 text-foreground">Mon - Sat: 10:00 AM - 8:00 PM</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-primary/10 text-sm opacity-60">
        <p>&copy; <span className="text-primary font-medium">Saree Elegance</span> Business. All rights reserved.</p>
      </footer>

      {/* Floating Order Button for Mobile/Convenience */}
      {cart.length > 0 && (
        <button
          onClick={handleOrder}
          className="fixed bottom-8 right-8 glass !bg-primary !text-white px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-fade-in"
        >
          <ShoppingBag size={20} />
          <span className="font-bold">Order Now (₹{totalPrice.toLocaleString()})</span>
        </button>
      )}
    </main>
  );
}
