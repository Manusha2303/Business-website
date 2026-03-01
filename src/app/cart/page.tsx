'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, MapPin, CreditCard, CheckCircle2, ArrowLeft, Trash2, Plus, Minus, Truck, ShieldCheck, Mail, Phone, User, Home, Building2, Map, Navigation, Tag, Receipt } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Saree } from '@/data/sarees';

interface CartItem extends Saree {
    quantity: number;
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [step, setStep] = useState(1);

    // Step 2: Comprehensive Delivery details
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        mobile: '',
        email: '',
        houseNo: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        saveAddress: true
    });

    // Step 4: Payment
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const savedCart = localStorage.getItem('saree-cart');
        if (savedCart) {
            const parsedCart: Saree[] = JSON.parse(savedCart);
            const itemsWithQty: CartItem[] = [];
            parsedCart.forEach(item => {
                const existing = itemsWithQty.find(i => i.id === item.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    itemsWithQty.push({ ...item, quantity: 1 });
                }
            });
            setCart(itemsWithQty);
        }

        const savedInfo = localStorage.getItem('delivery-info-v2');
        if (savedInfo) {
            setDeliveryInfo(JSON.parse(savedInfo));
        }
    }, []);

    const updateQuantity = (id: number, delta: number) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCart(newCart);
        syncToLocalStorage(newCart);
    };

    const removeItem = (id: number) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        syncToLocalStorage(newCart);
    };

    const syncToLocalStorage = (items: CartItem[]) => {
        const flatItems: Saree[] = [];
        items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                const { quantity, ...saree } = item;
                flatItems.push(saree);
            }
        });
        localStorage.setItem('saree-cart', JSON.stringify(flatItems));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal > 5000 ? 0 : 150;
    const discount = subtotal > 10000 ? 500 : 0;
    const totalAmount = subtotal + deliveryCharges - discount;

    const estDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 4);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleFinalOrder = () => {
        const newOrderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setOrderId(newOrderId);

        // Prepare order details for FormSubmit email
        const orderDetails = cart.map(item => `${item.name} x${item.quantity} (₹${item.price * item.quantity})`).join('\n');
        const fullAddress = `${deliveryInfo.houseNo}, ${deliveryInfo.street}, ${deliveryInfo.city}, ${deliveryInfo.state} - ${deliveryInfo.pincode}`;

        // FormSubmit logic
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://formsubmit.co/tirupathimanusha@gmail.com';

        const inputs = {
            _subject: `Elegant Order: ${newOrderId} from ${deliveryInfo.fullName}`,
            Order_ID: newOrderId,
            Customer_Name: deliveryInfo.fullName,
            Mobile: deliveryInfo.mobile,
            Email: deliveryInfo.email || 'Not provided',
            Address: fullAddress,
            Items: orderDetails,
            Subtotal: `₹${subtotal}`,
            Delivery: `₹${deliveryCharges}`,
            Discount: `₹${discount}`,
            Total_Payable: `₹${totalAmount}`,
            Payment_Method: paymentMethod.toUpperCase(),
            _captcha: 'false',
            _template: 'table',
            _next: window.location.origin + '/cart?ordered=success&id=' + newOrderId
        };

        for (const [key, value] of Object.entries(inputs)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value.toString();
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('ordered') === 'success') {
            setStep(5);
            setOrderId(urlParams.get('id') || '');
            setCart([]);
            localStorage.removeItem('saree-cart');
        }
    }, []);

    // Step 2 Validation
    const validateDelivery = () => {
        const { fullName, mobile, houseNo, street, city, state, pincode } = deliveryInfo;
        if (!fullName || !mobile || !houseNo || !street || !city || !state || !pincode) {
            alert("Please fill in all required delivery fields.");
            return false;
        }
        if (deliveryInfo.saveAddress) {
            localStorage.setItem('delivery-info-v2', JSON.stringify(deliveryInfo));
        }
        return true;
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black">
            <Navbar cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} onCartClick={() => setStep(1)} />

            <div className="section-padding pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Step 1: Review Bag */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-5xl font-bold font-playfair mb-12 text-center tracking-tighter text-black">Review Your Bag</h2>
                            {cart.length === 0 ? (
                                <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-6">
                                    <ShoppingBag size={80} className="mx-auto text-gray-100 mb-8" />
                                    <p className="text-3xl text-gray-300 mb-12 font-playfair italic font-light">Your bag is currently waiting for something beautiful...</p>
                                    <Link href="/" className="premium-button py-6 px-16 rounded-full text-lg">Explore Collections</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 space-y-6">
                                        {cart.map((item) => (
                                            <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center group hover:shadow-xl transition-all duration-500 overflow-hidden">
                                                <div className="relative w-52 h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-50 flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                </div>
                                                <div className="flex-grow space-y-6 text-center md:text-left">
                                                    <div>
                                                        <h4 className="text-3xl font-bold font-playfair text-black mb-3">{item.name}</h4>
                                                        <div className="space-y-2">
                                                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                                Fabric: <span className="text-black">{item.fabric || 'Pure Silk'}</span>
                                                            </p>
                                                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                                Color: <span className="text-black">{item.color || 'Vibrant'}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-50">
                                                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-2 gap-6">
                                                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-primary transition-colors"><Minus size={18} /></button>
                                                            <span className="font-bold text-xl w-6 text-center font-sans">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-primary transition-colors"><Plus size={18} /></button>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                <p className="text-3xl font-bold text-black tracking-tight font-sans">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{item.price.toLocaleString()} / eq.</p>
                                                            </div>
                                                            <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-primary transition-all p-2 bg-gray-50 rounded-lg">
                                                                <Trash2 size={24} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="lg:col-span-1">
                                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl sticky top-32 space-y-8">
                                            <h3 className="font-bold text-3xl font-playfair border-b border-gray-50 pb-6 text-black tracking-tight">Summary</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-[0.1em] text-[10px]">
                                                    <span>Order Total</span>
                                                    <span className="text-black text-sm font-sans">₹{subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-green-600 font-bold uppercase tracking-[0.1em] text-[10px]">
                                                    <span>Delivery</span>
                                                    <span className="text-sm font-sans">FREE</span>
                                                </div>
                                                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                                                    <span className="font-bold text-lg uppercase tracking-widest text-gray-400">PAYABLE</span>
                                                    <span className="text-5xl font-bold text-primary tracking-tighter font-sans">₹{subtotal.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Delivery Snapshot */}
                                            <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 space-y-4 shadow-sm">
                                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                                                    <Truck size={16} />
                                                    <span>DELIVERY LOGISTICS</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Arrival:</span>
                                                    <span className="text-sm font-bold text-black">{estDeliveryDate()}</span>
                                                </div>
                                                {deliveryInfo.fullName && (
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <span className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">SHIPPING TO:</span>
                                                        <p className="text-xs font-bold text-black mt-1">{deliveryInfo.fullName}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">{deliveryInfo.city}, {deliveryInfo.state}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => setStep(2)} className="w-full py-6 bg-primary text-white font-bold rounded-2xl shadow-xl hover:opacity-90 transition-all uppercase tracking-[0.3em] text-lg">
                                                Proceed to Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Delivery Details */}
                    {step === 2 && (
                        <div className="animate-fade-in max-w-3xl mx-auto">
                            <div className="text-center mb-14">
                                <h2 className="text-5xl font-bold font-playfair mb-4 flex items-center justify-center gap-5 tracking-tighter">
                                    <MapPin className="text-primary" size={36} /> Delivery Location
                                </h2>
                                <p className="text-gray-400 font-playfair italic text-lg opacity-60">Where shall we send your timeless elegance?</p>
                            </div>
                            <div className="bg-white p-14 md:p-20 rounded-[5rem] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] space-y-16">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    <div className="space-y-4 col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">Full Legal Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="text" placeholder="Enter full name" value={deliveryInfo.fullName} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">Mobile Contact</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="tel" placeholder="+91 00000 00000" value={deliveryInfo.mobile} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, mobile: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">Email ID (Optional)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="email" placeholder="you@example.com" value={deliveryInfo.email} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, email: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">House / Flat No.</label>
                                        <div className="relative group">
                                            <Home className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="text" placeholder="102/A" value={deliveryInfo.houseNo} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, houseNo: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">Street / Locality</label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="text" placeholder="Elegant Street" value={deliveryInfo.street} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, street: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">City</label>
                                        <div className="relative group">
                                            <Navigation className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="text" placeholder="Hyderabad" value={deliveryInfo.city} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">State</label>
                                        <div className="relative group">
                                            <Map className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="text" placeholder="Telangana" value={deliveryInfo.state} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-6">Pincode</label>
                                        <div className="relative group">
                                            <Tag className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-primary transition-all duration-500" size={26} />
                                            <input type="text" placeholder="500001" value={deliveryInfo.pincode} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, pincode: e.target.value })} className="w-full pr-12 py-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-playfair font-black text-2xl placeholder:text-gray-100" style={{ paddingLeft: '6.5rem' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center justify-between">
                                    <label className="flex items-center gap-6 cursor-pointer group">
                                        <input type="checkbox" checked={deliveryInfo.saveAddress} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, saveAddress: e.target.checked })} className="w-7 h-7 rounded-xl border-primary/20 text-primary focus:ring-primary transition-all cursor-pointer" />
                                        <span className="text-xs font-black text-primary/40 group-hover:text-primary transition-colors uppercase tracking-[0.4em]">Remember my delivery preferences for next season</span>
                                    </label>
                                </div>
                                <div className="flex flex-col md:flex-row gap-10 pt-16 border-t border-gray-50">
                                    <button onClick={() => setStep(1)} className="flex-1 py-7 text-gray-300 font-black hover:text-black transition-all order-2 md:order-1 uppercase tracking-[0.5em] text-[10px]">← GO BACK TO BAG</button>
                                    <button onClick={() => setStep(3)} className="flex-[3] py-8 bg-primary text-white font-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(165,36,44,0.4)] hover:shadow-[0_40px_80px_-20px_rgba(165,36,44,0.6)] transition-all uppercase tracking-[0.6em] text-sm order-1 md:order-2 flex items-center justify-center gap-6 group">
                                        PROCEED TO SUMMARY <ArrowLeft className="rotate-180 transform group-hover:translate-x-3 transition-transform" size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Detailed Order Summary */}
                    {step === 3 && (
                        <div className="animate-fade-in max-w-4xl mx-auto">
                            <h2 className="text-5xl font-bold font-playfair mb-12 text-center tracking-tighter text-black">Final Review</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                <div className="lg:col-span-3 space-y-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                                        <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs">Saree Selection</h3>
                                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex gap-6 items-center bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                                    <div className="relative w-20 h-24 rounded-xl overflow-hidden shadow-md border-2 border-white">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-black text-lg font-playfair">{item.name}</p>
                                                        <p className="text-primary font-bold">₹{item.price.toLocaleString()} <span className="text-gray-300 text-xs ml-2">x {item.quantity}</span></p>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Fabric: {item.fabric || 'Pure Silk'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex items-center gap-6">
                                        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                            <Truck size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold uppercase tracking-widest text-[10px] text-gray-300 mb-1">Estimated Arrival</h4>
                                            <p className="text-black font-bold text-xl font-playfair">{estDeliveryDate()}</p>
                                            <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">Hand-packed with care</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-8 sticky top-32">
                                        <h3 className="font-bold border-b border-gray-50 pb-6 text-2xl font-playfair text-black tracking-tight">Price Breakdown</h3>
                                        <div className="space-y-5 text-sm">
                                            <div className="flex justify-between text-gray-400">
                                                <span>Total Item Price</span>
                                                <span className="text-black font-bold font-sans">₹{subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-400">
                                                <span>Packaging & Delivery</span>
                                                <span className="text-green-600 font-bold font-sans">{deliveryCharges > 0 ? `₹${deliveryCharges}` : 'FREE'}</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-primary font-bold">
                                                    <span>Special Discount</span>
                                                    <span className="font-sans">- ₹{discount}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-8 border-t-4 border-gray-50 flex justify-between items-center">
                                            <span className="font-bold text-sm uppercase tracking-[0.3em] text-gray-300">Total Payable</span>
                                            <span className="text-5xl font-bold text-primary tracking-tighter font-sans">₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <button onClick={() => setStep(4)} className="w-full py-6 bg-primary text-white font-bold rounded-2xl shadow-xl hover:opacity-90 transition-all uppercase tracking-[0.3em] text-lg">
                                            Place Order
                                        </button>
                                        <button onClick={() => setStep(2)} className="w-full text-center text-xs font-bold text-gray-300 hover:text-black transition-colors uppercase tracking-widest">Go Back</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Secure Payment Interface */}
                    {step === 4 && (
                        <div className="animate-fade-in text-black">
                            <h2 className="text-4xl font-bold font-playfair mb-12 text-center uppercase tracking-tighter">Confirm Payment</h2>

                            {/* Top Confirmation Button */}
                            <div className="mb-8 flex justify-center">
                                <button onClick={() => paymentMethod ? handleFinalOrder() : alert('Please select a payment method first')} className="w-full md:w-auto px-20 py-6 bg-primary text-white font-bold rounded-2xl shadow-2xl hover:opacity-90 transition-all uppercase tracking-[0.3em] text-lg flex items-center justify-center gap-4 animate-pulse">
                                    PLACE ORDER NOW <ShieldCheck size={28} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                                        <div className="flex items-center gap-4 text-primary bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                            <ShieldCheck size={24} />
                                            <p className="text-sm font-bold uppercase tracking-widest text-center flex-grow">Secure checkout. Selected sarees will be shipped instantly upon confirmation.</p>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'upi', label: 'Google Pay / PhonePe / UPI', desc: 'Secure Instant Bank Transfer', icon: <Receipt size={24} /> },
                                                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay only when you receive the saree', icon: <Truck size={24} />, highlighted: true }
                                            ].map((opt) => (
                                                <label key={opt.id} className={`flex items-center gap-6 p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === opt.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-gray-50 bg-[#F9FAFB] hover:border-gray-200'} ${opt.highlighted ? 'border-dashed border-primary/30' : ''}`}>
                                                    <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="w-6 h-6 accent-primary" />
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.highlighted ? 'bg-primary text-white' : 'bg-white text-primary shadow-sm'}`}>
                                                        {opt.icon}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <span className="block font-bold text-xl">{opt.label}</span>
                                                        <span className="text-xs text-gray-400 font-medium">{opt.desc}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(3)} className="flex-1 py-5 text-gray-300 font-bold hover:text-black transition-all uppercase tracking-widest text-xs">← Return to Summary</button>
                                        <button onClick={() => paymentMethod ? handleFinalOrder() : alert('Please select a payment method')} className="flex-[2] py-6 bg-primary text-white font-bold rounded-2xl shadow-2xl hover:opacity-90 transition-all uppercase tracking-[0.3em] text-lg flex items-center justify-center gap-4">
                                            CONFIRM ORDER <ShieldCheck size={24} />
                                        </button>
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <div className="space-y-8 sticky top-32">
                                        {/* Verification Address Snapshot */}
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs">Deliver To</h3>
                                                <button onClick={() => setStep(2)} className="text-primary font-bold text-[10px] hover:underline underline-offset-4">EDIT</button>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-bold text-xl font-playfair">{deliveryInfo.fullName}</p>
                                                <p className="text-gray-400 text-sm leading-relaxed italic font-playfair">{deliveryInfo.houseNo}, {deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.state} - {deliveryInfo.pincode}</p>
                                                <p className="text-sm font-bold text-black border-t border-gray-50 pt-3 flex items-center gap-2"><Phone size={12} className="text-primary" /> <span className="font-playfair">{deliveryInfo.mobile}</span></p>
                                            </div>
                                        </div>

                                        {/* Mini Order Summary */}
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-6">
                                            <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs">Order Summary</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs font-medium text-gray-400">
                                                    <span>Order Total</span>
                                                    <span className="text-black font-sans">₹{subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-medium text-green-600">
                                                    <span>Delivery</span>
                                                    <span className="font-sans">FREE</span>
                                                </div>
                                                <div className="pt-4 border-t-2 border-primary/20 flex justify-between items-end">
                                                    <span className="font-bold text-sm uppercase tracking-tighter text-gray-400">Total Payable</span>
                                                    <span className="text-3xl font-bold text-primary font-sans">₹{totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Celebratory Order Confirmation */}
                    {step === 5 && (
                        <div className="animate-fade-in text-center py-32 bg-white rounded-[5rem] border border-gray-100 shadow-[0_50px_120px_rgba(0,0,0,0.06)] px-12 max-w-4xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
                            <div className="w-56 h-56 bg-green-50/50 rounded-full flex items-center justify-center mx-auto mb-14 shadow-inner relative">
                                <CheckCircle2 size={120} className="text-green-600 animate-[bounce_1.5s_infinite]" />
                                <div className="absolute inset-0 rounded-full border-4 border-dashed border-green-200 animate-[spin_10s_linear_infinite]" />
                            </div>
                            <h2 className="text-7xl font-bold font-playfair mb-8 text-black tracking-tighter">Perfect Selection!</h2>
                            <p className="text-gray-400 font-black mb-20 uppercase tracking-[0.6em] text-xs">Reference: <span className="text-primary bg-primary/5 px-6 py-3 rounded-xl ml-4 shadow-sm border border-primary/5 font-sans">{orderId}</span></p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-20">
                                <div className="p-12 rounded-[3.5rem] bg-[#FDFDFD] border border-gray-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                                    <div className="flex items-center gap-5 mb-8 text-primary">
                                        <MapPin size={32} />
                                        <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Delivery Destination</h4>
                                    </div>
                                    <p className="text-3xl font-bold text-black font-playfair mb-4">{deliveryInfo.fullName}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium font-playfair italic">
                                        {deliveryInfo.houseNo}, {deliveryInfo.street},<br />
                                        {deliveryInfo.city}, {deliveryInfo.state} - {deliveryInfo.pincode}
                                    </p>
                                </div>
                                <div className="p-12 rounded-[3.5rem] bg-[#FDFDFD] border border-gray-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                                    <div className="flex items-center gap-5 mb-8 text-green-600">
                                        <Truck size={32} />
                                        <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Expected Arrival</h4>
                                    </div>
                                    <p className="text-4xl font-bold text-black font-playfair mb-4">{estDeliveryDate()}</p>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Hand-packed with artisan care</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 justify-center max-w-2xl mx-auto">
                                <button className="flex-1 py-7 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all uppercase tracking-[0.3em] text-sm shadow-2xl">Track Your Saree</button>
                                <Link href="/" className="flex-1 py-7 border-2 border-gray-100 text-black font-bold rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3">Continue Shopping</Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main >
    );
}
