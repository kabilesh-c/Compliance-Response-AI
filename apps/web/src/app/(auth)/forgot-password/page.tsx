"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, Info } from "lucide-react";
import { sendPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Back to Login Link */}
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>

          {success ? (
            // Success State
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                Check Your Email
              </h1>
              <p className="text-neutral-600 mb-8">
                We've sent a password reset link to
              </p>
              <p className="text-neutral-900 font-semibold mb-8 break-all">
                {email}
              </p>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-neutral-700 mb-6">
                <div className="flex items-start gap-2">
                  <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-left">
                    Click the link in the email to reset your password. 
                    If you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="w-full py-3 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-colors inline-block text-center"
              >
                Back to Login
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full mt-3 py-3 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
              >
                Send Another Reset Link
              </button>
            </div>
          ) : (
            // Form State
            <>
              <div className="mb-8">
                <div className="w-14 h-14 bg-primary-yellow/10 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="text-yellow-700" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-neutral-600">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
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
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary-yellow text-neutral-900 font-bold rounded-xl hover:bg-primary-yellow-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-yellow/20"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      Send Reset Link
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-neutral-500">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary-yellow-dark font-bold hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          Need help?{" "}
          <a href="mailto:support@pharmaos.com" className="text-primary-yellow-dark font-semibold hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
