"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api";
import { Check, Info, ArrowRight, Building2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, logout, isAuthenticated, user, setMode, mode } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing session when visiting login page
  useEffect(() => {
    logout();
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // --- DEMO MODE: Accept any password for demo emails ---
    // This allows login even if the backend is down or database is empty
    const demoUsers: Record<string, { role: "ADMIN" | "MANAGER" | "PHARMACIST"; name: string; mode: "RETAIL" | "HOSPITAL" }> = {
      // Retail Mode
      "admin@pharmacy.com": { role: "ADMIN", name: "Retail Admin", mode: "RETAIL" },
      "manager@pharmacy.com": { role: "MANAGER", name: "Retail Manager", mode: "RETAIL" },
      "pharmacist@pharmacy.com": { role: "PHARMACIST", name: "Retail Pharmacist", mode: "RETAIL" },
      // Hospital Mode
      "admin@hospital.com": { role: "ADMIN", name: "Hospital Admin", mode: "HOSPITAL" },
      "manager@hospital.com": { role: "MANAGER", name: "Hospital Manager", mode: "HOSPITAL" },
      "staff@hospital.com": { role: "PHARMACIST", name: "Hospital Staff", mode: "HOSPITAL" },
    };

    const normalizedEmail = email.toLowerCase().trim();
    const demoUser = demoUsers[normalizedEmail];
    
    // Demo mode: If email matches a demo user, accept ANY password
    if (demoUser) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const user = {
        id: "demo-" + Math.random().toString(36).substr(2, 9),
        name: demoUser.name,
        email: normalizedEmail,
        role: demoUser.role,
        organizationId: demoUser.mode === "HOSPITAL" ? "demo-hospital-org" : "demo-retail-org"
      };

      login(user, "demo-token-12345");
      setMode(demoUser.mode);

      // Wait for state to persist before navigating
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect logic based on mode and role
      let targetPath = "/dashboard";
      
      if (demoUser.mode === "HOSPITAL") {
        switch (demoUser.role) {
          case "ADMIN": targetPath = "/hospital/admin"; break;
          case "MANAGER": targetPath = "/manager"; break;
          default: targetPath = "/hospital/staff"; break;
        }
      } else {
        // Retail mode
        switch (demoUser.role) {
          case "ADMIN": targetPath = "/admin"; break;
          case "MANAGER": targetPath = "/manager"; break;
          case "PHARMACIST": targetPath = "/pos"; break;
          default: targetPath = "/dashboard"; break;
        }
      }
      
      setIsLoading(false);
      router.push(targetPath);
      return;
    }
    // ---------------------------------

    try {
      // Real API Login
      const response = await authApi.login(email, password);
      const { user: apiUser, token } = response;

      // Determine mode based on organization type (if available) or email fallback
      let mode: "RETAIL" | "HOSPITAL" = "RETAIL";
      if (apiUser.organization?.type === "HOSPITAL" || email.includes("hospital")) {
        mode = "HOSPITAL";
      }

      const user = {
        id: apiUser.id,
        name: `${apiUser.firstName} ${apiUser.lastName}`,
        email: apiUser.email,
        role: apiUser.role,
        organizationId: apiUser.organizationId
      };
      
      // Use auth store to persist login
      login(user, token);
      setMode(mode);
      
      // Redirect based on role and mode
      const role = apiUser.role;
      if (mode === "HOSPITAL") {
        switch (role) {
          case "ADMIN":
          case "SUPER_ADMIN":
            router.push("/admin");
            break;
          case "INVENTORY_MANAGER":
          case "MANAGER":
            router.push("/manager");
            break;
          case "PHARMACIST":
          case "SALES_CLERK":
            router.push("/hospital/staff");
            break;
          default:
            router.push("/hospital/staff");
        }
      } else {
        switch (role) {
          case "ADMIN":
          case "SUPER_ADMIN":
            router.push("/admin");
            break;
          case "INVENTORY_MANAGER":
          case "MANAGER":
            router.push("/manager");
            break;
          case "PHARMACIST":
          case "SALES_CLERK":
            router.push("/pharmacist/dashboard");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } catch (err: any) {
      // Silently handle error in demo mode
      setError("Login failed. Please use one of the demo credentials below.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login handler for one-click demo access
  const handleQuickLogin = async (email: string, role: "ADMIN" | "MANAGER" | "PHARMACIST", mode: "RETAIL" | "HOSPITAL") => {
    setIsLoading(true);
    
    const names: Record<string, string> = {
      "admin@pharmacy.com": "Retail Admin",
      "manager@pharmacy.com": "Retail Manager", 
      "pharmacist@pharmacy.com": "Retail Pharmacist",
      "admin@hospital.com": "Hospital Admin",
      "manager@hospital.com": "Hospital Manager",
      "staff@hospital.com": "Hospital Staff"
    };

    const user = {
      id: "demo-" + Math.random().toString(36).substr(2, 9),
      name: names[email] || "Demo User",
      email: email,
      role: role,
      organizationId: mode === "HOSPITAL" ? "demo-hospital-org" : "demo-retail-org"
    };

    login(user, "demo-token-12345");
    setMode(mode);

    // Small delay for state to persist
    await new Promise(resolve => setTimeout(resolve, 150));

    // Redirect based on mode and role
    let targetPath = "/dashboard";
    
    if (mode === "HOSPITAL") {
      switch (role) {
        case "ADMIN": targetPath = "/hospital/admin"; break;
        case "MANAGER": targetPath = "/manager"; break;
        default: targetPath = "/hospital/staff"; break;
      }
    } else {
      switch (role) {
        case "ADMIN": targetPath = "/admin"; break;
        case "MANAGER": targetPath = "/manager"; break;
        case "PHARMACIST": targetPath = "/pos"; break;
        default: targetPath = "/dashboard"; break;
      }
    }
    
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Brand & Features */}
        <div className="w-full md:w-1/2 bg-[#1A1F37] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-yellow/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity w-fit">
              <div className="w-10 h-10 bg-primary-yellow rounded-xl flex items-center justify-center text-[#1A1F37]">
                <Building2 size={24} />
              </div>
              <span className="text-xl font-bold">PharmaOS</span>
            </Link>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Intelligent Pharmacy Management System
            </h1>
            <p className="text-gray-400 text-lg mb-12">
              Streamline your pharmacy operations with AI-powered insights and real-time analytics.
            </p>

            <div className="space-y-4">
              {[
                "Real-time inventory tracking",
                "AI-powered demand forecasting",
                "Expiry prediction & alerts"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-primary-success">
                    <Check size={14} className="text-primary-yellow" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center relative">
          <Link 
            href="/" 
            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 flex items-center gap-2 text-sm font-medium transition-colors"
          >
             <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome back!</h2>
            <p className="text-neutral-500">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                <Info size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all bg-neutral-50"
                placeholder="admin@pharmacy.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all bg-neutral-50"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-yellow focus:ring-primary-yellow" />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-yellow/20"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary-yellow-dark font-bold hover:underline">
                Get Started
              </Link>
            </div>
          </form>

          {/* One-Click Demo Login */}
          <div className="mt-6 p-5 bg-gradient-to-br from-[#1A1F37] to-[#2D3555] rounded-2xl shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-yellow/40"></div>
              <span className="text-xs font-bold text-primary-yellow uppercase tracking-widest">Quick Demo Access</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-yellow/40"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Retail Pharmacy */}
              <div className="bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-yellow rounded-full"></span>
                  Retail Pharmacy
                </h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@pharmacy.com", "ADMIN", "RETAIL")}
                    className="w-full py-2.5 px-4 bg-primary-yellow text-[#1A1F37] rounded-lg text-xs font-bold hover:bg-primary-yellow-dark hover:scale-[1.02] transition-all shadow-lg shadow-primary-yellow/20"
                  >
                    Admin Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("manager@pharmacy.com", "MANAGER", "RETAIL")}
                    className="w-full py-2.5 px-4 bg-white/10 text-white border border-white/20 rounded-lg text-xs font-semibold hover:bg-primary-yellow hover:text-[#1A1F37] hover:border-primary-yellow transition-all"
                  >
                    Manager Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("pharmacist@pharmacy.com", "PHARMACIST", "RETAIL")}
                    className="w-full py-2.5 px-4 bg-white/10 text-white border border-white/20 rounded-lg text-xs font-semibold hover:bg-primary-yellow hover:text-[#1A1F37] hover:border-primary-yellow transition-all"
                  >
                    Pharmacist POS
                  </button>
                </div>
              </div>

              {/* Hospital */}
              <div className="bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-yellow rounded-full"></span>
                  Hospital
                </h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@hospital.com", "ADMIN", "HOSPITAL")}
                    className="w-full py-2.5 px-4 bg-primary-yellow text-[#1A1F37] rounded-lg text-xs font-bold hover:bg-primary-yellow-dark hover:scale-[1.02] transition-all shadow-lg shadow-primary-yellow/20"
                  >
                    Admin Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("manager@hospital.com", "MANAGER", "HOSPITAL")}
                    className="w-full py-2.5 px-4 bg-white/10 text-white border border-white/20 rounded-lg text-xs font-semibold hover:bg-primary-yellow hover:text-[#1A1F37] hover:border-primary-yellow transition-all"
                  >
                    Manager Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("staff@hospital.com", "PHARMACIST", "HOSPITAL")}
                    className="w-full py-2.5 px-4 bg-white/10 text-white border border-white/20 rounded-lg text-xs font-semibold hover:bg-primary-yellow hover:text-[#1A1F37] hover:border-primary-yellow transition-all"
                  >
                    Staff Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
