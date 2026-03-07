"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Trash2, CreditCard, Banknote, QrCode } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BillingPanelProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function BillingPanel({ cart, onUpdateQuantity, onRemoveItem, onClearCart }: BillingPanelProps) {
  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CODE">("CASH");

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const receivable = subtotal - discount;
  const due = Math.max(0, receivable - received);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert(`Processing payment of ₹${receivable} via ${paymentMethod}`);
    onClearCart();
    setReceived(0);
    setDiscount(0);
  };

  return (
    <div className="bg-dark-card rounded-card shadow-card p-6 text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bill</h3>
        <div className="w-8 h-8 bg-primary-yellow rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm">
          {cart.length}
        </div>
      </div>

      <div className="flex-1 overflow-auto mb-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <p>Cart is empty</p>
            <p className="text-xs">Select medicines to add</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-dark-card-light rounded-button p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-xs text-neutral-400">{item.dosage}</p>
                </div>
                <button onClick={() => onRemoveItem(item.id)} className="text-status-danger hover:text-status-danger-light">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-dark-card rounded-button p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-neutral-700 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-neutral-700 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-sm font-bold">₹{item.total}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t border-neutral-700 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-neutral-400 ml-1">Discount</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={discount === 0 ? "" : discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-dark-card-light border border-neutral-700 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-yellow text-sm"
              placeholder="Enter discount"
            />
            <span className="text-neutral-400 text-sm">₹</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-lg font-bold text-primary-yellow">
          <span>Total Payable</span>
          <span>₹{receivable}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod("CASH")}
            className={`flex flex-col items-center justify-center p-2 rounded-button border ${
              paymentMethod === "CASH" ? "border-primary-yellow bg-primary-yellow/10 text-primary-yellow" : "border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <Banknote size={20} className="mb-1" />
            <span className="text-[10px] font-medium">Cash</span>
          </button>
          <button
            onClick={() => setPaymentMethod("CARD")}
            className={`flex flex-col items-center justify-center p-2 rounded-button border ${
              paymentMethod === "CARD" ? "border-primary-yellow bg-primary-yellow/10 text-primary-yellow" : "border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <CreditCard size={20} className="mb-1" />
            <span className="text-[10px] font-medium">Card</span>
          </button>
          <button
            onClick={() => setPaymentMethod("CODE")}
            className={`flex flex-col items-center justify-center p-2 rounded-button border ${
              paymentMethod === "CODE" ? "border-primary-yellow bg-primary-yellow/10 text-primary-yellow" : "border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <QrCode size={20} className="mb-1" />
            <span className="text-[10px] font-medium">UPI</span>
          </button>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="w-full py-3 bg-primary-yellow text-neutral-900 rounded-xl font-bold hover:bg-primary-yellow-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Print Bill & Checkout
        </button>
      </div>
    </div>
  );
}

