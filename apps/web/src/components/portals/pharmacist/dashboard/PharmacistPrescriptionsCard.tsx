"use client";

export default function PharmacistPrescriptionsCard() {
  const completionRate = 75;

  return (
    <div className="bg-primary-green rounded-card shadow-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Prescriptions</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-white">124</div>
            <div className="text-sm text-white/90">Patients</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">98</div>
            <div className="text-sm text-white/90">Customers</div>
          </div>
        </div>
        <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <div className="text-xs text-white/90">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
