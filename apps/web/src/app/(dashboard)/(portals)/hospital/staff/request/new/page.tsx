"use client";

import { useState } from "react";
import { Search, AlertCircle, Check, ArrowLeft, Brain, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState("NORMAL");
  const [quantity, setQuantity] = useState("");
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuantity(val);
    
    // Mock AI Logic
    if (parseInt(val) > 500) {
      setAiWarning("This exceeds normal usage (Avg: 300)");
    } else {
      setAiWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock submission
    setTimeout(() => {
      setIsLoading(false);
      router.push("/hospital/staff");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/hospital/staff" className="text-neutral-500 hover:text-neutral-900 flex items-center gap-2 text-sm font-medium mb-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">New Medicine Request</h1>
        <p className="text-neutral-500">Raise a stock request for your department</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medicine Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Search Medicine
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all"
                placeholder="Type medicine name (e.g. Paracetamol)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Quantity
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    aiWarning 
                      ? "border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
                      : "border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                  }`}
                  placeholder="0"
                />
                {aiWarning && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                    <AlertTriangle size={20} />
                  </div>
                )}
              </div>
              {aiWarning && (
                <div className="mt-2 flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100 animate-in fade-in slide-in-from-top-2">
                  <Brain size={16} className="text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-orange-700">AI Insight</p>
                    <p className="text-xs text-orange-600">{aiWarning}</p>
                    <button 
                      type="button" 
                      onClick={() => { setQuantity("300"); setAiWarning(null); }} 
                      className="text-xs font-medium text-primary-blue hover:underline mt-1"
                    >
                      Apply Suggestion (300)
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Duration (Days)
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all bg-white">
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Priority Level
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPriority("NORMAL")}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                  priority === "NORMAL"
                    ? "bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500/20"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setPriority("CRITICAL")}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                  priority === "CRITICAL"
                    ? "bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500/20"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Critical / Emergency
              </button>
            </div>

            {priority === "CRITICAL" && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>Critical requests require immediate approval from Central Pharmacy.</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all min-h-[100px]"
              placeholder="Add any specific instructions..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-yellow/20"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Check size={20} /> Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}