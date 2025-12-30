import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Thermometer,
  Droplets,
  FlaskConical,
  Wind,
  Waves,
  Upload,
  Calculator,
  PenTool,
  RotateCcw,
  Check,
  Eye,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { callMLPipeline, PredictionResult } from "@/lib/mlApi";

interface SensorInputProps {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
}

const SensorInput: React.FC<SensorInputProps> = ({
  icon,
  label,
  unit,
  value,
  onChange,
}) => (
  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 min-w-0 overflow-hidden">
    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <label className="text-[10px] text-muted-foreground block truncate">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 bg-transparent text-foreground text-sm font-medium focus:outline-none"
          placeholder="0"
        />
        <span className="text-[10px] text-muted-foreground flex-shrink-0">
          {unit}
        </span>
      </div>
    </div>
  </div>
);

const ValidatorScreen: React.FC = () => {
  const { setActiveTab, showToast, projects, addProject } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sensors, setSensors] = useState({
    temperature: "",
    salinity: "",
    ph: "",
    dissolvedO2: "",
    turbidity: "",
    humidity: "",
  });

  const [droneImage, setDroneImage] = useState<File | null>(null);
  const [droneImagePreview, setDroneImagePreview] = useState<string | null>(
    null
  );
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const updateSensor = (key: keyof typeof sensors) => (value: string) => {
    setSensors((prev) => ({ ...prev, [key]: value }));
    setApiError(null);
  };

  const handleDroneUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDroneImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDroneImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setDroneImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      showToast("success", "Drone Image Uploaded", "Ready to process");
      setApiError(null);
    }
  };

  const handleCalculateCarbon = async () => {
    // Validation
    if (!droneImage) {
      setApiError("Please upload a drone image first");
      showToast(
        "error",
        "Missing Drone Image",
        "Upload a drone image to proceed"
      );
      return;
    }

    if (
      !sensors.temperature ||
      !sensors.salinity ||
      !sensors.ph ||
      !sensors.humidity
    ) {
      setApiError("Please fill in all required sensor fields");
      showToast(
        "error",
        "Incomplete Data",
        "Temperature, Salinity, pH, and Humidity are required"
      );
      return;
    }

    setIsCalculating(true);
    setApiError(null);

    try {
      // Call ML API with sensor data and drone image
      const result = await callMLPipeline(
        droneImage,
        0.6, // mean_ndvi (default)
        parseFloat(sensors.temperature),
        parseFloat(sensors.humidity),
        parseFloat(sensors.ph),
        parseFloat(sensors.salinity)
      );

      if (result.status === "success") {
        setPredictionResult(result);
        showToast(
          "success",
          "Calculation Complete",
          `Carbon Credits: ${result.carbon_credits}`
        );

        // Add to projects
        const newProject = {
          id: Date.now().toString(),
          name: `Validation - ${new Date().toLocaleDateString()}`,
          hectares: result.area_hectare || 0,
          location: { lat: 0, lng: 0, address: "Field Survey" },
          photos: [],
          video: null,
          date: new Date().toISOString().split("T")[0],
          status: "under-review" as const,
          co2Tons: result.carbon_credits || 0,
        };
        addProject(newProject);
      } else {
        setApiError(result.message || "Failed to calculate carbon value");
        showToast(
          "error",
          "Calculation Failed",
          result.message || "Please try again"
        );
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An error occurred";
      setApiError(errorMsg);
      showToast("error", "API Error", errorMsg);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApplySignature = () => {
    showToast(
      "success",
      "Digital Signature Applied",
      "Verification submitted to blockchain."
    );
  };

  const handleReset = () => {
    setSensors({
      temperature: "",
      salinity: "",
      ph: "",
      dissolvedO2: "",
      turbidity: "",
      humidity: "",
    });
    setDroneImage(null);
    setDroneImagePreview(null);
    setPredictionResult(null);
    setApiError(null);
    showToast("info", "Form Reset", "All fields have been cleared.");
  };

  const verifiedProjects = projects.filter(
    (p) => p.status === "verified" || p.status === "under-review"
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="gradient-header pt-14 pb-8 px-5 relative">
        <button
          onClick={() => setActiveTab("home")}
          className="absolute top-14 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Validator Dashboard</h1>
          <p className="text-white/80 text-sm mt-1">
            Verify Blue Carbon Projects
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 -mt-4 scrollbar-hide">
        {/* IoT Sensor Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              🔬
            </span>
            IoT Sensor Inputs
          </h2>

          <div className="space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-3">
              <SensorInput
                icon={<Thermometer className="w-4 h-4" />}
                label="Temperature"
                unit="°C"
                value={sensors.temperature}
                onChange={updateSensor("temperature")}
              />
              <SensorInput
                icon={<Droplets className="w-4 h-4" />}
                label="Humidity"
                unit="%"
                value={sensors.humidity}
                onChange={updateSensor("humidity")}
              />
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-3">
              <SensorInput
                icon={<FlaskConical className="w-4 h-4" />}
                label="pH Level"
                unit="pH"
                value={sensors.ph}
                onChange={updateSensor("ph")}
              />
              <SensorInput
                icon={<Wind className="w-4 h-4" />}
                label="Salinity"
                unit="ppt"
                value={sensors.salinity}
                onChange={updateSensor("salinity")}
              />
            </div>
            {/* Row 3 */}
            <SensorInput
              icon={<Waves className="w-4 h-4" />}
              label="Turbidity"
              unit="NTU"
              value={sensors.turbidity}
              onChange={updateSensor("turbidity")}
            />
          </div>
        </motion.div>

        {/* Drone Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              🚁
            </span>
            Drone Image
          </h2>

          {droneImagePreview ? (
            <div className="mb-4">
              <img
                src={droneImagePreview}
                alt="Drone upload preview"
                className="w-full h-40 object-cover rounded-xl"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {droneImage?.name}
              </p>
            </div>
          ) : null}

          <button
            onClick={handleDroneUpload}
            className="btn-secondary flex items-center justify-center gap-2 w-full"
          >
            <Upload className="w-4 h-4" />
            <span>{droneImage ? "Change Image" : "Upload Drone Image"}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleDroneImageSelected}
            className="hidden"
          />
        </motion.div>

        {/* ML Carbon Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              🤖
            </span>
            ML Carbon Model
          </h2>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 mb-4">
              <p className="text-destructive text-sm">{apiError}</p>
            </div>
          )}

          {predictionResult && predictionResult.status === "success" && (
            <div className="space-y-3 mb-4">
              <div className="bg-success-light rounded-xl p-4">
                <p className="text-success font-semibold text-lg">
                  {predictionResult.carbon_credits} Credits
                </p>
                <p className="text-success/80 text-sm">
                  Carbon Credits Generated
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="font-semibold text-foreground">
                    {predictionResult.area_hectare?.toFixed(2)} ha
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Biomass</p>
                  <p className="font-semibold text-foreground">
                    {predictionResult.biomass_tons?.toFixed(2)} tons
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">
                  Growth Next Year
                </p>
                <p className="font-semibold text-foreground">
                  {predictionResult.growth_next_year?.toFixed(2)} tons
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleCalculateCarbon}
            disabled={isCalculating}
            className="btn-primary flex items-center justify-center gap-2 w-full"
          >
            <Calculator
              className={`w-4 h-4 ${isCalculating ? "animate-spin" : ""}`}
            />
            <span>
              {isCalculating ? "Calculating..." : "Calculate Blue Carbon Value"}
            </span>
          </button>
        </motion.div>

        {/* Verification Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              ✍️
            </span>
            Verification
          </h2>

          <div className="space-y-3">
            <button
              onClick={handleApplySignature}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Apply Digital Signature</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Form</span>
            </button>
          </div>
        </motion.div>

        {/* Approved Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              ✅
            </span>
            Verified Projects
          </h2>

          <div className="space-y-3">
            {verifiedProjects.map((project) => (
              <div key={project.id} className="card-elevated p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {project.co2Tons
                        ? `${project.co2Tons} tons CO₂`
                        : "Pending verification"}{" "}
                      • {project.date}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      project.status === "verified"
                        ? "bg-success-light text-success"
                        : "bg-warning-light text-warning-foreground"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span className="capitalize">
                      {project.status === "verified"
                        ? "Verified"
                        : "Under Verification"}
                    </span>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Evidence
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ValidatorScreen;
