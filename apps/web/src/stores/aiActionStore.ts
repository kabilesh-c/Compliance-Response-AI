import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActionStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXECUTING" | "COMPLETED" | "FAILED";
export type ActionType = "REORDER" | "RETURN" | "TRANSFER" | "PRICE_ADJUSTMENT" | "WHATSAPP_ALERT";

export interface AIAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  status: ActionStatus;
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  data?: any; // Flexible payload for action details
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  rejectionReason?: string;
  executionLogs?: string[];
}

interface AIActionState {
  actions: AIAction[];
  
  // Actions
  addAction: (action: Omit<AIAction, "id" | "createdAt" | "updatedAt" | "status">) => void;
  approveAction: (id: string, userId: string) => void;
  rejectAction: (id: string, userId: string, reason: string) => void;
  executeAction: (id: string) => Promise<void>;
  getPendingActions: () => AIAction[];
  getExecutingActions: () => AIAction[];
  getCompletedActions: () => AIAction[];
}

// Mock initial data
const INITIAL_ACTIONS: AIAction[] = [
  {
    id: "1",
    type: "REORDER",
    title: "Reorder Amoxicillin 500mg",
    description: "Stock below safety level (15 units). Predicted demand: 40 units/week.",
    status: "PENDING",
    priority: "HIGH",
    confidence: 0.92,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      medicineId: "med-123",
      quantity: 100,
      supplierId: "sup-001"
    }
  },
  {
    id: "2",
    type: "RETURN",
    title: "Return Expiring Insulin",
    description: "Batch B-992 expiring in 15 days. Low movement probability.",
    status: "PENDING",
    priority: "MEDIUM",
    confidence: 0.88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      batchId: "B-992",
      quantity: 12,
      supplierId: "sup-002"
    }
  },
  {
    id: "3",
    type: "WHATSAPP_ALERT",
    title: "Staff Shortage Alert",
    description: "Predicted high footfall on Saturday evening. Suggest calling in backup.",
    status: "PENDING",
    priority: "LOW",
    confidence: 0.75,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      shift: "Saturday Evening",
      requiredStaff: 1
    }
  }
];

export const useAIActionStore = create<AIActionState>()(
  persist(
    (set, get) => ({
      actions: INITIAL_ACTIONS,

      addAction: (action) => {
        const newAction: AIAction = {
          ...action,
          id: Math.random().toString(36).substring(7),
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ actions: [newAction, ...state.actions] }));
      },

      approveAction: (id, userId) => {
        set((state) => ({
          actions: state.actions.map((a) =>
            a.id === id
              ? { ...a, status: "APPROVED", approvedBy: userId, updatedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      rejectAction: (id, userId, reason) => {
        set((state) => ({
          actions: state.actions.map((a) =>
            a.id === id
              ? { ...a, status: "REJECTED", approvedBy: userId, rejectionReason: reason, updatedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      executeAction: async (id) => {
        // Simulate execution
        set((state) => ({
          actions: state.actions.map((a) =>
            a.id === id ? { ...a, status: "EXECUTING", updatedAt: new Date().toISOString() } : a
          ),
        }));

        // Mock delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        set((state) => ({
          actions: state.actions.map((a) =>
            a.id === id
              ? { 
                  ...a, 
                  status: "COMPLETED", 
                  updatedAt: new Date().toISOString(),
                  executionLogs: [...(a.executionLogs || []), `Executed successfully at ${new Date().toLocaleTimeString()}`]
                }
              : a
          ),
        }));
      },

      getPendingActions: () => get().actions.filter((a) => a.status === "PENDING"),
      getExecutingActions: () => get().actions.filter((a) => a.status === "EXECUTING"),
      getCompletedActions: () => get().actions.filter((a) => a.status === "COMPLETED"),
    }),
    {
      name: "ai-action-storage",
    }
  )
);
