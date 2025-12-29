import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ Import cookie-parser
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true // allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); // ✅ Enable cookie parsing

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
