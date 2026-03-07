import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export class MLService {
  
  /**
   * Get demand forecast for a specific medicine or global
   * @param periods Number of days to forecast
   */
  async getDemandForecast(periods: number = 30) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/forecast/demand`, {
        periods
      });
      return response.data;
    } catch (error) {
      console.error('ML Service Error (Demand Forecast):', error);
      throw new Error('Failed to get demand forecast from ML service');
    }
  }

  /**
   * Get inventory optimization recommendation for a medicine
   * Aggregates data from Prisma to feed the ML model
   */
  async optimizeInventory(productId: string) {
    try {
      // 1. Fetch Product Details with Inventory and Sales History
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          inventories: {
            orderBy: { createdAt: 'desc' }, // To find last "order" (batch received)
            include: {
              saleItems: {
                where: {
                  createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
                  }
                }
              }
            }
          }
        }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // 2. Calculate Derived Features
      
      // Current Stock (Sum of all batches)
      const currentStock = product.inventories.reduce((sum, inv) => sum + inv.quantity, 0);

      // Days until expiry (min of all batches that have an expiry date)
      const now = new Date();
      const expiryDates = product.inventories
        .filter(inv => inv.expiryDate)
        .map(inv => inv.expiryDate!.getTime());
      
      const minExpiry = expiryDates.length > 0 ? Math.min(...expiryDates) : now.getTime() + (180 * 24 * 60 * 60 * 1000); // Default 180 days
      const daysUntilExpiry = Math.max(0, Math.ceil((minExpiry - now.getTime()) / (1000 * 60 * 60 * 24)));

      // Average Daily Sales (Last 30 days)
      // Sum sales across all inventory batches
      const totalSales30Days = product.inventories.reduce((total, inv) => {
        return total + inv.saleItems.reduce((batchSales, item) => batchSales + item.quantity, 0);
      }, 0);
      
      const avgDailySales = totalSales30Days / 30;

      // Purchase History (Simulated from Inventory records)
      // We treat each Inventory record as a "Purchase Order" / "Batch Received"
      const lastOrder = product.inventories[0]; // Most recent batch
      const daysSinceLastOrder = lastOrder 
        ? Math.ceil((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        : 30; // Default
      
      const historicalQtyData = product.inventories
        .slice(0, 5)
        .map(inv => inv.quantity);
      
      // Pad with current stock if not enough history
      while (historicalQtyData.length < 5) {
        historicalQtyData.push(currentStock);
      }

      // Price (Use cost price from most recent batch, or 0)
      const price = lastOrder ? Number(lastOrder.costPrice) : 0;

      // 3. Call ML Service
      // Note: medicine_id is passed as a hash because ML expects int, but we use UUID
      const medicineIdHash = this.hashStringToInt(productId);

      const payload = {
        medicine_id: medicineIdHash,
        current_stock: currentStock,
        avg_daily_sales: avgDailySales,
        price: price,
        days_until_expiry: daysUntilExpiry,
        days_since_last_order: daysSinceLastOrder,
        order_count: product.inventories.length, // Approximation of order count
        historical_qty_data: historicalQtyData
      };

      const response = await axios.post(`${ML_SERVICE_URL}/inventory/optimize`, payload);
      
      return {
        ...response.data,
        productId: productId // Return the original UUID
      };

    } catch (error) {
      console.error('ML Service Error (Inventory Optimization):', error);
      throw new Error('Failed to optimize inventory');
    }
  }

  /**
   * Predict expiry risk for a medicine
   */
  async predictExpiryRisk(productId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          inventories: {
            include: {
              saleItems: {
                where: {
                  createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30))
                  }
                }
              }
            }
          }
        }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const currentStock = product.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
      
      const totalSales30Days = product.inventories.reduce((total, inv) => {
        return total + inv.saleItems.reduce((batchSales, item) => batchSales + item.quantity, 0);
      }, 0);
      
      const avgDailySales = totalSales30Days / 30;
      
      // Calculate days until expiry
      const now = new Date();
      const expiryDates = product.inventories
        .filter(inv => inv.expiryDate)
        .map(b => b.expiryDate!.getTime());
      
      const minExpiry = expiryDates.length > 0 ? Math.min(...expiryDates) : now.getTime() + (365 * 24 * 60 * 60 * 1000);
      const daysUntilExpiry = Math.max(0, Math.ceil((minExpiry - now.getTime()) / (1000 * 60 * 60 * 24)));

      // Price
      const lastOrder = product.inventories[0];
      const price = lastOrder ? Number(lastOrder.costPrice) : 0;

      const payload = {
        medicine_id: this.hashStringToInt(productId),
        medicine_name: product.name,
        days_until_expiry: daysUntilExpiry,
        stock_quantity: currentStock,
        avg_daily_sales: avgDailySales,
        unit_price: price,
        supplier_id: 0 // Placeholder
      };

      const response = await axios.post(`${ML_SERVICE_URL}/expiry/predict`, payload);
      
      return {
        ...response.data,
        productId: productId
      };

    } catch (error) {
      console.error('ML Service Error (Expiry Prediction):', error);
      throw new Error('Failed to predict expiry risk');
    }
  }

  private hashStringToInt(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 10000); // Keep it reasonably small for ML model
  }
}
