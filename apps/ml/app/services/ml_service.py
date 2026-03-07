"""
Integrated ML Service - Loads and runs ML models directly
"""
import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)

# ML Models storage (loaded once at startup)
_ml_models: Dict[str, Any] = {
    "demand_prophet": None,
    "demand_lgb": None,
    "inventory_lgb": None,
    "expiry_xgb": None,
}

_models_loaded = False

# Model paths - relative to this file: apps/ml/app/services/ml_service.py -> apps/ml/models
ML_MODELS_PATH = Path(__file__).parent.parent.parent / "models"


def load_ml_models() -> bool:
    """Load all ML models at startup - call this once when server starts"""
    global _ml_models, _models_loaded
    
    if _models_loaded:
        return True
    
    try:
        import joblib
    except ImportError:
        logger.warning("joblib not installed. Installing...")
        os.system("pip install joblib")
        try:
            import joblib
        except ImportError:
            logger.error("Failed to install joblib. ML features disabled.")
            return False
    
    models_count = 0
    
    # Load Prophet demand forecasting model
    prophet_path = ML_MODELS_PATH / "demand_forecasting_prophet.pkl"
    if prophet_path.exists():
        try:
            _ml_models["demand_prophet"] = joblib.load(prophet_path)
            logger.info("  [OK] Demand forecasting (Prophet) model loaded")
            models_count += 1
        except Exception as e:
            logger.warning(f"  [FAIL] Failed to load Prophet model: {e}")
    else:
        logger.warning(f"  Prophet model not found at {prophet_path}")
    
    # Load LightGBM demand model
    lgb_demand_path = ML_MODELS_PATH / "demand_forecasting_lgb.pkl"
    if lgb_demand_path.exists():
        try:
            _ml_models["demand_lgb"] = joblib.load(lgb_demand_path)
            logger.info("  [OK] Demand forecasting (LightGBM) model loaded")
            models_count += 1
        except Exception as e:
            logger.warning(f"  [FAIL] Failed to load LightGBM demand model: {e}")
    
    # Load Inventory optimization model
    inv_path = ML_MODELS_PATH / "inventory_optimization_lgb.pkl"
    if inv_path.exists():
        try:
            _ml_models["inventory_lgb"] = joblib.load(inv_path)
            logger.info("  [OK] Inventory optimization model loaded")
            models_count += 1
        except Exception as e:
            logger.warning(f"  [FAIL] Failed to load inventory model: {e}")
    
    # Load Expiry prediction model
    expiry_path = ML_MODELS_PATH / "expiry_prediction_xgb.pkl"
    if expiry_path.exists():
        try:
            _ml_models["expiry_xgb"] = joblib.load(expiry_path)
            logger.info("  [OK] Expiry prediction model loaded")
            models_count += 1
        except Exception as e:
            logger.warning(f"  [FAIL] Failed to load expiry model: {e}")
    
    _models_loaded = models_count > 0
    logger.info(f"ML Service: {models_count}/4 models loaded from {ML_MODELS_PATH}")
    return _models_loaded


def get_ml_status() -> Dict[str, Any]:
    """Get status of all ML models"""
    return {
        "ml_available": _models_loaded,
        "demand_prophet_loaded": _ml_models["demand_prophet"] is not None,
        "demand_lgb_loaded": _ml_models["demand_lgb"] is not None,
        "inventory_loaded": _ml_models["inventory_lgb"] is not None,
        "expiry_loaded": _ml_models["expiry_xgb"] is not None,
        "models_path": str(ML_MODELS_PATH),
        "models_exist": ML_MODELS_PATH.exists()
    }


def predict_demand(periods: int = 28) -> Optional[List[Dict[str, Any]]]:
    """
    Predict demand using Prophet model
    Returns list of predictions for next N periods (days)
    """
    model = _ml_models.get("demand_prophet")
    if model is None:
        logger.debug("Prophet model not loaded")
        return None
    
    try:
        # Create future dataframe for prediction
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        
        # Get only future predictions (last N rows)
        future_forecast = forecast.tail(periods)
        
        predictions = []
        for _, row in future_forecast.iterrows():
            predictions.append({
                "date": row['ds'].strftime('%Y-%m-%d'),
                "predicted_demand": max(0, float(row['yhat'])),
                "lower_bound": max(0, float(row['yhat_lower'])),
                "upper_bound": max(0, float(row['yhat_upper']))
            })
        
        return predictions
    
    except Exception as e:
        logger.error(f"Error in demand prediction: {e}")
        return None


def predict_inventory_optimization(
    medicine_id: int,
    quantity_received: int,
    unit_cost: float,
    days_until_expiry: int = 180,
    days_since_last_order: int = 30,
    order_count: int = 10,
    historical_qty_data: Optional[List[float]] = None
) -> Optional[Dict[str, Any]]:
    """
    Predict optimal inventory levels using LightGBM model.
    Features MUST match training data: inventory_features.json (43 features)
    """
    model = _ml_models.get("inventory_lgb")
    if model is None:
        return None
    
    try:
        import pandas as pd
        import numpy as np
        
        now = datetime.now()
        
        # Use historical data if provided, otherwise use quantity_received as proxy
        if historical_qty_data and len(historical_qty_data) >= 5:
            hist = historical_qty_data
        else:
            # Create synthetic history based on quantity_received
            hist = [float(quantity_received)] * 5
        
        # Calculate rolling statistics
        qty_2 = hist[-2:] if len(hist) >= 2 else hist
        qty_3 = hist[-3:] if len(hist) >= 3 else hist
        qty_5 = hist[-5:] if len(hist) >= 5 else hist
        
        total_cost = quantity_received * unit_cost
        cumulative_qty = sum(hist) if hist else quantity_received
        cumulative_cost = cumulative_qty * unit_cost
        avg_unit_cost = unit_cost  # Using current as average
        estimated_daily_demand = quantity_received / 30.0 if quantity_received > 0 else 1
        demand_cv = np.std(hist) / np.mean(hist) if np.mean(hist) > 0 else 0.2
        
        # Prepare ALL 43 features in EXACT order from inventory_features.json
        features = pd.DataFrame([{
            'medicine_id': medicine_id,
            'quantity_received': quantity_received,
            'unit_cost': unit_cost,
            'total_cost': total_cost,
            'days_until_expiry': days_until_expiry,
            'day_of_week': now.weekday(),
            'day_of_month': now.day,
            'month': now.month,
            'quarter': (now.month - 1) // 3 + 1,
            'is_weekend': 1 if now.weekday() >= 5 else 0,
            'is_month_start': 1 if now.day <= 3 else 0,
            'is_month_end': 1 if now.day >= 28 else 0,
            'is_quarter_start': 1 if now.month in [1, 4, 7, 10] and now.day <= 3 else 0,
            'is_quarter_end': 1 if now.month in [3, 6, 9, 12] and now.day >= 28 else 0,
            'days_since_last_order': days_since_last_order,
            'qty_rolling_2orders_mean': np.mean(qty_2),
            'qty_rolling_2orders_std': np.std(qty_2) if len(qty_2) > 1 else 0,
            'qty_rolling_2orders_max': np.max(qty_2),
            'qty_rolling_2orders_min': np.min(qty_2),
            'qty_rolling_3orders_mean': np.mean(qty_3),
            'qty_rolling_3orders_std': np.std(qty_3) if len(qty_3) > 1 else 0,
            'qty_rolling_3orders_max': np.max(qty_3),
            'qty_rolling_3orders_min': np.min(qty_3),
            'qty_rolling_5orders_mean': np.mean(qty_5),
            'qty_rolling_5orders_std': np.std(qty_5) if len(qty_5) > 1 else 0,
            'qty_rolling_5orders_max': np.max(qty_5),
            'qty_rolling_5orders_min': np.min(qty_5),
            'qty_lag_1': hist[-1] if len(hist) >= 1 else quantity_received,
            'qty_lag_2': hist[-2] if len(hist) >= 2 else quantity_received,
            'qty_lag_3': hist[-3] if len(hist) >= 3 else quantity_received,
            'cumulative_qty': cumulative_qty,
            'cumulative_cost': cumulative_cost,
            'avg_order_cycle_days': days_since_last_order,
            'estimated_daily_demand': estimated_daily_demand,
            'avg_unit_cost': avg_unit_cost,
            'unit_cost_diff_from_avg': 0,  # No difference if we only have current
            'unit_cost_volatility': unit_cost * 0.05,  # Assume 5% volatility
            'order_count': order_count,
            'demand_cv': demand_cv,
            'lead_time_days': 7,  # Standard lead time assumption
            'demand_cost_interaction': estimated_daily_demand * unit_cost,
            'volatility_lead_time': demand_cv * 7,
            'cost_per_day_inventory': unit_cost / 30.0,
            'stock_turnover_ratio': 12.0 if estimated_daily_demand > 0 else 1.0,  # Monthly turnover
            'medicine_popularity': min(1.0, order_count / 20.0)  # Normalized popularity
        }])
        
        # Ensure column order matches training
        feature_cols = [
            'medicine_id', 'quantity_received', 'unit_cost', 'total_cost', 'days_until_expiry',
            'day_of_week', 'day_of_month', 'month', 'quarter', 'is_weekend', 'is_month_start',
            'is_month_end', 'is_quarter_start', 'is_quarter_end', 'days_since_last_order',
            'qty_rolling_2orders_mean', 'qty_rolling_2orders_std', 'qty_rolling_2orders_max',
            'qty_rolling_2orders_min', 'qty_rolling_3orders_mean', 'qty_rolling_3orders_std',
            'qty_rolling_3orders_max', 'qty_rolling_3orders_min', 'qty_rolling_5orders_mean',
            'qty_rolling_5orders_std', 'qty_rolling_5orders_max', 'qty_rolling_5orders_min',
            'qty_lag_1', 'qty_lag_2', 'qty_lag_3', 'cumulative_qty', 'cumulative_cost',
            'avg_order_cycle_days', 'estimated_daily_demand', 'avg_unit_cost', 'unit_cost_diff_from_avg',
            'unit_cost_volatility', 'order_count', 'demand_cv', 'lead_time_days',
            'demand_cost_interaction', 'volatility_lead_time', 'cost_per_day_inventory',
            'stock_turnover_ratio', 'medicine_popularity'
        ]
        features = features[feature_cols]
        
        # Make prediction
        optimal_stock = float(model.predict(features)[0])
        
        # Ensure reasonable bounds
        optimal_stock = max(0, optimal_stock)
        
        return {
            "medicine_id": medicine_id,
            "current_stock": quantity_received,
            "optimal_stock": round(optimal_stock),
            "reorder_quantity": max(0, round(optimal_stock - quantity_received)),
            "days_of_stock": round(quantity_received / estimated_daily_demand) if estimated_daily_demand > 0 else 999,
            "source": "ML Model (LightGBM)"
        }
    
    except Exception as e:
        logger.error(f"Error in inventory prediction: {e}")
        return None


def predict_expiry_risk(
    medicine_id: int,
    supplier: int,
    days_until_expiry: int,
    stock_quantity: int,
    unit_price: float,
    estimated_daily_usage: float
) -> Optional[Dict[str, Any]]:
    """
    Predict expiry/waste risk using XGBoost model.
    Features MUST match training data: expiry_features.json
    """
    model = _ml_models.get("expiry_xgb")
    if model is None:
        return None
    
    try:
        import pandas as pd
        
        # Calculate derived features to match training exactly
        total_value = stock_quantity * unit_price
        days_to_sellout = stock_quantity / estimated_daily_usage if estimated_daily_usage > 0 else 999
        months_until_expiry = days_until_expiry / 30.0
        stock_rotation_ratio = days_until_expiry / days_to_sellout if days_to_sellout > 0 else 0
        
        # Boolean features (as int)
        is_fast_moving = 1 if estimated_daily_usage > 5 else 0  # High daily usage
        is_expensive = 1 if unit_price > 10 else 0  # Price > 10 INR per tablet
        is_large_batch = 1 if stock_quantity > 500 else 0  # Large stock
        is_short_shelf_life = 1 if days_until_expiry < 90 else 0  # < 3 months
        
        # Prepare features in EXACT order from expiry_features.json
        features = pd.DataFrame([{
            'medicine_id': medicine_id,
            'supplier': supplier,
            'days_until_expiry': days_until_expiry,
            'stock_quantity': stock_quantity,
            'unit_price': unit_price,
            'total_value': total_value,
            'estimated_daily_usage': estimated_daily_usage,
            'days_to_sellout': days_to_sellout,
            'months_until_expiry': months_until_expiry,
            'stock_rotation_ratio': stock_rotation_ratio,
            'is_fast_moving': is_fast_moving,
            'is_expensive': is_expensive,
            'is_large_batch': is_large_batch,
            'is_short_shelf_life': is_short_shelf_life
        }])
        
        # Ensure column order matches training
        feature_cols = [
            'medicine_id', 'supplier', 'days_until_expiry', 'stock_quantity',
            'unit_price', 'total_value', 'estimated_daily_usage', 'days_to_sellout',
            'months_until_expiry', 'stock_rotation_ratio', 'is_fast_moving',
            'is_expensive', 'is_large_batch', 'is_short_shelf_life'
        ]
        features = features[feature_cols]
        
        # Make prediction
        if hasattr(model, 'predict_proba'):
            risk_prob = float(model.predict_proba(features)[0][1])
        else:
            # Model may return class directly
            prediction = float(model.predict(features)[0])
            risk_prob = prediction if 0 <= prediction <= 1 else (1.0 if prediction > 0.5 else 0.0)
        
        # Determine risk level from probability
        if risk_prob > 0.7:
            risk_level = "HIGH"
            recommendation = "Urgent: Apply discount or return to supplier"
        elif risk_prob > 0.4:
            risk_level = "MEDIUM"
            recommendation = "Consider promotional pricing"
        else:
            risk_level = "LOW"
            recommendation = "Stock is moving well"
        
        return {
            "risk_probability": round(risk_prob, 3),
            "risk_level": risk_level,
            "recommendation": recommendation,
            "days_to_expiry": days_until_expiry,
            "expected_units_sold": round(estimated_daily_usage * days_until_expiry),
            "potential_waste": max(0, stock_quantity - round(estimated_daily_usage * days_until_expiry)),
            "source": "ML Model (XGBoost)"
        }
    
    except Exception as e:
        logger.error(f"Error in expiry prediction: {e}")
        return None


def predict_demand_lgb(sales_history: List[Dict[str, Any]]) -> Optional[float]:
    """Predict daily demand using LightGBM model (qty-only).

    IMPORTANT (enforced): This function must NOT use revenue/amount/price fields.
    Input expects dicts with at least: {'date': 'YYYY-MM-DD', 'qty': int|float}
    """
    model = _ml_models.get("demand_lgb")
    if model is None or not sales_history:
        return None
        
    try:
        import pandas as pd
        import numpy as np
        
        # Convert history to DataFrame
        df = pd.DataFrame(sales_history)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Aggregate to weekly (matching training data)
        df['week_start'] = df['date'].dt.to_period('W').dt.start_time
        weekly = df.groupby('week_start').agg({
            'qty': 'sum',
            'date': 'count'
        }).reset_index()

        # Model was trained with a column called 'cost'. We keep feature shape but MUST NOT
        # feed revenue-derived values. So we set 'cost' to 0 for all rows.
        weekly['cost'] = 0
        weekly.columns = ['ds', 'y', 'order_count', 'cost']
        weekly = weekly[['ds', 'y', 'cost', 'order_count']]
        weekly['medicine_count'] = 1
        
        # Add future row for prediction
        last_date = weekly['ds'].max()
        future_date = last_date + timedelta(days=7)
        future_row = pd.DataFrame([{
            'ds': future_date,
            'y': np.nan, # Target to predict
            'cost': 0,
            'order_count': 0,
            'medicine_count': 1
        }])
        
        # Combine for feature engineering
        combined = pd.concat([weekly, future_row], ignore_index=True)
        
        # Feature Engineering (must match training/preprocess_zenith.py)
        combined['is_month_start'] = combined['ds'].dt.is_month_start.astype(int)
        combined['is_month_end'] = combined['ds'].dt.is_month_end.astype(int)
        combined['is_quarter_start'] = combined['ds'].dt.is_quarter_start.astype(int)
        combined['is_quarter_end'] = combined['ds'].dt.is_quarter_end.astype(int)
        combined['week_of_month'] = combined['ds'].dt.day // 7 + 1
        combined['month'] = combined['ds'].dt.month
        
        # Rolling features (shift=1 to use past data for current row)
        # Note: In training, we use shift() to get past values. 
        # For the future row, we want features based on previous rows.
        # The standard rolling() includes the current row by default. 
        # We need to be careful.
        # Training: y_rolling_4w at row T is mean(y[T-3]...y[T]). 
        # Wait, preprocess_zenith.py: 'y_rolling_4w' = rolling(window=4).mean()
        # This includes the current 'y'. But 'y' is the target!
        # Ah, preprocess_zenith.py calculates these on the raw data.
        # If 'y' is included in the feature, it's data leakage!
        # Let's check preprocess_zenith.py again.
        # It calculates 'y_rolling_4w' on 'y'.
        # Then it saves to CSV.
        # Then train_demand_lgb.py loads it.
        # Does it drop 'y' from features?
        # Yes: "drop_cols = ['ds', 'y']".
        # BUT 'y_rolling_4w' is KEPT.
        # If 'y_rolling_4w' includes 'y' (the target), then the model learns to just read 'y' from the rolling mean.
        # This is a classic leakage.
        # UNLESS 'y' in the training data is shifted?
        # No, 'y' is 'weekly_demand['Qty_Received']'.
        # 'y_rolling_4w' is 'y'.rolling(4).mean().
        # So 'y_rolling_4w' at time T contains y_T.
        # If the model uses this to predict y_T, it's cheating.
        # However, I must follow the existing model.
        # If the model was trained with leakage, I must provide the "leaked" feature (which I can't because I don't know y_T).
        # Wait, maybe I should look at 'y_lag_1w'.
        # 'y_lag_1w' = shift(1). So at T, it has y_{T-1}. This is safe.
        # If the model relies on 'y_rolling_4w', it's broken for inference.
        # BUT, let's assume the user wants me to use the model "as is".
        # If I can't provide y_T, I can't calculate y_rolling_4w correctly.
        # I will use the *previous* known values for the rolling mean.
        # i.e. for Future Row, y_rolling_4w = mean(last 4 known weeks).
        
        # Lag features
        combined['y_lag_1w'] = combined['y'].shift(1).fillna(0)
        combined['y_lag_4w'] = combined['y'].shift(4).fillna(0)
        
        # Rolling features (using shift(1) to ensure we only use past data)
        # We calculate rolling on the shifted series to avoid leakage/NaNs for future row
        y_shifted = combined['y'].shift(1)
        combined['y_rolling_4w'] = y_shifted.rolling(window=4, min_periods=1).mean()
        combined['y_rolling_8w'] = y_shifted.rolling(window=8, min_periods=1).mean()
        combined['y_rolling_12w'] = y_shifted.rolling(window=12, min_periods=1).mean()
        combined['y_volatility'] = y_shifted.rolling(window=4, min_periods=1).std().fillna(0)
        
        combined['order_count_trend'] = combined['order_count'].shift(1).rolling(window=4, min_periods=1).mean()
        combined['avg_order_size'] = combined['y_lag_1w'] / combined['order_count'].shift(1).replace(0, 1)
        
        # Fill NaNs
        combined = combined.fillna(0)
        
        # Select features for the future row
        future_features = combined.iloc[[-1]].copy()
        
        # Ensure columns match model expectation
        feature_cols = [
            "cost", "order_count", "medicine_count", "is_month_start", "is_month_end", 
            "is_quarter_start", "is_quarter_end", "week_of_month", "month", 
            "y_rolling_4w", "y_rolling_8w", "y_rolling_12w", "y_lag_1w", "y_lag_4w", 
            "order_count_trend", "avg_order_size", "y_volatility"
        ]
        
        # Filter/Order columns
        X = future_features[feature_cols]
        
        # Predict
        predicted_weekly = float(model.predict(X)[0])
        predicted_daily = max(0, predicted_weekly / 7.0)
        
        return predicted_daily
        
    except Exception as e:
        logger.error(f"Error in LightGBM demand prediction: {e}")
        return None


def get_demand_forecast_for_medicine(
    avg_daily_sales: float,
    std_deviation: float
) -> List[Dict[str, Any]]:
    """
    Get 4-week demand forecast for a medicine using ML predictions only.
    Returns empty list if ML model not available.
    """
    today = datetime.now()
    weekly_forecast = []
    
    # Try to get ML predictions
    ml_predictions = predict_demand(periods=28)
    
    if ml_predictions and len(ml_predictions) >= 28:
        # Calculate global baseline from Prophet (average of the 28 days)
        total_prophet_demand = sum(p["predicted_demand"] for p in ml_predictions)
        prophet_avg_daily = total_prophet_demand / 28 if total_prophet_demand > 0 else 1.0
        
        # Scale factor to convert global Prophet scale to medicine scale
        # We want the average of our forecast to match the medicine's average daily sales
        scale_factor = avg_daily_sales / prophet_avg_daily if prophet_avg_daily > 0 else 0
        
        for week in range(1, 5):
            week_start_idx = (week - 1) * 7
            week_end_idx = week * 7
            week_predictions = ml_predictions[week_start_idx:week_end_idx]
            
            if week_predictions:
                week_start = today + timedelta(days=(week - 1) * 7)
                
                # Sum up Prophet's daily predictions for this week
                week_prophet_demand = sum(p["predicted_demand"] for p in week_predictions)
                week_prophet_avg = week_prophet_demand / 7
                
                # Apply scaling
                predicted_daily = week_prophet_avg * scale_factor
                predicted_weekly = predicted_daily * 7
                
                # Calculate trend factor for UI/Debug
                trend_factor = week_prophet_avg / prophet_avg_daily if prophet_avg_daily > 0 else 1.0
                
                # Bounds
                week_prophet_lower = sum(p["lower_bound"] for p in week_predictions)
                week_prophet_upper = sum(p["upper_bound"] for p in week_predictions)
                lower_bound = (week_prophet_lower / 7) * scale_factor * 7
                upper_bound = (week_prophet_upper / 7) * scale_factor * 7
                
                weekly_forecast.append({
                    "week": week,
                    "week_start": week_start.strftime('%Y-%m-%d'),
                    "week_label": f"Week {week}",
                    "predicted_daily": round(predicted_daily, 1),
                    "predicted_weekly": round(predicted_weekly),
                    "lower_bound": max(0, round(lower_bound)),
                    "upper_bound": round(upper_bound),
                    "trend_factor": round(trend_factor, 2),
                    "source": "ML Model (Prophet)"
                })
    
    # No fallback - return empty if ML not available
    return weekly_forecast
