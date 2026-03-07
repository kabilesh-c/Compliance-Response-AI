"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Building2, ArrowRight, Check, User, MapPin, Users, Building } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api";

type Step = "mode" | "org" | "admin" | "invite";
type Mode = "retail" | "hospital" | null;

export default function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setMode: setStoreMode } = useAuthStore();
  const initialMode = searchParams.get("mode") as Mode;

  const [step, setStep] = useState<Step>(initialMode ? "org" : "mode");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [formData, setFormData] = useState({
    orgName: "",
    location: "",
    staffCount: "",
    departments: "",
    adminName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [createdUser, setCreatedUser] = useState<any>(null);
  const [createdToken, setCreatedToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    setStep("org");
  };

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("admin");
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Demo mode: Skip API call and directly proceed to success step
    // This simulates a successful registration without requiring backend
    const mockUser = {
      id: "demo-" + Date.now(),
      name: formData.adminName,
      email: formData.email,
      role: "ADMIN",
      orgName: formData.orgName,
      mode: mode === "hospital" ? "HOSPITAL" : "RETAIL"
    };
    const mockToken = "demo-token-" + Date.now();

    setCreatedUser(mockUser);
    setCreatedToken(mockToken);
    setIsLoading(false);
    setStep("invite");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
      {/* Progress Bar */}
      <div className="h-2 bg-neutral-100 w-full">
        <motion.div
          className="h-full bg-primary-yellow"
          initial={{ width: "25%" }}
          animate={{
            width:
              step === "mode"
                ? "25%"
                : step === "org"
                ? "50%"
                : step === "admin"
                ? "75%"
                : "100%",
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-8 md:p-12">
        <AnimatePresence mode="wait">
          {step === "mode" && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                  Choose Your Mode
                </h2>
                <p className="text-neutral-600">
                  Select the operational model that best fits your organization.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleModeSelect("retail")}
                  className="p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-yellow hover:bg-primary-yellow-light/30 transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-primary-yellow-light rounded-xl flex items-center justify-center text-yellow-700 mb-4 group-hover:scale-110 transition-transform">
                    <Store size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Retail Pharmacy</h3>
                  <p className="text-sm text-neutral-500">
                    For standalone shops and retail chains.
                  </p>
                </button>

                <button
                  onClick={() => handleModeSelect("hospital")}
                  className="p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-yellow hover:bg-primary-yellow-light/30 transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-primary-yellow-light rounded-xl flex items-center justify-center text-yellow-700 mb-4 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Hospital</h3>
                  <p className="text-sm text-neutral-500">
                    For hospitals, clinics, and medical colleges.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {step === "org" && (
            <motion.div
              key="org"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Tell us about your {mode === "retail" ? "Pharmacy" : "Hospital"}
                </h2>
                <p className="text-neutral-600">
                  We'll customize your dashboard based on these details.
                </p>
              </div>

              <form onSubmit={handleOrgSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {mode === "retail" ? "Pharmacy Name" : "Hospital Name"}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      required
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                      placeholder={mode === "retail" ? "e.g. Apollo Pharmacy" : "e.g. City General Hospital"}
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      required
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                {mode === "retail" ? (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Number of Staff
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <select
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all appearance-none bg-white"
                        value={formData.staffCount}
                        onChange={(e) => setFormData({ ...formData, staffCount: e.target.value })}
                      >
                        <option value="">Select range</option>
                        <option value="1-5">1-5</option>
                        <option value="6-20">6-20</option>
                        <option value="20+">20+</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Departments
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                      placeholder="e.g. OPD, ICU, Emergency (comma separated)"
                      value={formData.departments}
                      onChange={(e) => setFormData({ ...formData, departments: e.target.value })}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {step === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Create Admin Account
                </h2>
                <p className="text-neutral-600">
                  You'll be the super admin for <strong>{formData.orgName}</strong>.
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      required
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                      placeholder="John Doe"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  Create Account
                  <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {step === "invite" && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                <Check size={40} />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                  Welcome to PharmaOS!
                </h2>
                <p className="text-neutral-600 mb-8">
                  Your organization <strong>{formData.orgName}</strong> has been set up successfully.
                </p>
                
                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 mb-8">
                  <p className="text-sm text-neutral-500 mb-2">Your Organization Code</p>
                  <div className="text-3xl font-mono font-bold text-yellow-600 tracking-wider">
                    PH-{Math.floor(1000 + Math.random() * 9000)}
                  </div>
                  <p className="text-xs text-neutral-400 mt-2">
                    Share this code with your staff to let them join.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    login({
                      id: "1",
                      name: formData.adminName,
                      email: formData.email,
                      role: "ADMIN"
                    }, "mock-token");
                    setStoreMode(mode === "hospital" ? "HOSPITAL" : "RETAIL");
                    if (mode === "hospital") {
                      router.push("/hospital/admin");
                    } else {
                      router.push("/dashboard");
                    }
                  }}
                  className="w-full py-4 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {}} // Add invite logic
                  className="w-full py-4 bg-white border border-neutral-200 text-neutral-600 font-bold rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Invite Staff via Email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
