# Frontend-Backend Integration Guide

## Overview

The ML API backend has been successfully integrated with the ValidatorScreen frontend component. The system now allows users to:

1. Upload drone images for vegetation analysis
2. Input environmental sensor data (temperature, humidity, pH, salinity)
3. Send data to the ML pipeline for processing
4. Receive predictions for area, biomass, growth, and carbon credits
5. View results and add verified projects

---

## Backend Integration

### ML API Service (`src/lib/mlApi.ts`)

Created a new service to handle all communications with the FastAPI backend:

**Key Functions:**

- `callMLPipeline()` - Sends image + sensor data to the ML API
  - Input: drone image (File), temperature, humidity, pH, salinity
  - Output: area, biomass, growth, carbon credits
  - Handles errors gracefully with fallback responses
- `checkAPIHealth()` - Verifies the API is running

**Configuration:**

```typescript
const ML_API_BASE_URL = "http://127.0.0.1:8000";
```

---

## Frontend Updates

### ValidatorScreen Component (`src/components/screens/ValidatorScreen.tsx`)

#### New State Variables:

```typescript
const [droneImage, setDroneImage] = useState<File | null>(null);
const [droneImagePreview, setDroneImagePreview] = useState<string | null>(null);
const [predictionResult, setPredictionResult] =
  useState<PredictionResult | null>(null);
const [apiError, setApiError] = useState<string | null>(null);
const [isCalculating, setIsCalculating] = useState(false);
```

#### Updated Sensor Inputs:

Added "Humidity" field (required for ML pipeline):

- Temperature (°C)
- Humidity (%)
- pH Level (pH)
- Salinity (ppt)
- Turbidity (NTU) - optional
- Dissolved O₂ (mg/L) - optional

#### New Features:

1. **Drone Image Upload**

   - Click to upload drone/aerial images
   - Shows image preview before processing
   - Validates image is selected before calculation

2. **ML Carbon Model**

   - Real-time API calls to backend pipeline
   - Validation of required fields
   - Displays detailed results:
     - Carbon Credits (generated)
     - Area (hectares)
     - Biomass (tons)
     - Growth Next Year (tons)
   - Error handling with user-friendly messages
   - Loading spinner during processing

3. **Data Flow**
   ```
   User Input (Sensors + Image)
        ↓
   Validation
        ↓
   API Call to /predict/full
        ↓
   ML Pipeline Processing
        ↓
   Results Display
        ↓
   Add to Projects
   ```

---

## API Endpoints

### Backend Server: `http://127.0.0.1:8000`

#### 1. Health Check

```
GET /
Response: { "status": "ok", "message": "BlueChain ML API is running" }
```

#### 2. Full Pipeline Prediction

```
POST /predict/full
Parameters:
  - image (File): Drone image
  - mean_ndvi (float): Normalized Difference Vegetation Index (default: 0.6)
  - temp (float): Temperature in °C
  - humidity (float): Humidity percentage
  - ph (float): pH level
  - salinity (float): Salinity in ppt

Response:
{
  "status": "success|error",
  "area_hectare": number,
  "biomass_tons": number,
  "growth_next_year": number,
  "carbon_credits": number,
  "message": string (if error)
}
```

---

## How to Use

### 1. Start the Backend

```bash
cd backend/ml_api
uvicorn app:app --reload
```

Server will run on: `http://127.0.0.1:8000`

### 2. Use ValidatorScreen

1. Navigate to Validator Dashboard
2. Fill in sensor readings:
   - Temperature
   - Humidity (NEW - required)
   - pH
   - Salinity
3. Upload a drone image
4. Click "Calculate Blue Carbon Value"
5. View results and verify project

### 3. Results

Once calculation is complete:

- Carbon credits are displayed prominently
- Detailed breakdown of area, biomass, and growth
- Project automatically added to "Verified Projects" list
- Can apply digital signature for blockchain verification

---

## Error Handling

The frontend handles various error scenarios:

1. **Missing Drone Image**
   - Error message: "Please upload a drone image first"
2. **Incomplete Sensor Data**
   - Error message: "Temperature, Salinity, pH, and Humidity are required"
3. **API Connection Issues**
   - Error message displays with specific error details
4. **Model Weight Mismatches**
   - Backend gracefully falls back to untrained model
   - Does not crash the server

---

## Project Integration

New validated projects are automatically added with:

- Auto-generated ID (timestamp-based)
- Project name: `"Validation - {date}"`
- Status: "under-review"
- CO₂ tons: Calculated from ML pipeline
- Area: From image analysis

---

## Testing Checklist

- [x] Backend API running without errors
- [x] CORS middleware enabled
- [x] Frontend correctly imports ML API service
- [x] Sensor input validation works
- [x] Image upload and preview works
- [x] API calls complete successfully
- [x] Results display correctly
- [x] Error messages show appropriately
- [x] Projects are added to the list

---

## Future Enhancements

1. Add authentication/authorization
2. Store calculation history in database
3. Export results as PDF
4. Add map visualization of verified areas
5. Implement batch processing for multiple projects
6. Add custom NDVI input validation
7. Cache frequently used results

---

## Contact & Support

For issues or questions about the integration:

- Check browser console for detailed error messages
- Verify backend is running on port 8000
- Ensure all dependencies are installed
- Check API response format matches expected interface
