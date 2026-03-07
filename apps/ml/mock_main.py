from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import random
from datetime import datetime, timedelta

# --- Schemas (Copied to avoid dependency issues) ---

class DemandForecastRequest(BaseModel):
    periods: int = Field(default=30, ge=1, le=365)

class InventoryOptimizationRequest(BaseModel):
    medicine_id: int
    current_stock: float
    avg_daily_sales: float
    price: float
    days_until_expiry: int = 180
    days_since_last_order: int = 30
    order_count: int = 10
    historical_qty_data: Optional[List[float]] = None

class BatchInventoryRequest(BaseModel):
    medicines: List[InventoryOptimizationRequest]

class ExpiryPredictionRequest(BaseModel):
    medicine_id: int
    medicine_name: str
    days_until_expiry: int
    stock_quantity: float
    avg_daily_sales: float
    unit_price: float
    supplier_id: int = 0

class BatchExpiryRequest(BaseModel):
    medicines: List[ExpiryPredictionRequest]

# --- Mock App ---

app = FastAPI(
    title="Smart Pharmacy ML Service (MOCK)",
    description="Mock Microservice for AI/ML predictions (Running on Python 3.14)",
    version="1.0.0-mock"
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": True,
        "model_info": {
            "demand_forecast": "MOCK",
            "inventory_optimization": "MOCK",
            "expiry_prediction": "MOCK"
        },
        "python_version": "3.14.0 (Mock Mode)"
    }

@app.post("/forecast/demand")
async def forecast_demand_endpoint(request: DemandForecastRequest):
    # Generate a mock forecast
    forecast_data = []
    today = datetime.now()
    
    # Create a trend with some seasonality and noise
    base_value = 100
    for i in range(request.periods):
        date = today + timedelta(days=i)
        # Simple sine wave + random noise
        value = base_value + (random.sin(i * 0.5) * 20) + random.uniform(-10, 10)
        forecast_data.append({
            "ds": date.strftime("%Y-%m-%d"),
            "yhat": max(0, round(value, 2)),
            "yhat_lower": max(0, round(value - 15, 2)),
            "yhat_upper": max(0, round(value + 15, 2))
        })
        
    return {"forecast": forecast_data}

@app.post("/inventory/optimize")
async def optimize_inventory_endpoint(request: InventoryOptimizationRequest):
    # Mock logic
    recommended_stock = request.avg_daily_sales * 30 # 30 days of stock
    reorder_point = request.avg_daily_sales * 7 # 7 days lead time
    
    action = "maintain"
    if request.current_stock < reorder_point:
        action = "reorder"
    elif request.current_stock > recommended_stock * 1.5:
        action = "reduce"
        
    return {
        "medicine_id": request.medicine_id,
        "recommended_stock": round(recommended_stock, 2),
        "reorder_point": round(reorder_point, 2),
        "action": action,
        "confidence_score": round(random.uniform(0.8, 0.99), 2),
        "reason": f"Mock analysis based on daily sales of {request.avg_daily_sales}"
    }

@app.post("/inventory/optimize/batch")
async def batch_optimize_inventory_endpoint(request: BatchInventoryRequest):
    results = []
    for item in request.medicines:
        # Reuse logic
        recommended_stock = item.avg_daily_sales * 30
        reorder_point = item.avg_daily_sales * 7
        
        action = "maintain"
        if item.current_stock < reorder_point:
            action = "reorder"
        elif item.current_stock > recommended_stock * 1.5:
            action = "reduce"
            
        results.append({
            "medicine_id": item.medicine_id,
            "recommended_stock": round(recommended_stock, 2),
            "reorder_point": round(reorder_point, 2),
            "action": action,
            "confidence_score": round(random.uniform(0.8, 0.99), 2),
            "reason": f"Mock analysis based on daily sales of {item.avg_daily_sales}"
        })
    return {"results": results}

@app.post("/expiry/predict")
async def predict_expiry_endpoint(request: ExpiryPredictionRequest):
    # Mock logic: higher risk if closer to expiry
    risk_score = 0.0
    if request.days_until_expiry < 30:
        risk_score = random.uniform(0.7, 0.95)
    elif request.days_until_expiry < 90:
        risk_score = random.uniform(0.3, 0.6)
    else:
        risk_score = random.uniform(0.0, 0.2)
        
    return {
        "medicine_id": request.medicine_id,
        "expiry_risk_score": round(risk_score, 2),
        "predicted_waste_quantity": round(request.stock_quantity * risk_score * 0.5, 2), # Guessing half might be wasted if high risk
        "recommendation": "Discount" if risk_score > 0.6 else "Monitor"
    }

@app.post("/expiry/predict/batch")
async def batch_predict_expiry_endpoint(request: BatchExpiryRequest):
    results = []
    for item in request.medicines:
        risk_score = 0.0
        if item.days_until_expiry < 30:
            risk_score = random.uniform(0.7, 0.95)
        elif item.days_until_expiry < 90:
            risk_score = random.uniform(0.3, 0.6)
        else:
            risk_score = random.uniform(0.0, 0.2)
            
        results.append({
            "medicine_id": item.medicine_id,
            "expiry_risk_score": round(risk_score, 2),
            "predicted_waste_quantity": round(item.stock_quantity * risk_score * 0.5, 2),
            "recommendation": "Discount" if risk_score > 0.6 else "Monitor"
        })
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
