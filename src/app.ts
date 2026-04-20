import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import morgan from "morgan";
import cors from "cors";
import toolRoutes from "../src/api/v1/routes/toolRoutes";
import rentalRoutes from "../src/api/v1/routes/rentalRoutes";
import reviewRoutes from "../src/api/v1/routes/reviewRoutes";
import adminRoutes from "../src/api/v1/routes/adminRoutes";
import setupSwagger from "../src/config/swagger";
import { getCorsOptions } from "./config/corsConfig";
import { getHelmetConfig } from "./config/helmetConfig";

const app = express();

app.use(getHelmetConfig());
app.use(cors(getCorsOptions()));

app.use(morgan("combined"));
app.use(express.json());

setupSwagger(app);

app.use("/api/v1/tools", toolRoutes);
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", adminRoutes);

export default app;