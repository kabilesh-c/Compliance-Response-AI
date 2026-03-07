"use client";

export default function PrescriptionsCard() {
  const completionRate = 75;

  return (
    <div className="bg-primary-yellow rounded-card shadow-card p-6 h-full">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Prescriptions</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-neutral-900">124</div>
            <div className="text-sm text-neutral-700">Patients</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">98</div>
            <div className="text-sm text-neutral-700">Customers</div>
          </div>
        </div>
        <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-900">{completionRate}%</div>
            <div className="text-xs text-neutral-700">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
