import express from "express";
import cors from "cors";
import { config } from "dotenv";

import dbConnection from "./src/db/dbConnection.js";
import { globalError } from "./src/middlewares/errorHandller.middleware.js";
import ApiError from "./src/utils/apiError.js";

import authRoutes from "./src/modules/auth/routes.js";
import userRoutes from "./src/modules/user/routes.js";
import patientRoutes from "./src/modules/patient/routes.js";
import queueRoutes from "./src/modules/queu/routes.js";
import ticketRoutes from "./src/modules/ticket/routes.js";
import clinicRoutes from "./src/modules/clinics/routes.js";
import pharmacyRoutes from "./src/modules/pharmacy/routes.js";
import medicationRoutes from "./src/modules/medication/routes.js";
import testTypeRoutes from "./src/modules/tests/routes.js";
import testOrderRoutes from "./src/modules/testOrder/routes.js";

config();

dbConnection();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
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
app.use("*", (req, res, next) => {
  next(new ApiError(`Can not find this route ${req.originalUrl}`, 400));
});
app.use(globalError);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
