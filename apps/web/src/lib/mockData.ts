// Mock data for the pharmacy application

// Types
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  expiryDate: string;
  minStockLevel: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "expired";
  rack: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: { medicineId: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
}

// Mock Medicines Data
export const medicines: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "Painkillers", manufacturer: "Cipla", batchNumber: "PCM001", quantity: 150, unit: "tablets", costPrice: 18, sellingPrice: 25, expiryDate: "2026-06-15", minStockLevel: 50, stockStatus: "in-stock", rack: "A12" },
  { id: "2", name: "Amoxicillin 250mg", genericName: "Amoxicillin", category: "Antibiotics", manufacturer: "GSK", batchNumber: "AMX002", quantity: 80, unit: "capsules", costPrice: 90, sellingPrice: 120, expiryDate: "2025-08-20", minStockLevel: 30, stockStatus: "in-stock", rack: "B8" },
  { id: "3", name: "Ibuprofen 400mg", genericName: "Ibuprofen", category: "Painkillers", manufacturer: "Sun Pharma", batchNumber: "IBU003", quantity: 5, unit: "tablets", costPrice: 32, sellingPrice: 45, expiryDate: "2025-07-10", minStockLevel: 40, stockStatus: "low-stock", rack: "C5" },
  { id: "4", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Gastrointestinal", manufacturer: "Dr. Reddy's", batchNumber: "OMP004", quantity: 60, unit: "capsules", costPrice: 65, sellingPrice: 85, expiryDate: "2026-01-25", minStockLevel: 25, stockStatus: "in-stock", rack: "D3" },
  { id: "5", name: "Atorvastatin 10mg", genericName: "Atorvastatin", category: "Cardiovascular", manufacturer: "Zydus", batchNumber: "ATV005", quantity: 120, unit: "tablets", costPrice: 72, sellingPrice: 95, expiryDate: "2025-09-30", minStockLevel: 40, stockStatus: "in-stock", rack: "E7" },
  { id: "6", name: "Metformin 500mg", genericName: "Metformin", category: "Diabetes", manufacturer: "Lupin", batchNumber: "MTF006", quantity: 0, unit: "tablets", costPrice: 25, sellingPrice: 35, expiryDate: "2024-11-01", minStockLevel: 50, stockStatus: "out-of-stock", rack: "F2" },
  { id: "7", name: "Amlodipine 5mg", genericName: "Amlodipine", category: "Cardiovascular", manufacturer: "Torrent", batchNumber: "AML007", quantity: 3, unit: "tablets", costPrice: 40, sellingPrice: 55, expiryDate: "2025-07-22", minStockLevel: 30, stockStatus: "low-stock", rack: "G9" },
  { id: "8", name: "Losartan 50mg", genericName: "Losartan", category: "Cardiovascular", manufacturer: "Aurobindo", batchNumber: "LST008", quantity: 45, unit: "tablets", costPrice: 55, sellingPrice: 75, expiryDate: "2024-10-15", minStockLevel: 25, stockStatus: "expired", rack: "H4" },
  { id: "9", name: "Aspirin 75mg", genericName: "Acetylsalicylic Acid", category: "Cardiovascular", manufacturer: "Bayer", batchNumber: "ASP009", quantity: 200, unit: "tablets", costPrice: 10, sellingPrice: 15, expiryDate: "2024-09-20", minStockLevel: 60, stockStatus: "expired", rack: "I1" },
  { id: "10", name: "Ciprofloxacin 500mg", genericName: "Ciprofloxacin", category: "Antibiotics", manufacturer: "Cipla", batchNumber: "CPR010", quantity: 25, unit: "tablets", costPrice: 105, sellingPrice: 140, expiryDate: "2026-03-18", minStockLevel: 20, stockStatus: "in-stock", rack: "J6" },
  { id: "11", name: "Azithromycin 250mg", genericName: "Azithromycin", category: "Antibiotics", manufacturer: "Pfizer", batchNumber: "AZT011", quantity: 8, unit: "tablets", costPrice: 135, sellingPrice: 180, expiryDate: "2025-01-25", minStockLevel: 15, stockStatus: "low-stock", rack: "K3" },
  { id: "12", name: "Cetirizine 10mg", genericName: "Cetirizine", category: "Antihistamines", manufacturer: "UCB", batchNumber: "CTZ012", quantity: 90, unit: "tablets", costPrice: 22, sellingPrice: 30, expiryDate: "2026-02-28", minStockLevel: 40, stockStatus: "in-stock", rack: "L8" },
];

export const addMockMedicine = (medicine: Medicine) => {
  medicines.unshift(medicine);
};

// Mock Orders Data
export const orders: Order[] = [
  { id: "ORD001", customerName: "John Doe", items: [{ medicineId: "1", quantity: 2, price: 50 }, { medicineId: "4", quantity: 1, price: 85 }], total: 135, status: "completed", date: "2025-01-18", paymentMethod: "Cash" },
  { id: "ORD002", customerName: "Jane Smith", items: [{ medicineId: "2", quantity: 1, price: 120 }], total: 120, status: "completed", date: "2025-01-18", paymentMethod: "Card" },
  { id: "ORD003", customerName: "Bob Wilson", items: [{ medicineId: "5", quantity: 3, price: 285 }], total: 285, status: "pending", date: "2025-01-18", paymentMethod: "UPI" },
  { id: "ORD004", customerName: "Alice Brown", items: [{ medicineId: "12", quantity: 1, price: 30 }, { medicineId: "1", quantity: 1, price: 25 }], total: 55, status: "completed", date: "2025-01-17", paymentMethod: "Cash" },
  { id: "ORD005", customerName: "Charlie Davis", items: [{ medicineId: "10", quantity: 1, price: 140 }], total: 140, status: "pending", date: "2025-01-17", paymentMethod: "Card" },
];

// Sales Data for Charts
export const salesData = [
  { date: "Mon", sales: 12500, orders: 45 },
  { date: "Tue", sales: 15800, orders: 52 },
  { date: "Wed", sales: 11200, orders: 38 },
  { date: "Thu", sales: 18900, orders: 61 },
  { date: "Fri", sales: 14300, orders: 48 },
  { date: "Sat", sales: 16700, orders: 55 },
  { date: "Sun", sales: 13400, orders: 42 },
];

// Stock Movement Data
export const stockMovementData = [
  { date: "Mon", stockIn: 250, stockOut: 180 },
  { date: "Tue", stockIn: 120, stockOut: 220 },
  { date: "Wed", stockIn: 300, stockOut: 150 },
  { date: "Thu", stockIn: 80, stockOut: 280 },
  { date: "Fri", stockIn: 200, stockOut: 190 },
  { date: "Sat", stockIn: 150, stockOut: 210 },
  { date: "Sun", stockIn: 180, stockOut: 160 },
];

// Waste Analytics Data
export const wasteAnalytics = [
  { reason: "Expired", count: 23, value: 15420 },
  { reason: "Damaged", count: 8, value: 4200 },
  { reason: "Returned", count: 12, value: 6800 },
  { reason: "Overstock", count: 5, value: 3100 },
];

// Helper functions
export function getStockAlerts(): Medicine[] {
  return medicines.filter(m => m.stockStatus === "low-stock" || m.stockStatus === "out-of-stock");
}

export function getExpiredMedicines(): Medicine[] {
  return medicines.filter(m => m.stockStatus === "expired");
}

export function getExpiringSoonMedicines(days: number = 90): Medicine[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return medicines.filter(m => {
    if (m.stockStatus === "expired") return false;
    const expiry = new Date(m.expiryDate);
    return expiry > now && expiry <= futureDate;
  });
}
