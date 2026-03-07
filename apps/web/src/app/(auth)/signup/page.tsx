"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Store, ArrowRight, UserPlus } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function SignupPage() {
  const router = useRouter();
  const { login, setMode } = useAuthStore();
  const [view, setView] = useState<"choice" | "join">("choice");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgCode: "",
    role: "PHARMACIST",
    mode: "RETAIL" as "RETAIL" | "HOSPITAL",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Determine mode based on selection
      const mode = formData.mode;

      // Call API
      const { user, token } = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as any,
        orgCode: formData.orgCode,
        mode: mode
      });

      // Login and set mode
      login(user, token);
      setMode(mode);

      // Redirect based on role and mode
      if (mode === "HOSPITAL") {
        switch (formData.role) {
          case "ADMIN":
            router.push("/admin");
            break;
          case "MANAGER":
            router.push("/manager");
            break;
          case "PHARMACIST": // Staff
            router.push("/hospital/staff");
            break;
          default:
            router.push("/hospital/staff");
        }
      } else {
        // Retail redirects
        switch (formData.role) {
          case "ADMIN":
            router.push("/admin/dashboard");
            break;
          case "MANAGER":
            router.push("/manager");
            break;
          case "PHARMACIST":
            router.push("/pharmacist/dashboard");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-yellow to-primary-yellow-dark rounded-lg flex items-center justify-center text-neutral-900 font-bold text-lg">
              Rx
            </div>
            <span className="text-xl font-bold text-neutral-900">PharmaOS</span>
          </Link>
          <div className="text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-yellow-dark font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {view === "choice" ? (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                How do you want to use PharmaOS?
              </h1>
              <p className="text-lg text-neutral-600">
                Choose how you'd like to get started with our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Option 1: Create New Organization */}
              <Link 
                href="/onboarding"
                className="group relative bg-white p-8 rounded-3xl border-2 border-neutral-200 hover:border-primary-yellow hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left"
              >
                <div className="w-14 h-14 bg-primary-yellow/10 rounded-2xl flex items-center justify-center text-yellow-700 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Store size={32} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                  Register New Pharmacy
                </h2>
                <p className="text-neutral-600 mb-8 flex-1">
                  I am an owner or administrator setting up a new pharmacy or hospital organization from scratch.
                </p>
                <div className="flex items-center gap-2 text-primary-yellow-dark font-bold group-hover:translate-x-2 transition-transform">
                  Start Registration <ArrowRight size={20} />
                </div>
              </Link>

              {/* Option 2: Join Existing Organization */}
              <button 
                onClick={() => setView("join")}
                className="group relative bg-white p-8 rounded-3xl border-2 border-neutral-200 hover:border-primary-yellow hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus size={32} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                  Join Existing Team
                </h2>
                <p className="text-neutral-600 mb-8 flex-1">
                  I am a pharmacist, manager, or staff member joining an organization that already uses PharmaOS.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                  Join Team <ArrowRight size={20} />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border-t-4 border-primary-yellow">
            <button 
              onClick={() => setView("choice")}
              className="text-sm text-neutral-500 hover:text-neutral-900 mb-6 flex items-center gap-1"
            >
              ← Back to options
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900">Join Your Team</h1>
              <p className="text-neutral-600 mt-2">Enter your details and organization code</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Organization Code
                </label>
                <input
                  type="text"
                  value={formData.orgCode}
                  onChange={(e) => setFormData({ ...formData, orgCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal"
                  placeholder="e.g. PH-1234"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Ask your administrator for this code.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Operating Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: "RETAIL" })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      formData.mode === "RETAIL"
                        ? "border-primary-yellow bg-primary-yellow/10 text-neutral-900"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    Retail Pharmacy
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: "HOSPITAL" })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      formData.mode === "HOSPITAL"
                        ? "border-primary-yellow bg-primary-yellow/10 text-neutral-900"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    Hospital
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all bg-white"
                  >
                    {formData.mode === "RETAIL" ? (
                      <>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="PHARMACIST">Pharmacist</option>
                      </>
                    ) : (
                      <>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="PHARMACIST">Staff / Nurse</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Create Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
