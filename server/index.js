import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, ".env") });

import express from "express";
import cors from "cors";

import dbConnection from "./src/db/dbConnection.js";
import { globalError } from "./src/middlewares/errorHandller.middleware.js";
import ApiError from "./src/utils/apiError.js";

import authRoutes from "./src/modules/auth/routes.js";
import userRoutes from "./src/modules/user/routes.js";
import patientRoutes from "./src/modules/patient/routes.js";
import queueRoutes from "./src/modules/queue/routes.js";
import ticketRoutes from "./src/modules/ticket/routes.js";
import clinicRoutes from "./src/modules/clinics/routes.js";
import pharmacyRoutes from "./src/modules/pharmacy/routes.js";
import medicationRoutes from "./src/modules/medication/routes.js";
import testTypeRoutes from "./src/modules/tests/routes.js";
import testOrderRoutes from "./src/modules/testOrder/routes.js";
import adsRoutes from "./src/modules/ads/ad.routes.js";

dbConnection();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://hospital-vercel.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const port = process.env.PORT;



app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/queue", queueRoutes);
app.use("/tickets", ticketRoutes);
app.use("/clinics", clinicRoutes);
app.use("/prescriptions", pharmacyRoutes);
app.use("/medications", medicationRoutes);
app.use("/test-types", testTypeRoutes);
app.use("/test-orders", testOrderRoutes);
app.use("/ads", adsRoutes);

app.use("*", (req, res, next) => {
  next(new ApiError(`Cannot find this route: ${req.originalUrl}`, 404));
});

app.use(globalError);

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
