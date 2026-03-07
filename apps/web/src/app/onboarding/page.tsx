import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Link from "next/link";
import { Suspense } from "react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Simple Header */}
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
        <Suspense fallback={<div>Loading...</div>}>
          <OnboardingForm />
        </Suspense>
      </main>
    </div>
  );
}
