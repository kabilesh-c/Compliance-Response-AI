"use client";

import { useState } from "react";
import { Plus, Sparkles, ArrowRight, X } from "lucide-react";
import ActiveOrdersBar from "@/components/pos/ActiveOrdersBar";
import MedicineCard from "@/components/pos/MedicineCard";
import BillingPanel, { CartItem } from "@/components/pos/BillingPanel";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  price: number;
  rack: string;
  stock: number;
  image: string;
  demandHint?: "high" | "trending" | "seasonal" | null;
  demandReason?: string;
}

const mockMedicines: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", dosage: "500mg Tablet", price: 25, rack: "A12", stock: 150, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200&h=200", demandHint: "high", demandReason: "30% higher than usual this week" },
  { id: "2", name: "Amoxicillin 250mg", dosage: "250mg Capsule", price: 120, rack: "B8", stock: 80, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200&h=200", demandHint: null },
  { id: "3", name: "Ibuprofen 400mg", dosage: "400mg Tablet", price: 45, rack: "C5", stock: 5, image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=200&h=200", demandHint: "seasonal", demandReason: "Monsoon season demand spike" },
  { id: "4", name: "Omeprazole 20mg", dosage: "20mg Capsule", price: 85, rack: "D3", stock: 60, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200&h=200", demandHint: null },
  { id: "5", name: "Atorvastatin 10mg", dosage: "10mg Tablet", price: 95, rack: "E7", stock: 120, image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=200&h=200", demandHint: "trending", demandReason: "Health awareness campaign effect" },
];

interface SubstituteSuggestion {
  original: string;
  substitute: string;
  reason: string;
  savings: number;
}

export default function POSPage() {
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [showSubstituteBanner, setShowSubstituteBanner] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Mock AI substitute suggestion
  const substituteSuggestion: SubstituteSuggestion | null = selectedMedicine === "3" ? {
    original: "Ibuprofen 400mg",
    substitute: "Brufen 400mg",
    reason: "Same composition, better stock availability",
    savings: 15,
  } : null;

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1, total: item.unitPrice * (item.quantity + 1) }
            : item
        );
      }
      return [...prev, {
        id: medicine.id,
        name: medicine.name,
        dosage: medicine.dosage,
        quantity: 1,
        unitPrice: medicine.price,
        total: medicine.price
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + delta), total: item.unitPrice * Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-8 flex gap-6">
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Point of Sale</h1>
        
        <ActiveOrdersBar />

        {/* AI Substitute Suggestion Banner */}
        {showSubstituteBanner && substituteSuggestion && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-yellow/20 to-primary-yellow/10 rounded-2xl border border-primary-yellow/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-yellow flex items-center justify-center">
                  <Sparkles size={20} className="text-neutral-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900">Smart Substitute Available</p>
                    <span className="px-2 py-0.5 bg-status-success/10 text-status-success rounded-full text-xs font-medium">
                      Save ₹{substituteSuggestion.savings}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Replace <span className="font-medium">{substituteSuggestion.original}</span> with{" "}
                    <span className="font-medium text-primary-yellow-dark">{substituteSuggestion.substitute}</span>
                    {" "}— {substituteSuggestion.reason}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-primary-yellow text-neutral-900 rounded-xl text-sm font-medium hover:bg-primary-yellow-dark transition-colors flex items-center gap-1">
                  Apply Substitute <ArrowRight size={14} />
                </button>
                <button 
                  onClick={() => setShowSubstituteBanner(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-x-auto py-6">
          <div className="flex gap-4">
            {mockMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                isSelected={selectedMedicine === medicine.id}
                onSelect={() => {
                  setSelectedMedicine(medicine.id);
                  setShowSubstituteBanner(true);
                }}
                onAdd={() => addToCart(medicine)}
              />
            ))}
            
            <div className="w-36 flex-shrink-0 bg-white border-2 border-dashed border-neutral-300 rounded-card p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary-yellow hover:bg-primary-yellow/5 transition-all">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
                <Plus size={24} className="text-neutral-400" />
              </div>
              <span className="text-sm font-medium text-neutral-600">Add Medicine</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 flex-shrink-0">
        <BillingPanel 
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </div>
    </div>
  );
}
