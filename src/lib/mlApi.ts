// ML API service for communicating with the backend
const ML_API_BASE_URL = "http://127.0.0.1:8000";

export interface PredictionResult {
  status: "success" | "error";
  area_hectare?: number;
  biomass_tons?: number;
  growth_next_year?: number;
  carbon_credits?: number;
  message?: string;
}

export const callMLPipeline = async (
  imageFile: File,
  meanNdvi: number = 0.6,
  temperature: number,
  humidity: number,
  ph: number,
  salinity: number
): Promise<PredictionResult> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("mean_ndvi", meanNdvi.toString());
    formData.append("temp", temperature.toString());
    formData.append("humidity", humidity.toString());
    formData.append("ph", ph.toString());
    formData.append("salinity", salinity.toString());

    const response = await fetch(`${ML_API_BASE_URL}/predict/full`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data: PredictionResult = await response.json();
    return data;
  } catch (error) {
    console.error("ML API Error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to connect to ML API",
    };
  }
};

export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${ML_API_BASE_URL}/`, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    console.error("API Health Check Failed:", error);
    return false;
  }
};
