from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import logging
from typing import List

from app.services.ml_service import (
    load_ml_models, 
    get_ml_status, 
    predict_demand, 
    predict_inventory_optimization,
    predict_expiry_risk
)
from app.api.schemas import (
    DemandForecastRequest, 
    InventoryOptimizationRequest, 
    BatchInventoryRequest,
    ExpiryPredictionRequest,
    BatchExpiryRequest
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting ML Service...")
    
    # Load ML models at startup
    success = load_ml_models()
    if success:
        logger.info("ML models loaded successfully")
    else:
        logger.warning("Failed to load some ML models")
        
    yield
    
    logger.info("Shutting down ML Service...")

app = FastAPI(
    title="Smart Pharmacy ML Service",
    description="Microservice for AI/ML predictions (Prophet, LightGBM, XGBoost)",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/health")
async def health_check():
    """Check service health and model status"""
    return get_ml_status()

@app.post("/forecast/demand")
async def forecast_demand_endpoint(request: DemandForecastRequest):
    """Forecast medicine demand for the next N days"""
    result = predict_demand(periods=request.periods)
    if result is None:
        raise HTTPException(status_code=503, detail="Demand forecasting model not available")
    return {"forecast": result}

@app.post("/inventory/optimize")
async def optimize_inventory_endpoint(request: InventoryOptimizationRequest):
    """Get optimal stock level recommendation for a medicine"""
    result = predict_inventory_optimization(
        medicine_id=request.medicine_id,
        quantity_received=int(request.current_stock),
        unit_cost=request.price,
        days_until_expiry=request.days_until_expiry,
        days_since_last_order=request.days_since_last_order,
        order_count=request.order_count,
        historical_qty_data=request.historical_qty_data
    )
    
    if result is None:
        raise HTTPException(status_code=503, detail="Inventory optimization model not available")
    return result

@app.post("/inventory/optimize/batch")
async def batch_optimize_inventory_endpoint(request: BatchInventoryRequest):
    """Batch optimize inventory"""
    results = []
    for item in request.medicines:
        res = predict_inventory_optimization(
            medicine_id=item.medicine_id,
            quantity_received=int(item.current_stock),
            unit_cost=item.price,
            days_until_expiry=item.days_until_expiry,
            days_since_last_order=item.days_since_last_order,
            order_count=item.order_count,
            historical_qty_data=item.historical_qty_data
        )
        if res:
            results.append(res)
        else:
            results.append({"medicine_id": item.medicine_id, "error": "Prediction failed"})
    return {"results": results}

@app.post("/expiry/predict")
async def predict_expiry_endpoint(request: ExpiryPredictionRequest):
    """Predict probability of medicine expiring"""
    result = predict_expiry_risk(
        medicine_id=request.medicine_id,
        supplier=request.supplier_id,
        days_until_expiry=request.days_until_expiry,
        stock_quantity=int(request.stock_quantity),
        unit_price=request.unit_price,
        estimated_daily_usage=request.avg_daily_sales
    )
    
    if result is None:
        raise HTTPException(status_code=503, detail="Expiry prediction model not available")
    return result

@app.post("/expiry/predict/batch")
async def batch_predict_expiry_endpoint(request: BatchExpiryRequest):
    """Batch predict expiry risk"""
    results = []
    for item in request.medicines:
        res = predict_expiry_risk(
            medicine_id=item.medicine_id,
            supplier=item.supplier_id,
            days_until_expiry=item.days_until_expiry,
            stock_quantity=int(item.stock_quantity),
            unit_price=item.unit_price,
            estimated_daily_usage=item.avg_daily_sales
        )
        if res:
            results.append(res)
        else:
            results.append({"medicine_id": item.medicine_id, "error": "Prediction failed"})
    return {"results": results}
