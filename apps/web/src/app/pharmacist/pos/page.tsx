"use client";

import { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Banknote, QrCode, User, Trash2, Percent, Tag } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  rack: string;
  image?: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

export default function PharmacistPOSPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    { id: "1", name: "Paracetamol 500mg", brand: "Calpol", price: 45, stock: 150, rack: "A12", quantity: 2 },
    { id: "2", name: "Amoxicillin 250mg", brand: "Novamox", price: 120, stock: 80, rack: "B8", quantity: 1 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">("cash");

  const medicines: Medicine[] = [
    { id: "1", name: "Paracetamol 500mg", brand: "Calpol", price: 45, stock: 150, rack: "A12" },
    { id: "2", name: "Amoxicillin 250mg", brand: "Novamox", price: 120, stock: 80, rack: "B8" },
    { id: "3", name: "Ibuprofen 400mg", brand: "Brufen", price: 65, stock: 95, rack: "C5" },
    { id: "4", name: "Cetirizine 10mg", brand: "Zyrtec", price: 35, stock: 200, rack: "A3" },
    { id: "5", name: "Omeprazole 20mg", brand: "Prilosec", price: 85, stock: 120, rack: "D2" },
    { id: "6", name: "Metformin 500mg", brand: "Glucophage", price: 55, stock: 180, rack: "E1" },
    { id: "7", name: "Azithromycin 500mg", brand: "Zithromax", price: 150, stock: 60, rack: "B3" },
    { id: "8", name: "Aspirin 75mg", brand: "Disprin", price: 25, stock: 250, rack: "A1" },
  ];

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="p-6 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left Panel - Medicine Selection */}
        <div className="col-span-8 flex flex-col">
          {/* Search Bar */}
          <div className="bg-white rounded-card shadow-card p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search medicines by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-button text-base focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
              />
            </div>
          </div>

          {/* Medicine Grid */}
          <div className="bg-white rounded-card shadow-card p-4 flex-1 overflow-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredMedicines.map((medicine) => (
                <button
                  key={medicine.id}
                  onClick={() => addToCart(medicine)}
                  className="p-4 bg-neutral-50 rounded-button hover:bg-primary-green/10 hover:border-primary-green border-2 border-transparent transition-all text-left"
                >
                  <div className="w-12 h-12 bg-primary-green/20 rounded-full flex items-center justify-center mb-3">
                    <Tag size={20} className="text-primary-green" />
                  </div>
                  <h4 className="font-medium text-neutral-900 text-sm truncate">{medicine.name}</h4>
                  <p className="text-xs text-neutral-500 mb-2">{medicine.brand}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-green">₹{medicine.price}</span>
                    <span className="text-xs text-neutral-400">{medicine.stock} in stock</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart & Billing */}
        <div className="col-span-4 flex flex-col">
          {/* Customer Info */}
          <div className="bg-white rounded-card shadow-card p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                <User size={18} className="text-primary-green" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Customer name (optional)"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                />
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-card shadow-card p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary-green" />
                Cart
              </h3>
              <span className="text-sm text-neutral-500">{cart.length} items</span>
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-auto space-y-3 mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-button">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-neutral-500">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="w-16 text-right font-bold text-neutral-900">
                      ₹{item.price * item.quantity}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-7 h-7 rounded-full bg-status-danger/10 flex items-center justify-center text-status-danger hover:bg-status-danger/20"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Discount */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-button mb-4">
              <Percent size={16} className="text-neutral-500" />
              <input
                type="number"
                placeholder="Discount %"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="flex-1 bg-transparent text-sm focus:outline-none"
                min="0"
                max="100"
              />
              {discount > 0 && (
                <span className="text-sm text-status-success font-medium">-₹{discountAmount.toFixed(0)}</span>
              )}
            </div>

            {/* Payment Methods */}
            <div className="flex gap-2 mb-4">
              {[
                { method: "cash" as const, icon: Banknote, label: "Cash" },
                { method: "card" as const, icon: CreditCard, label: "Card" },
                { method: "upi" as const, icon: QrCode, label: "UPI" },
              ].map(({ method, icon: Icon, label }) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-2 px-3 rounded-button text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === method
                      ? "bg-primary-green text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-neutral-200 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Discount ({discount}%)</span>
                  <span className="font-medium text-status-success">-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-neutral-900">Total</span>
                <span className="text-primary-green">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button 
              className="w-full mt-4 py-4 bg-primary-green text-white rounded-button font-semibold text-lg hover:bg-primary-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
