from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DemandForecastRequest(BaseModel):
    """Request model for demand forecasting"""
    periods: int = Field(default=30, ge=1, le=365, description="Number of days to forecast")


class InventoryOptimizationRequest(BaseModel):
    """Request model for single medicine inventory optimization"""
    medicine_id: int
    current_stock: float = Field(ge=0, description="Current quantity on hand")
    avg_daily_sales: float = Field(ge=0, description="Average daily sales (units)")
    price: float = Field(ge=0, description="Unit cost/price")
    
    # Enhanced fields for better prediction
    days_until_expiry: int = Field(default=180, ge=0)
    days_since_last_order: int = Field(default=30, ge=0)
    order_count: int = Field(default=10, ge=0)
    historical_qty_data: Optional[List[float]] = Field(default=None, description="List of last 5 order quantities")


class BatchInventoryRequest(BaseModel):
    """Request model for batch inventory optimization"""
    medicines: List[InventoryOptimizationRequest] = Field(..., min_items=1, max_items=100)


class ExpiryPredictionRequest(BaseModel):
    """Request model for expiry prediction"""
    medicine_id: int
    medicine_name: str
    days_until_expiry: int = Field(ge=0)
    stock_quantity: float = Field(ge=0)
    avg_daily_sales: float = Field(ge=0)
    unit_price: float = Field(ge=0)
    supplier_id: int = Field(default=0, description="Supplier ID for feature engineering")


class BatchExpiryRequest(BaseModel):
    """Request model for batch expiry prediction"""
    medicines: List[ExpiryPredictionRequest] = Field(..., min_items=1, max_items=100)
